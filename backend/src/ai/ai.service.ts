import { BadGatewayException, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { promises as fs } from "node:fs";
import * as path from "node:path";
import { ChatMessageDto } from "./dto/chat.dto";

type ProjectFile = {
  path: string;
  content: string;
};

@Injectable()
export class AiService {
  private readonly ollamaBaseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
  private readonly preferredModel = process.env.OLLAMA_MODEL ?? "minimax-m2.5";
  private readonly fallbackModels = ["qwen2.5:7b", "llama3.1:8b", "llama3.2:3b", "gemma2:9b"];
  private readonly workspaceRoot = path.resolve(process.cwd(), "..");
  private readonly maxContextFiles = Number(process.env.AI_MAX_CONTEXT_FILES ?? 20);
  private readonly maxFileChars = Number(process.env.AI_MAX_FILE_CHARS ?? 8000);
  private readonly maxContextChars = Number(process.env.AI_MAX_CONTEXT_CHARS ?? 160000);
  private readonly maxListedPaths = Number(process.env.AI_MAX_LISTED_PATHS ?? 1200);

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

  async chat(messages: ChatMessageDto[]) {
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

    const reply = await this.readOllamaStream(response);
    if (!reply.trim()) {
      throw new BadGatewayException("Ollama вернул пустой ответ");
    }

    return {
      reply,
      model,
      filesUsed: context.filesUsed,
      filesScanned: context.totalFiles,
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

    this.modelCache = { model, expiresAt: now + 60_000 };
    return model;
  }

  private async readOllamaStream(response: Response): Promise<string> {
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
          }
        } catch {
          // Ignore malformed NDJSON line.
        }
      }
    }

    if (buffer.trim()) {
      try {
        const parsed = JSON.parse(buffer) as { message?: { content?: string } };
        if (parsed.message?.content) {
          result += parsed.message.content;
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
  }> {
    const allFiles = await this.getProjectFiles();
    const tokens = this.tokenize(query);

    const scored = allFiles
      .map((file) => ({
        file,
        score: this.scoreFile(file, tokens),
      }))
      .sort((a, b) => b.score - a.score || a.file.path.localeCompare(b.file.path));

    const selected = (scored.some((s) => s.score > 0) ? scored : scored.slice(0)).slice(0, this.maxContextFiles);

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

    const sortedPaths = allFiles.map((f) => f.path).sort((a, b) => a.localeCompare(b));
    const listedPaths = sortedPaths.slice(0, this.maxListedPaths);
    const hiddenCount = sortedPaths.length - listedPaths.length;

    const systemContext = [
      `Всего файлов проекта проиндексировано: ${sortedPaths.length}.`,
      "Список файлов проекта:",
      ...listedPaths.map((p) => `- ${p}`),
      hiddenCount > 0 ? `- ... и ещё ${hiddenCount} файлов` : "",
      "",
      "Релевантные фрагменты файлов:",
      snippets.length ? snippets.join("\n\n") : "Нет релевантных фрагментов для текущего запроса.",
    ].filter(Boolean).join("\n");

    return { systemContext, filesUsed, totalFiles: sortedPaths.length };
  }

  private async getProjectFiles(): Promise<ProjectFile[]> {
    const now = Date.now();
    if (this.projectCache && this.projectCache.expiresAt > now) {
      return this.projectCache.files;
    }

    const paths: string[] = [];
    await this.walkDirectory(this.workspaceRoot, paths);

    const files: ProjectFile[] = [];
    for (const absPath of paths) {
      try {
        const stat = await fs.stat(absPath);
        if (!stat.isFile() || stat.size > 512 * 1024) continue;
        const content = await fs.readFile(absPath, "utf8");
        if (!content || content.includes("\u0000")) continue;

        const rel = path.relative(this.workspaceRoot, absPath).split(path.sep).join("/");
        files.push({ path: rel, content });
      } catch {
        // Skip unreadable files.
      }
    }

    this.projectCache = { files, expiresAt: now + 30_000 };
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
    const tokens = text.toLowerCase().match(/[a-zа-я0-9_]{3,}/gi) ?? [];
    return [...new Set(tokens)].slice(0, 30);
  }

  private scoreFile(file: ProjectFile, tokens: string[]): number {
    if (!tokens.length) return 0;

    const pathLower = file.path.toLowerCase();
    const contentLower = file.content.toLowerCase();
    let score = 0;

    for (const token of tokens) {
      if (pathLower.includes(token)) {
        score += 8;
      }

      const index = contentLower.indexOf(token);
      if (index !== -1) {
        score += 2;
      }
    }

    return score;
  }
}

