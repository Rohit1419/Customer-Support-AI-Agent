import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AiModule } from 'src/ai/ai.module';
import { KnowledgeBaseModule } from 'src/knowledge/knowledge.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [AiModule, PrismaModule, KnowledgeBaseModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
