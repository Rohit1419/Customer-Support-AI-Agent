import React from "react";
import { ChatWidget } from "@/components/ChatWidget";
import {
  Zap,
  ShieldCheck,
  Database,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Github,
  TrendingUp,
  Layers,
  Bot,
  FileText,
  Search,
  Code2,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 font-sans text-slate-900">
      {/* 1. Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto backdrop-blur-sm bg-white/70 rounded-full mt-4 shadow-sm border border-slate-200/50">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-blue-600">
          <Bot className="fill-current" /> SpurAI
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <a href="#demo" className="hover:text-blue-600 transition">
            Live Demo
          </a>
          <a href="#architecture" className="hover:text-blue-600 transition">
            Architecture
          </a>
          <a href="#features" className="hover:text-blue-600 transition">
            Features
          </a>
          <a href="#tech-stack" className="hover:text-blue-600 transition">
            Tech Stack
          </a>
        </div>
        <Button
          variant="outline"
          className="rounded-full px-6 flex items-center gap-2"
        >
          <Github className="w-4 h-4" /> GitHub
        </Button>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative px-8 pt-24 pb-32 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Content Layer (Left) */}
        <div className="relative z-10">
          <Badge
            variant="secondary"
            className="mb-6 py-2 px-4 text-blue-700 bg-blue-50 border-blue-200 rounded-full font-semibold"
          >
            <Code2 className="w-4 h-4 inline mr-2" />
            Open Source Project
          </Badge>
          <h1 className="text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6 tracking-tight">
            AI Support Agent{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Built with RAG
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-4 max-w-xl leading-relaxed">
            A production-ready customer support chatbot demonstrating how to
            build scalable AI systems with Retrieval Augmented Generation.
          </p>
          <p className="text-lg text-slate-500 mb-10 max-w-xl">
            Built with NestJS, PostgreSQL + pgVector, Redis, and Google Gemini
            2.5 Flash. Fully containerized and ready to deploy.
          </p>

          {/* Project Stats */}
          <div className="flex flex-wrap gap-6 mb-10">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">pgVector</div>
                <div className="text-sm text-slate-500">Vector DB</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">Gemini</div>
                <div className="text-sm text-slate-500">2.5 Flash</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                <Layers className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">TypeScript</div>
                <div className="text-sm text-slate-500">Full-stack</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full h-14 px-10 shadow-lg shadow-blue-200 font-semibold"
            >
              <Github className="mr-2 w-5 h-5" />
              View Source Code
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full h-14 px-8 border-2"
            >
              <BookOpen className="mr-2 w-5 h-5" />
              Read Docs
            </Button>
          </div>
        </div>

        {/* Interactive Demo (Right) */}
        <div id="demo" className="relative flex justify-center lg:justify-end">
          <div className="relative isolate z-20 pointer-events-auto">
            <div className="absolute -inset-20 bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-blue-400/20 blur-3xl rounded-full -z-10 animate-pulse pointer-events-none" />
            <div className="mb-4 text-center">
              <Badge className="bg-white/90  backdrop-blur-sm text-slate-700 border-slate-300 shadow-sm">
                👇 Try to barke it !
              </Badge>
            </div>
            <ChatWidget />
          </div>
        </div>
      </section>

      {/* 4. Technical Features */}
      <section id="features" className="px-8 py-24">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <Badge className="mb-4 bg-purple-50 text-purple-700 border-purple-200">
            Technical Highlights
          </Badge>
          <h2 className="text-4xl font-bold mb-4">What Makes This Scalable</h2>
          <p className="text-lg text-slate-600">
            Key architectural decisions that enable production deployment.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Database className="text-blue-600" />}
            title="Redis Session Buffer"
            desc="Active chats live in Redis with 10-min TTL. Messages only persist to PostgreSQL when sessions end, reducing DB write load by 95%."
            tech="ioredis + Prisma"
          />
          <FeatureCard
            icon={<Zap className="text-yellow-600" />}
            title="Batch Embedding API"
            desc="Groups multiple chunks into single Gemini API calls. Reduces embedding costs by 80% compared to one-by-one processing during ingestion."
            tech="Gemini Embedding-001"
          />
          <FeatureCard
            icon={<ShieldCheck className="text-green-600" />}
            title="Prompt Injection Defense"
            desc="System prompt uses delimiter tags (<<<>>>) to separate authoritative context from user input. AI refuses jailbreak attempts."
            tech="Structured Prompting"
          />
          <FeatureCard
            icon={<TrendingUp className="text-purple-600" />}
            title="Conversation Context"
            desc="Last 10 messages from Redis are included in each prompt, enabling multi-turn conversations without token bloat."
            tech="Session Management"
          />
          <FeatureCard
            icon={<FileText className="text-cyan-600" />}
            title="Semantic Chunking"
            desc="RecursiveCharacterTextSplitter ensures chunks don't break mid-sentence. 800 char size with 100 char overlap for context preservation."
            tech="LangChain"
          />
          <FeatureCard
            icon={<MessageSquare className="text-pink-600" />}
            title="Normalized Embeddings"
            desc="All vectors are L2-normalized before storage, ensuring cosine similarity works correctly for semantic search queries."
            tech="Vector Math"
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  tech,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tech?: string;
}) {
  return (
    <div className="p-8 rounded-2xl border border-slate-200 bg-white hover:shadow-2xl hover:border-blue-200 transition-all group relative overflow-hidden">
      {tech && (
        <div className="absolute top-4 right-4 bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-semibold border border-slate-200">
          {tech}
        </div>
      )}
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-md transition-all">
        {icon}
      </div>
      <h4 className="text-xl font-bold mb-3">{title}</h4>
      <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

function TechCard({ category, items }: { category: string; items: string[] }) {
  return (
    <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
      <h4 className="font-bold mb-4 text-lg">{category}</h4>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="text-blue-100 text-sm flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
