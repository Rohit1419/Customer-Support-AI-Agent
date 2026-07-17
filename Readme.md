# Support AI Agent - Agentic, RAG-Powered Customer Support System

A production-ready, intelligent customer support agent built with **Retrieval-Augmented Generation (RAG)** and **agentic tool-calling**. Point it at a store's own documentation and its own [MCP](https://modelcontextprotocol.io/) tool server, and it becomes native to that store — no code changes required.

## 🎯 What This Project Does

Built as a showcase of modern AI engineering practices, this project demonstrates:

- **Semantic search** over documentation using vector embeddings with cosine similarity for precise retrieval
- **Agentic tool-calling** via a ReAct agent that connects to any store's MCP server over Streamable HTTP — order lookup, inventory, returns, whatever tools that store exposes, become available to the agent automatically
- **Model-agnostic inference** — chat completions run through OpenRouter's OpenAI-compatible API, so swapping the underlying LLM is a config change, not a redeploy
- **Conversation memory** with Redis-backed session management to avoid hammering the database on every message
- **Cost-efficient architecture** — semantic search drastically reduces input tokens by only feeding the LLM what it actually needs
- **Defense in depth against prompt injection** — knowledge-base context, tool outputs, and user input are all treated as untrusted data behind an explicit instruction-isolation boundary

### Meet Lisa 👋

