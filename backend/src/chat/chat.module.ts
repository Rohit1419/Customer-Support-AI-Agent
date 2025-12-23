import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AiModule } from 'src/ai/ai.module';
import { KnowledgeBaseModule } from 'src/knowledge-base/knowledge-base.module';

@Module({
  imports: [AiModule, KnowledgeBaseModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
