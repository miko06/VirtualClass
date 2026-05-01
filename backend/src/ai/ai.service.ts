import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ChatMessageDto } from './dto/chat.dto';

type ChatResult = {
  reply: string;
  model: string;
  filesUsed: string[];
  filesScanned: number;
  contextMode: 'n8n';
};

const REQUEST_TIMEOUT_MS = 120_000;
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 3000, 9000];

@Injectable()
export class AiService {
  private readonly n8nWebhookUrl =
    process.env.N8N_WEBHOOK_URL ?? 'http://n8n:5678/webhook/virtualclass-ai';

  async chat(messages: ChatMessageDto[]): Promise<ChatResult> {
    return this.streamChat(messages);
  }

  async streamChat(
    messages: ChatMessageDto[],
    onDelta?: (chunk: string) => void,
  ): Promise<ChatResult> {
    let lastError: unknown;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await this.fetchWithTimeout(this.n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
          const details = await response.text().catch(() => '');
          const err = new Error(
            `n8n returned ${response.status}: ${details || 'empty response'}`,
          );
          // don't retry client errors
          if (response.status >= 400 && response.status < 500) {
            throw new BadGatewayException(err.message);
          }
          throw err;
        }

        const contentType = response.headers.get('content-type') || '';

        if (
          contentType.includes('text/event-stream') ||
          contentType.includes('application/x-ndjson')
        ) {
          const reply = await this.readStream(response, onDelta);
          if (!reply.trim()) {
            throw new BadGatewayException('n8n вернул пустой ответ');
          }
          return {
            reply,
            model: 'n8n-ai-agent',
            filesUsed: [],
            filesScanned: 0,
            contextMode: 'n8n',
          };
        }

        const data = await response.json().catch(() => null);
        const reply =
          typeof data === 'string'
            ? data
            : (data?.choices?.[0]?.message?.content ??
              data?.output ??
              data?.reply ??
              data?.message?.content ??
              data?.message ??
              '');

        if (!reply.trim()) {
          throw new BadGatewayException('n8n вернул пустой ответ');
        }

        onDelta?.(reply);

        const model =
          typeof data === 'object' && data?.model ? data.model : 'n8n-ai-agent';

        return {
          reply,
          model,
          filesUsed: [],
          filesScanned: 0,
          contextMode: 'n8n',
        };
      } catch (error: unknown) {
        lastError = error;
        if (
          error instanceof BadGatewayException ||
          error instanceof ServiceUnavailableException
        ) {
          throw error;
        }
        if (attempt < MAX_RETRIES - 1) {
          const delay = RETRY_DELAYS[attempt] ?? 3000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    const msg =
      lastError instanceof Error ? lastError.message : String(lastError);
    throw new ServiceUnavailableException(
      `n8n недоступен после ${MAX_RETRIES} попыток (${msg}). Убедитесь что n8n запущен и workflow активирован.`,
    );
  }

  private async fetchWithTimeout(
    url: string,
    init: RequestInit,
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      return response;
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error(
          `Таймаут запроса к n8n (${REQUEST_TIMEOUT_MS / 1000}с)`,
        );
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async readStream(
    response: Response,
    onDelta?: (chunk: string) => void,
  ): Promise<string> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new BadGatewayException('Пустой stream от n8n');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let result = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.trim()) continue;

        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const chunk = parsed.content ?? parsed.chunk ?? parsed.delta ?? '';
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
          const chunk =
            parsed.content ??
            parsed.chunk ??
            parsed.delta ??
            parsed.message?.content ??
            '';
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
      if (buffer.startsWith('data: ')) {
        const data = buffer.slice(6).trim();
        if (data !== '[DONE]') {
          result += data;
          onDelta?.(data);
        }
      } else {
        try {
          const parsed = JSON.parse(buffer);
          const chunk =
            parsed.content ??
            parsed.chunk ??
            parsed.delta ??
            parsed.message?.content ??
            '';
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
