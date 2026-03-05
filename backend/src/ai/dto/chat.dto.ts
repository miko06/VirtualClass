import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsIn, IsString, MaxLength, ValidateNested } from "class-validator";

export class ChatMessageDto {
  @IsIn(["system", "user", "assistant"])
  role: "system" | "user" | "assistant";

  @IsString()
  @MaxLength(8000)
  content: string;
}

export class ChatRequestDto {
  @IsArray()
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];
}