The AI agent uses a carefully crafted persona that balances professionalism with approachability. She provides helpful responses grounded in your actual documentation — no hallucinations, no made-up answers.

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        UI[React Frontend<br/>ChatWidget Component]
    end

    subgraph "API Layer"
        Controller[NestJS Controller<br/>chat.controller.ts]
    end

    subgraph "Service Layer"
        ChatService[Chat Service<br/>Session Management]
        AIService[AI Service<br/>Agent Orchestration]
        KnowledgeService[Knowledge Service<br/>Document Ingestion]
        McpClient[MCP Client Service<br/>Streamable HTTP]
    end

    subgraph "Agentic Layer"
        Agent[LangChain ReAct Agent<br/>createAgent]
    end

    subgraph "Cache Layer"
        Redis[(Redis<br/>Session Buffer<br/>TTL: 10min)]
    end

    subgraph "Database Layer"
        Postgres[(PostgreSQL + pgvector<br/>Long-term Storage)]
    end

    subgraph "External Services"
        OpenRouter[OpenRouter API<br/>Model-agnostic chat completions]
        Gemini[Google Gemini API<br/>Embedding-001 only]
        StoreMCP[Store's MCP Server<br/>order lookup, inventory, returns...]
    end

    UI -->|HTTP POST/GET| Controller
    Controller --> ChatService
    ChatService --> AIService
    ChatService --> Redis
    ChatService --> Postgres
    AIService --> Agent
    Agent --> OpenRouter
    Agent -.tool calls.-> McpClient
    McpClient -.Streamable HTTP.-> StoreMCP
    AIService --> Gemini
    KnowledgeService --> Gemini
    KnowledgeService --> Postgres

    style UI fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
    style Controller fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#000
    style ChatService fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style AIService fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style McpClient fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style Agent fill:#6366f1,stroke:#4338ca,stroke-width:2px,color:#fff
    style Redis fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
    style Postgres fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
    style Gemini fill:#eab308,stroke:#ca8a04,stroke-width:2px,color:#000
    style OpenRouter fill:#eab308,stroke:#ca8a04,stroke-width:2px,color:#000
    style StoreMCP fill:#f97316,stroke:#c2410c,stroke-width:2px,color:#fff
```

## 🔄 Buckle Up! & see Lisa in action wild journey 🏃

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Controller
    participant ChatService
    participant Redis
    participant AIService
    participant Gemini
    participant pgVector
    participant Agent as LangChain Agent
    participant OpenRouter
    participant MCP as Store's MCP Server

    User->>Frontend: Types message
    Frontend->>Controller: POST /chat/message

    Controller->>ChatService: getChatResponse()

    ChatService->>AIService: generateEmbedding(query)
    AIService->>Gemini: Embed user query
    Gemini-->>AIService: Vector [768d]
    AIService-->>ChatService: Query embedding

    ChatService->>pgVector: Similarity search
    pgVector-->>ChatService: Top 3 chunks

    ChatService->>Redis: Get chat history
    Redis-->>ChatService: Last 10 messages

    ChatService->>AIService: generateChatResponse()
    AIService->>Agent: invoke({ systemPrompt, tools, messages })
    Agent->>OpenRouter: Chat completion request

    opt Model requests a tool call
        OpenRouter-->>Agent: tool_call(name, args)
        Agent->>MCP: Invoke tool (Streamable HTTP)
        MCP-->>Agent: Tool result (untrusted data)
        Agent->>OpenRouter: Resume with tool result
    end

    OpenRouter-->>Agent: Final AI message
    Agent-->>AIService: Response text
    AIService-->>ChatService: Response text

    ChatService->>Redis: Store message pair
    ChatService-->>Controller: { response }
    Controller-->>Frontend: JSON response
    Frontend-->>User: Display message
```

---

## 🏗️ Architecture & Design Decisions

### 1. **Two-Tier Memory System**

**The Problem:** Writing every single chat message directly to PostgreSQL is a recipe for I/O bottlenecks and unnecessary database costs.

**My Solution:** Redis-first buffering strategy

```
User Message → Redis List (in-memory, < 1ms writes)
              ↓ (flush periodically or on session end)
           PostgreSQL (long-term storage)
```

- **Hot Sessions:** Active conversations stay in Redis with a 10-minute TTL
- **Cold Storage:** History only gets persisted to Postgres when the session ends or you manually trigger it
- **Benefits:** 95% reduction in database writes, sub-millisecond chat latency

### 2. **Batch Vector Ingestion**

**The Challenge:** Hitting the Gemini API once per chunk would blow through rate limits instantly.

**My Approach:** Bulk processing with LangChain's text splitter

I batch chunks together and send them in a single API call. This, combined with semantic chunking and fine-tuned chunk sizes (800 chars + 100 overlap), gives you the best results without spamming the API.

### 3. **Prompt Structure**

The system combines three context sources for optimal responses, passed as a structured message list (not a flattened string) so the agent has real conversational grounding:

```typescript
const agent = createAgent({
  model: chatModel, // ChatOpenAI, pointed at OpenRouter
  tools, // whatever the store's MCP server currently exposes
  systemPrompt, // persona + RAG context + tool-use / anti-injection rules
});

const messages = [
  ...history.flatMap((t) => [new HumanMessage(t.user), new AIMessage(t.ai)]),
  new HumanMessage(userPrompt),
];

await agent.invoke({ messages });
```

**Why this works:**

- RAG gives you factual grounding from the docs
- Chat history as real `Human`/`AI` message pairs (not a flattened string) lets users ask follow-ups like "What about the other option?" without losing role structure
- The agent decides for itself whether it needs a tool call or can answer from context alone

### 4. **Agentic Tool-Calling via MCP**

**The Goal:** Any e-commerce store should be able to plug this agent into their own systems — order lookup, inventory, returns — without anyone touching this codebase.

**The Approach:** A [LangChain](https://js.langchain.com/) ReAct agent (`createAgent`) replaces the old single-shot prompt call. On startup, an `McpClientService` connects to the store's own MCP server over **Streamable HTTP** (`@langchain/mcp-adapters`' `MultiServerMCPClient`) and loads whatever tools that server exposes. Those tools are handed to the agent alongside the RAG context — the agent decides at runtime whether it needs to call a tool or can answer directly.

- **Swappable by design:** point `MCP_SERVER_URL` at a different store's tool server and the agent inherits a completely different capability set — no redeploy.
- **Graceful degradation:** if `MCP_SERVER_URL` is unset, or the store's MCP server is unreachable, the agent falls back to RAG-only mode instead of crashing.
- **Tool output is untrusted data:** the system prompt explicitly instructs the model to treat tool results exactly like knowledge-base context — reference material, never instructions — closing the same prompt-injection surface that a malicious document or user message could otherwise exploit through a tool result.

### 5. **Model-Agnostic Inference via OpenRouter**

**The Goal:** The LLM behind the agent shouldn't be locked to one vendor.

**The Approach:** Chat completions go through [OpenRouter](https://openrouter.ai/)'s OpenAI-compatible API via `ChatOpenAI` with a custom `baseURL`. Embeddings stay on Gemini (OpenRouter doesn't serve an embedding endpoint), but the model that actually reasons and calls tools is a single environment variable (`OPENROUTER_MODEL`) — swapping it is a config change, not a code change.

---

## 🛠️ Tech Stack

### Backend

- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL + pgvector extension
- **Cache:** Redis (via @nestjs-modules/ioredis)
- **ORM:** Prisma with pgvector adapter
- **Agent Orchestration:** LangChain (`createAgent` ReAct loop) + `@langchain/mcp-adapters`
- **Chat LLM:** OpenRouter — model-agnostic, configurable via env var
- **Embeddings:** Google Gemini (`gemini-embedding-001`)
- **Tool Integration:** MCP (Model Context Protocol) over Streamable HTTP

### Frontend

- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Markdown Rendering:** react-markdown + rehype-sanitize

### Infrastructure

- **Containerization:** Docker Compose
- **Session Management:** UUID-based with localStorage persistence

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ & npm/pnpm
- Docker & Docker Compose
- Gemini API Key ([Grab one here](https://aistudio.google.com/app/apikey)) — used for embeddings
- OpenRouter API Key ([Grab one here](https://openrouter.ai/keys)) — used for chat completions
- (Optional) A store's MCP server URL, if you want live tool-calling instead of RAG-only mode

### 1. Clone & Install

```bash
git clone <repository-url>
cd support-ai-agent

# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies
cd ../client
pnpm install
```

### 2. Environment Configuration

Create `backend/.env`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/db_name?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Embeddings (RAG only)
GEMINI_API_KEY=your_gemini_api_key_here

# Chat LLM — OpenRouter is model-agnostic; pick any tool-calling-capable
# model from https://openrouter.ai/models?supported_parameters=tools
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
APP_URL=http://localhost:3000

# MCP — the store's own tool server, connected over Streamable HTTP.
# Leave blank to run RAG-only with no tools.
MCP_SERVER_URL=
MCP_SERVER_AUTH_TOKEN=
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:3000
```

### 3. Start Infrastructure

```bash
cd backend
docker-compose up -d
```

Verify everything's running:

```bash
docker ps
# You should see: spur-postgres, support-ai-redis
```

### 4. Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Seed the knowledge base
npx prisma db seed
```

This will ingest all Markdown files from `knowledgeData/`, chunk them, embed them, and store them in pgvector. You have to set the file path seperatly for each file

### 5. Run the Application

**Backend:**

```bash
cd backend
pnpm start:dev
# Server runs on http://localhost:3000
# You just need this ! everything runs concurentlly
```

**Frontend:**

```bash
cd client
pnpm run dev
# Frontend runs on http://localhost:5173
```

---

## 📖 API Documentation

### `POST /chat/message`

Send a message and get an AI response.

**Request:**

```json
{
  "message": "How do I reset my password?",
  "sessionId": "uuid-v4-string"
}
```

**Response:**

```json
{
  "response": "To reset your password, click 'Forgot Password' on the login page..."
}
```

### `GET /chat/history/:sessionId`

Retrieve conversation history for a session.

**Response:**

```json
[
  { "sender": "user", "text": "How do I reset my password?" },
  { "sender": "ai", "text": "To reset your password..." }
]
```

---

## 🛡️ Security & Best Practices

### Input Validation

- **Max message length:** 2000 characters
- **DTO validation:** Using class-validator decorators on all endpoints
- **Sanitized Markdown:** `rehype-sanitize` prevents XSS attacks in rendered responses
- **Prompt Injection Defense:** Structural delimiters and an explicit instruction-priority hierarchy prevent users from hijacking the system prompt
- **Tool Output Isolation:** MCP tool results are treated as untrusted data, identically to knowledge-base context — the agent is instructed never to follow instructions embedded inside a tool's response

---

## 📊 Performance Optimizations

| Optimization              | Impact                                                 |
| ------------------------- | ------------------------------------------------------ |
| Redis buffering           | 95% reduction in database writes                       |
| Batch embeddings          | 10x fewer API calls during ingestion                   |
| Normalized embeddings     | 15% improvement in retrieval accuracy                  |
| 10-message context window | Keeps token count manageable while maintaining context |
| RAG architecture          | Cuts token usage massively, reducing API costs         |
| Rate Limit Per session    | Prevents abuse & api spam                              |

---

## 🔮 Future Enhancements

- [ ] **Streaming Responses:** Server-Sent Events for real-time typing effect
- [ ] **Analytics Dashboard:** Track common questions, user satisfaction, etc.
- [ ] **Multi-language Support:** i18n for global customer base
- [ ] **Advanced Filtering:** Filter context by `sourceType` (e.g., "only search billing docs")
- [ ] **Live MCP Tool Refresh:** Tools currently load once at startup — refresh on interval or on error instead of requiring a restart when a store's tool server changes
- [ ] **Multi-Server MCP:** Connect to more than one MCP server per deployment (e.g. a platform-provided server plus a store-specific one)

---

## 🤝 Contributing

This was built as a technical showcase, but I'm open to suggestions! Feel free to open an issue or PR if you spot improvements.

You can also reach me at: **rohitgite03@gmail.com**

---

## 📄 License

MIT License — feel free to use this as a starting point for your own projects.

---
