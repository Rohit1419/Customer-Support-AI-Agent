import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { createAgent } from 'langchain';
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  type MessageContent,
} from '@langchain/core/messages';
import { SYSTEM_PROMPT_TEST } from './prompts';
import { McpClientService } from './mcp-client.service';

// OpenRouter is OpenAI-compatible, so ChatOpenAI works by pointing its base
// URL at OpenRouter instead of OpenAI. This is the swap point for going to
// any other OpenRouter-hosted model — no code changes, just env config.
// Check https://openrouter.ai/models?supported_parameters=tools for models
// that currently support tool calling on the free tier — that list changes.
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const DEFAULT_OPENROUTER_MODEL = 'meta-llama/llama-3.3-70b-instruct:free';

export type ChatTurn = { user: string; ai: string };

@Injectable()
export class AiService {
  private genAI: GoogleGenAI;
  private chatModel: ChatOpenAI;

  constructor(
    private config: ConfigService,
    private mcpClientService: McpClientService,
  ) {
    // Embeddings stay on Gemini — OpenRouter is a chat-completions gateway
    // and doesn't serve the embedding model this project's pgvector index is built on.
    this.genAI = new GoogleGenAI({
      apiKey: this.config.get('GEMINI_API_KEY'),
    });

    this.chatModel = new ChatOpenAI({
      model:
        this.config.get<string>('OPENROUTER_MODEL') ?? DEFAULT_OPENROUTER_MODEL,
      apiKey: this.config.get<string>('OPENROUTER_API_KEY'),
      temperature: 0.7,
      configuration: {
        baseURL: OPENROUTER_BASE_URL,
        defaultHeaders: {
          'HTTP-Referer': this.config.get<string>('APP_URL') ?? '',
          'X-Title': 'Support AI Agent',
        },
      },
    });
  }

  // normalising the embedding
  private normalize(vector: number[]): number[] {
    const magnitude = Math.sqrt(
      vector.reduce((sum, val) => sum + val * val, 0),
    );
    if (magnitude === 0) {
      throw new Error('Cannot normalize a zero vector');
    }
    return vector.map((val) => val / magnitude);
  }

  //    generating the embedding for the given content
  async generateEmbedding(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) {
      return [];
    }
    try {
      const response = await this.genAI.models.embedContent({
        model: 'gemini-embedding-001',
        contents: texts,
        config: {
          outputDimensionality: 768,
        },
      });

      const embeddings = response.embeddings;

      if (!embeddings || embeddings.length === 0 || !embeddings[0].values) {
        throw new Error('Failed to generate embedding');
      }

      return embeddings.map((emb) => {
        if (!emb.values) {
          throw new Error('Embedding values missing');
        }
        return this.normalize(emb.values);
      });
    } catch (error) {
      throw new ServiceUnavailableException(
        'Failed to generate embeddings, please try again later.',
        { cause: error },
      );
    }
  }

  // flatten a LangChain message content (string, or content-block array) into plain text
  private extractText(content: MessageContent | undefined): string {
    if (!content) return '';
    if (typeof content === 'string') return content;

    return content
      .map((part) =>
        typeof part === 'string'
          ? part
          : 'text' in part && typeof part.text === 'string'
            ? part.text
            : '',
      )
      .join('')
      .trim();
  }

  // generate the chat response — runs a tool-calling agent over the store's
  // MCP tools (if any are connected) plus the retrieved knowledge base context
  async generateChatResponse(params: {
    context: string;
    userPrompt: string;
    chatHistory?: ChatTurn[];
  }): Promise<string> {
    try {
      const systemPrompt = SYSTEM_PROMPT_TEST(params.context);
      const tools = this.mcpClientService.getTools();

      const agent = createAgent({
        model: this.chatModel,
        tools,
        systemPrompt,
      });

      const messages: BaseMessage[] = [];
      for (const turn of params.chatHistory ?? []) {
        messages.push(new HumanMessage(turn.user));
        messages.push(new AIMessage(turn.ai));
      }
      messages.push(new HumanMessage(params.userPrompt));

      const result = await agent.invoke({ messages });
      const lastMessage = result.messages.at(-1);
      const text = this.extractText(lastMessage?.content);

      if (!text) {
        throw new Error('Failed to generate chat response');
      }
      console.log('AI Response:', text);

      return text;
    } catch (error) {
      const status =
        error instanceof Error && 'status' in error
          ? (error as { status?: number }).status
          : undefined;

      if (status === 429) {
        throw new ServiceUnavailableException(
          'The AI helper is little busy now, please wait a moment and try again.',
        );
      }

      throw new ServiceUnavailableException(
        'I am having trouble thinking right now, please try again later.',
      );
    }
  }
}
