import React from "react";
import { ChatWidget } from "@/components/ChatWidget";
import {
  Zap,
  ShieldCheck,
  Database,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* 1. Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-blue-600">
          <Sparkles className="fill-current" /> SpurAI
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition">
            Features
          </a>
          <a href="#demo" className="hover:text-blue-600 transition">
            Live Demo
          </a>
          <a href="#" className="hover:text-blue-600 transition">
            Docs
          </a>
        </div>
        <Button variant="outline" className="rounded-full px-6">
          Login
        </Button>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative px-8 pt-20 pb-32 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Content Layer (Left) */}
        <div className="relative z-10">
          <Badge
            variant="secondary"
            className="mb-4 py-1 px-3 text-blue-700 bg-blue-50 border-blue-100"
          >
            Now Powered by Gemini 2.5 Flash
          </Badge>
          <h1 className="text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight">
            Turn your <span className="text-blue-600">Markdown</span> into a
            Support Hero.
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
            Drop your documentation, policies, and FAQs into a folder. SpurAI
            handles the embeddings, vector storage, and human-like reasoning.
          </p>
          <div className="flex gap-4">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 rounded-full h-12 px-8 shadow-lg shadow-blue-200"
            >
              Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="ghost" size="lg" className="rounded-full h-12">
              View on GitHub
            </Button>
          </div>
        </div>

        {/* Interactive Playground (Right) */}
        <div id="demo" className="relative flex justify-center lg:justify-end">
          <div className="relative isolate z-20 pointer-events-auto">
            <div className="absolute -inset-10 bg-blue-400/20 blur-3xl rounded-full -z-10 animate-pulse pointer-events-none" />

            <ChatWidget />
          </div>
        </div>
      </section>

      {/* 3. Features Bento Grid */}
      <section
        id="features"
        className="px-8 py-24 bg-white border-y border-slate-200"
      >
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Built for Scale & Performance
          </h2>
          <p className="text-slate-500">
            Everything you need to automate support in 5 minutes.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Database className="text-blue-600" />}
            title="pgVector Persistence"
            desc="Enterprise-grade vector storage ensures your AI remembers context across sessions perfectly."
          />
          <FeatureCard
            icon={<Zap className="text-blue-600" />}
            title="Batch Ingestion"
            desc="Optimized LangChain chunking with batch embedding calls to save API quota and speed up indexing."
          />
          <FeatureCard
            icon={<ShieldCheck className="text-blue-600" />}
            title="Robust Safety"
            desc="Built-in prompt injection defense and role-pinning ensures your bot stays on brand."
          />
        </div>
      </section>

      {/* 4. CTA Footer */}
      <footer className="py-20 text-center">
        <h3 className="text-2xl font-bold mb-6">
          Ready to scale your support?
        </h3>
        <Button
          size="lg"
          className="bg-slate-900 text-white rounded-full h-12 px-10"
        >
          Deploy SpurAI Now
        </Button>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all group">
      <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="text-xl font-bold mb-3">{title}</h4>
      <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}
