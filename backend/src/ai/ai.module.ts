import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { McpClientService } from './mcp-client.service';

@Module({
  providers: [AiService, McpClientService],
  exports: [AiService],
})
export class AiModule {}
