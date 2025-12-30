import { ChatWidget } from "@/components/ChatWidget";
import {
  Zap,
  ShieldCheck,
  Database,
  MessageSquare,
  TrendingUp,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Hero5 from "@/components/Hero5";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const featuresList = [
  {
    icon: Database,
    title: "Redis Session Buffer",
    description:
      "Active chats live in Redis with 10-min TTL. Messages only persist to PostgreSQL when sessions end, reducing DB write load by 95%.",
    cardBorderColor:
      "border-blue-600/40 hover:border-blue-600 dark:border-blue-400/40 dark:hover:border-blue-400",
    avatarTextColor: "text-blue-600 dark:text-blue-400",
    avatarBgColor: "bg-blue-600/10 dark:bg-blue-400/10",
  },
  {
    icon: Zap,
    title: "Batch Embedding API",
    description:
      "Groups multiple chunks into single Gemini API calls. Reduces embedding costs by 80% compared to one-by-one processing during ingestion.",
    cardBorderColor:
      "border-yellow-600/40 hover:border-yellow-600 dark:border-yellow-400/40 dark:hover:border-yellow-400",
    avatarTextColor: "text-yellow-600 dark:text-yellow-400",
    avatarBgColor: "bg-yellow-600/10 dark:bg-yellow-400/10",
  },
  {
    icon: ShieldCheck,
    title: "Prompt Injection Defense",
    description:
      "System prompt uses delimiter tags (<<<>>>) to separate authoritative context from user input. AI refuses jailbreak attempts.",
    cardBorderColor:
      "border-green-600/40 hover:border-green-600 dark:border-green-400/40 dark:hover:border-green-400",
    avatarTextColor: "text-green-600 dark:text-green-400",
    avatarBgColor: "bg-green-600/10 dark:bg-green-400/10",
  },
  {
    icon: TrendingUp,
    title: "Conversation Context",
    description:
      "Last 10 messages from Redis are included in each prompt, enabling multi-turn conversations without token bloat.",
    cardBorderColor:
      "border-purple-600/40 hover:border-purple-600 dark:border-purple-400/40 dark:hover:border-purple-400",
    avatarTextColor: "text-purple-600 dark:text-purple-400",
    avatarBgColor: "bg-purple-600/10 dark:bg-purple-400/10",
  },
  {
    icon: FileText,
    title: "Semantic Chunking",
    description:
      "RecursiveCharacterTextSplitter ensures chunks don't break mid-sentence. 800 char size with 100 char overlap for context preservation.",
    cardBorderColor:
      "border-cyan-600/40 hover:border-cyan-600 dark:border-cyan-400/40 dark:hover:border-cyan-400",
    avatarTextColor: "text-cyan-600 dark:text-cyan-400",
    avatarBgColor: "bg-cyan-600/10 dark:bg-cyan-400/10",
  },
  {
    icon: MessageSquare,
    title: "Normalized Embeddings",
    description:
      "All vectors are L2-normalized before storage, ensuring cosine similarity works correctly for semantic search queries.",
    cardBorderColor:
      "border-pink-600/40 hover:border-pink-600 dark:border-pink-400/40 dark:hover:border-pink-400",
    avatarTextColor: "text-pink-600 dark:text-pink-400",
    avatarBgColor: "bg-pink-600/10 dark:bg-pink-400/10",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black font-sans text-slate-900 dark:text-white transition-colors duration-300">
      {/* Hero Section with ChatWidget */}
      <section className="relative px-4 sm:px-8 pt-8 sm:pt-12 pb-16 sm:pb-32 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Hero5 Content */}
          <div className="relative z-10">
            <Hero5 />
          </div>

          {/* ChatWidget Demo */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative isolate z-20 pointer-events-auto">
              <div className="absolute -inset-20 bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-blue-400/20 dark:from-blue-600/20 dark:via-cyan-600/20 dark:to-blue-600/20 blur-3xl rounded-full -z-10 animate-pulse pointer-events-none" />
              <div className="mb-4 text-center">
                <Badge className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-slate-700 dark:text-slate-300 border-slate-300 dark:border-gray-700 shadow-sm">
                  👇 Try to break it!
                </Badge>
              </div>
              <ChatWidget />
            </div>
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section
        id="features"
        className="bg-white dark:bg-gray-950 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto text-center px-4 pt-6 sm:pt-12">
          <Badge className="mb-4 bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700">
            Technical Highlights
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 dark:text-white">
            What Makes This Scalable
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-gray-400 mb-8">
            Key architectural decisions that enable production deployment.
          </p>
        </div>

        <Features featuresList={featuresList} />
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
}
