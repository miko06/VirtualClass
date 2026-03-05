import { BadGatewayException, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { promises as fs } from "node:fs";
import * as path from "node:path";
import { ChatMessageDto } from "./dto/chat.dto";

type ProjectFile = {
  path: string;
  pathLower: string;
  content: string;
  previewLower: string;
};

type ChatResult = {
  reply: string;
  model: string;
  filesUsed: string[];
  filesScanned: number;
  contextMode: "project" | "light";
};

@Injectable()
export class AiService {
  private readonly ollamaBaseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
  private readonly preferredModel = process.env.OLLAMA_MODEL ?? "minimax-m2.5";
  private readonly fallbackModels = ["qwen2.5:7b", "llama3.1:8b", "llama3.2:3b", "gemma2:9b"];
  private readonly workspaceRoot = process.env.PROJECT_ROOT ?? path.resolve(process.cwd(), "..");
  private readonly maxContextFiles = Number(process.env.AI_MAX_CONTEXT_FILES ?? 8);
  private readonly maxFileChars = Number(process.env.AI_MAX_FILE_CHARS ?? 3000);
  private readonly maxContextChars = Number(process.env.AI_MAX_CONTEXT_CHARS ?? 40_000);
  private readonly modelCacheTtlMs = Number(process.env.AI_MODEL_CACHE_TTL_MS ?? 10 * 60_000);
  private readonly projectCacheTtlMs = Number(process.env.AI_PROJECT_CACHE_TTL_MS ?? 5 * 60_000);
  private readonly responseTemperature = Number(process.env.AI_TEMPERATURE ?? 0.2);
  private readonly maxResponseTokens = Number(process.env.AI_NUM_PREDICT ?? 384);
  private readonly contextWindow = Number(process.env.AI_NUM_CTX ?? 4096);
  private readonly ollamaKeepAlive = process.env.OLLAMA_KEEP_ALIVE ?? "30m";

  private readonly ignoreDirs = new Set([
    ".git",
    "node_modules",
    "dist",
    "build",
    "coverage",
    ".next",
    ".nuxt",
    ".vite",
    ".idea",
    ".vscode",
  ]);

  private readonly textExtensions = new Set([
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
    ".json",
    ".md",
    ".css",
    ".scss",
    ".less",
    ".html",
    ".htm",
    ".yml",
    ".yaml",
    ".env",
    ".txt",
    ".prisma",
    ".sql",
    ".sh",
    ".py",
    ".xml",
    ".svg",
  ]);

  private modelCache: { model: string; expiresAt: number } | null = null;
  private projectCache: { files: ProjectFile[]; expiresAt: number } | null = null;

  async chat(messages: ChatMessageDto[]): Promise<ChatResult> {
    return this.streamChat(messages);
  }

  async streamChat(messages: ChatMessageDto[], onDelta?: (chunk: string) => void): Promise<ChatResult> {
    const model = await this.resolveModel();
    const userQuery = this.extractUserQuery(messages);
    const context = await this.buildFileContext(userQuery);

    const systemPrompt = [
      "Ты ИИ-ассистент VirtualClass.",
      "У тебя есть серверный доступ к файлам проекта веб-сайта.",
      "Используй контекст файлов ниже как источник истины.",
      "Если данных недостаточно, честно скажи об этом.",
      "",
      context.systemContext,
    ].join("\n");

    const response = await fetch(`${this.ollamaBaseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: true,
        keep_alive: this.ollamaKeepAlive,
        options: {
          temperature: this.responseTemperature,
          num_predict: this.maxResponseTokens,
          num_ctx: this.contextWindow,
        },
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
    }).catch((error: unknown) => {
      throw new ServiceUnavailableException(
        `Не удалось подключиться к Ollama (${String(error)}). Запустите: ollama serve`,
      );
    });

    if (!response.ok) {
      const details = await response.text().catch(() => "");
      throw new BadGatewayException(`Ошибка Ollama (${response.status}): ${details || "empty response"}`);
    }

    const reply = await this.readOllamaStream(response, onDelta);
    if (!reply.trim()) {
      throw new BadGatewayException("Ollama вернул пустой ответ");
    }

    return {
      reply,
      model,
      filesUsed: context.filesUsed,
      filesScanned: context.totalFiles,
      contextMode: context.mode,
    };
  }

  private async resolveModel(): Promise<string> {
    const now = Date.now();
    if (this.modelCache && this.modelCache.expiresAt > now) {
      return this.modelCache.model;
    }

    const response = await fetch(`${this.ollamaBaseUrl}/api/tags`).catch((error: unknown) => {
      throw new ServiceUnavailableException(
        `Не удалось получить список моделей Ollama (${String(error)}). Запустите: ollama serve`,
      );
    });

    if (!response.ok) {
      throw new ServiceUnavailableException(`Ollama /api/tags вернул ${response.status}`);
    }

    const payload = (await response.json()) as { models?: Array<{ name?: string }> };
    const names = (payload.models ?? [])
      .map((m) => m.name?.trim())
      .filter((name): name is string => Boolean(name));

    if (!names.length) {
      throw new ServiceUnavailableException("В Ollama нет загруженных моделей. Выполните: ollama pull <model>");
    }

    const model =
      (names.includes(this.preferredModel) && this.preferredModel) ||
      this.fallbackModels.find((candidate) => names.includes(candidate)) ||
      names[0];

    this.modelCache = { model, expiresAt: now + this.modelCacheTtlMs };
    return model;
  }

  private async readOllamaStream(response: Response, onDelta?: (chunk: string) => void): Promise<string> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new BadGatewayException("Пустой stream от Ollama");
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let result = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line) as { message?: { content?: string } };
          if (parsed.message?.content) {
            result += parsed.message.content;
            onDelta?.(parsed.message.content);
          }
        } catch {
          // Ignore malformed NDJSON line.
        }
      }
    }

    buffer += decoder.decode();
    if (buffer.trim()) {
      try {
        const parsed = JSON.parse(buffer) as { message?: { content?: string } };
        if (parsed.message?.content) {
          result += parsed.message.content;
          onDelta?.(parsed.message.content);
        }
      } catch {
        // Ignore trailing malformed data.
      }
    }

    return result;
  }

  private extractUserQuery(messages: ChatMessageDto[]): string {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].role === "user" && messages[i].content.trim()) {
        return messages[i].content;
      }
    }
    return "";
  }

  private async buildFileContext(query: string): Promise<{
    systemContext: string;
    filesUsed: string[];
    totalFiles: number;
    mode: "project" | "light";
  }> {
    if (!this.shouldAttachProjectContext(query)) {
      return {
        systemContext: [
          "Режим: быстрый ответ без чтения файлов проекта.",
          "Если для точного ответа нужен код проекта, попроси пользователя уточнить запрос с названием файла или модуля.",
        ].join("\n"),
        filesUsed: [],
        totalFiles: this.projectCache?.files.length ?? 0,
        mode: "light",
      };
    }

    const allFiles = await this.getProjectFiles();
    const tokens = this.tokenize(query);

    const scored = allFiles
      .map((file) => ({
        file,
        score: this.scoreFile(file, tokens),
      }))
      .sort((a, b) => b.score - a.score || a.file.path.localeCompare(b.file.path));

    const hasMatches = scored.some((s) => s.score > 0);
    const selected = (hasMatches ? scored.filter((s) => s.score > 0) : scored).slice(0, this.maxContextFiles);

    const filesUsed: string[] = [];
    let totalChars = 0;
    const snippets: string[] = [];

    for (const { file } of selected) {
      if (totalChars >= this.maxContextChars) break;

      const remaining = this.maxContextChars - totalChars;
      const cut = Math.min(this.maxFileChars, remaining);
      const snippet = file.content.slice(0, cut);
      totalChars += snippet.length;
      filesUsed.push(file.path);
      snippets.push(`### ${file.path}\n\`\`\`\n${snippet}\n\`\`\``);
    }

    const systemContext = [
      `Режим: анализ кода проекта. Проиндексировано файлов: ${allFiles.length}.`,
      "Релевантные фрагменты файлов:",
      snippets.length ? snippets.join("\n\n") : "Нет релевантных фрагментов для текущего запроса.",
    ].filter(Boolean).join("\n");

    return { systemContext, filesUsed, totalFiles: allFiles.length, mode: "project" };
  }

  private async getProjectFiles(): Promise<ProjectFile[]> {
    const now = Date.now();
    if (this.projectCache && this.projectCache.expiresAt > now) {
      return this.projectCache.files;
    }

    const paths: string[] = [];
    await this.walkDirectory(this.workspaceRoot, paths);

    const loaded = await Promise.all(paths.map(async (absPath): Promise<ProjectFile | null> => {
      try {
        const stat = await fs.stat(absPath);
        if (!stat.isFile() || stat.size > 512 * 1024) return null;
        const content = await fs.readFile(absPath, "utf8");
        if (!content || content.includes("\u0000")) return null;

        const rel = path.relative(this.workspaceRoot, absPath).split(path.sep).join("/");
        return {
          path: rel,
          pathLower: rel.toLowerCase(),
          content,
          previewLower: content.slice(0, 2000).toLowerCase(),
        };
      } catch {
        // Skip unreadable files.
        return null;
      }
    }));

    const files = loaded.filter((file): file is ProjectFile => Boolean(file));
    this.projectCache = { files, expiresAt: now + this.projectCacheTtlMs };
    return files;
  }

  private async walkDirectory(dir: string, output: string[]): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (this.ignoreDirs.has(entry.name)) continue;
        await this.walkDirectory(fullPath, output);
        continue;
      }

      if (!entry.isFile()) continue;
      if (!this.isCandidateFile(entry.name)) continue;

      output.push(fullPath);
    }
  }

  private isCandidateFile(fileName: string): boolean {
    if (fileName.endsWith(".lock")) return false;
    if (fileName.endsWith(".min.js")) return false;
    if (fileName === "package-lock.json") return false;
    if (fileName === "yarn.lock") return false;
    if (fileName === "pnpm-lock.yaml") return false;
    if (fileName === "bun.lockb") return false;
    if (fileName.startsWith(".")) return fileName === ".env" || fileName === ".env.example";

    const ext = path.extname(fileName).toLowerCase();
    return this.textExtensions.has(ext);
  }

  private tokenize(text: string): string[] {
    const tokens = text.toLowerCase().match(/[a-zа-я0-9_./-]{3,}/gi) ?? [];
    return [...new Set(tokens)].slice(0, 20);
  }

  private scoreFile(file: ProjectFile, tokens: string[]): number {
    if (!tokens.length) return 0;

    let score = 0;

    for (const token of tokens) {
      if (file.pathLower.includes(token)) {
        score += 8;
      }

      if (file.previewLower.includes(token)) {
        score += 2;
      }
    }

    return score;
  }

  private shouldAttachProjectContext(query: string): boolean {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return false;

    if (normalized.includes("```")) return true;
    if (normalized.includes("/") || normalized.includes("\\")) return true;
    if (/\.(ts|tsx|js|jsx|json|prisma|sql|yml|yaml|md|css|scss|html|sh|py)\b/i.test(normalized)) return true;

    return /(код|code|файл|file|проект|project|репозитор|repo|ошиб|error|exception|stack|trace|api|endpoint|controller|service|module|component|frontend|backend|docker|compose|nginx|postgres|prisma|schema|migration|sql|ssh|firewall|backup|config|конфиг)/i.test(
      normalized,
    );
  }
}
