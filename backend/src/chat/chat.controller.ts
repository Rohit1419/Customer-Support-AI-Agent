import { Body, Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { sendMessageDto } from './dto';
import { QuotaGuard } from './gaurd';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('/message')
  @UseGuards(QuotaGuard)
  async sendMessage(@Body() dto: sendMessageDto) {
    return this.chatService.getChatResponse(dto.message, dto.sessionId);
  }

  @Get('history/:sessionId')
  // i know i should use diff. dto, but i dont want to make another one for just one param
  async getChatHistory(@Param('sessionId') sessionId: string) {
    return this.chatService.getChatHistory(sessionId);
  }
}
