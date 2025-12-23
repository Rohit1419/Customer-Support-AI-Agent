import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { sendMessageDto } from './dto';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('chat/message')
  async sendMessage(@Body() dto: sendMessageDto) {
    return this.chatService.generateChatResponse(dto.message, dto.sessionId);
  }
}
