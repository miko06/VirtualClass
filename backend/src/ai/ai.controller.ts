import { Body, Controller, Post } from "@nestjs/common";
import { AiService } from "./ai.service";
import { ChatRequestDto } from "./dto/chat.dto";

@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @Post("chat")
  chat(@Body() dto: ChatRequestDto) {
    return this.aiService.chat(dto.messages);
  }
}

