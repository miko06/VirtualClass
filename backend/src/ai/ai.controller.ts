import { Body, Controller, Post, Res } from "@nestjs/common";
import type { Response as ExpressResponse } from "express";
import { AiService } from "./ai.service";
import { ChatRequestDto } from "./dto/chat.dto";

@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @Post("chat")
  chat(@Body() dto: ChatRequestDto) {
    return this.aiService.chat(dto.messages);
  }

  @Post("chat/stream")
  async chatStream(@Body() dto: ChatRequestDto, @Res() res: ExpressResponse): Promise<void> {
    res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    try {
      const result = await this.aiService.streamChat(dto.messages, (chunk) => {
        this.writeStreamLine(res, { type: "chunk", chunk });
      });

      this.writeStreamLine(res, {
        type: "done",
        reply: result.reply,
        model: result.model,
        filesUsed: result.filesUsed,
        filesScanned: result.filesScanned,
        contextMode: result.contextMode,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown AI error";
      this.writeStreamLine(res, { type: "error", message });
    } finally {
      res.end();
    }
  }

  private writeStreamLine(res: ExpressResponse, payload: Record<string, unknown>): void {
    if (res.writableEnded || res.destroyed) return;
    res.write(`${JSON.stringify(payload)}\n`);
  }
}
