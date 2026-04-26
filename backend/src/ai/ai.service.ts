import { BadGatewayException, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ChatMessageDto } from "./dto/chat.dto";

type ChatResult = {
  reply: string;
  model: string;
  filesUsed: string[];
  filesScanned: number;
  contextMode: "n8n";
};

@Injectable()
export class AiService {
  private readonly n8nWebhookUrl = process.env.N8N_WEBHOOK_URL ?? "http://n8n:5678/webhook/virtualclass-ai";

  async chat(messages: ChatMessageDto[]): Promise<ChatResult> {
    return this.streamChat(messages);
  }

  async streamChat(messages: ChatMessageDto[], onDelta?: (chunk: string) => void): Promise<ChatResult> {
    const response = await fetch(this.n8nWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    }).catch((error: unknown) => {
      throw new ServiceUnavailableException(
        `Не удалось подключиться к n8n (${String(error)}). Убедитесь что n8n запущен.`,
      );
    });

    if (!response.ok) {
      const details = await response.text().catch(() => "");
      throw new BadGatewayException(`Ошибка n8n (${response.status}): ${details || "empty response"}`);
    }

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("text/event-stream") || contentType.includes("application/x-ndjson")) {
      const reply = await this.readStream(response, onDelta);
      if (!reply.trim()) {
        throw new BadGatewayException("n8n вернул пустой ответ");
      }
      return {
        reply,
        model: "n8n-ai-agent",
        filesUsed: [],
        filesScanned: 0,
        contextMode: "n8n",
      };
    }

    const data = await response.json().catch(() => null);
    const reply = typeof data === "string"
      ? data
      : data?.choices?.[0]?.message?.content
        ?? data?.output
        ?? data?.reply
        ?? data?.message?.content
        ?? data?.message
        ?? "";

    if (!reply.trim()) {
      throw new BadGatewayException("n8n вернул пустой ответ");
    }

    onDelta?.(reply);

    const model = typeof data === "object" && data?.model ? data.model : "n8n-ai-agent";

    return {
      reply,
      model,
      filesUsed: [],
      filesScanned: 0,
      contextMode: "n8n",
    };
  }

  private async readStream(response: Response, onDelta?: (chunk: string) => void): Promise<string> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new BadGatewayException("Пустой stream от n8n");
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

        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const chunk = parsed.content ?? parsed.chunk ?? parsed.delta ?? "";
            if (chunk) {
              result += chunk;
              onDelta?.(chunk);
            }
          } catch {
            result += data;
            onDelta?.(data);
          }
          continue;
        }

        try {
          const parsed = JSON.parse(line);
          const chunk = parsed.content ?? parsed.chunk ?? parsed.delta ?? parsed.message?.content ?? "";
          if (chunk) {
            result += chunk;
            onDelta?.(chunk);
          }
        } catch {
          result += line;
          onDelta?.(line);
        }
      }
    }

    buffer += decoder.decode();
    if (buffer.trim()) {
      if (buffer.startsWith("data: ")) {
        const data = buffer.slice(6).trim();
        if (data !== "[DONE]") {
          result += data;
          onDelta?.(data);
        }
      } else {
        try {
          const parsed = JSON.parse(buffer);
          const chunk = parsed.content ?? parsed.chunk ?? parsed.delta ?? parsed.message?.content ?? "";
          if (chunk) {
            result += chunk;
            onDelta?.(chunk);
          }
        } catch {
          result += buffer;
          onDelta?.(buffer);
        }
      }
    }

    return result;
  }
}
