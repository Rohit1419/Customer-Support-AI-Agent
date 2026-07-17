import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import type { DynamicStructuredTool } from '@langchain/core/tools';

// Connects to the store's own MCP server so this agent can pick up
// whatever tools (order lookup, inventory, returns, etc.) that store exposes,
// without this codebase knowing anything about a specific e-commerce platform.
@Injectable()
export class McpClientService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(McpClientService.name);
  private client: MultiServerMCPClient | null = null;
  private tools: DynamicStructuredTool[] = [];

  constructor(private config: ConfigService) {}

  async onModuleInit() {
    const url = this.config.get<string>('MCP_SERVER_URL');

    // Tools are optional: a store that hasn't stood up an MCP server yet
    // should still get a working RAG-only support agent, not a crash.
    if (!url) {
      this.logger.warn(
        'MCP_SERVER_URL not set — running without store tools (RAG-only mode).',
      );
      return;
    }

    const authToken = this.config.get<string>('MCP_SERVER_AUTH_TOKEN');

    this.client = new MultiServerMCPClient({
      throwOnLoadError: false,
      onConnectionError: 'ignore',
      mcpServers: {
        store: {
          transport: 'http', // Streamable HTTP transport (MCP's remote transport)
          url,
          headers: authToken
            ? { Authorization: `Bearer ${authToken}` }
            : undefined,
        },
      },
    });

    try {
      this.tools = await this.client.getTools();
      this.logger.log(
        `Connected to store MCP server at ${url} — loaded ${this.tools.length} tool(s): ${this.tools
          .map((tool) => tool.name)
          .join(', ')}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to load tools from store MCP server (${url}), continuing without tools: ${(error as Error).message}`,
      );
      this.tools = [];
    }
  }

  getTools(): DynamicStructuredTool[] {
    return this.tools;
  }

  async onModuleDestroy() {
    await this.client?.close();
  }
}
