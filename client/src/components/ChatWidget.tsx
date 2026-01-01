import { useState, useEffect, useRef } from "react";
import { Send, User, Loader2, Circle } from "lucide-react";
import { chatApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { MdSupportAgent } from "react-icons/md";

interface Message {
  sender: "user" | "ai";
  text: string;
}

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
  ],
};

export const ChatWidget = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hey! I'm **Lisa**, your customer support assistant. 👋",
    },
    { sender: "ai", text: "How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [sessionId] = useState(() => {
    const saved = localStorage.getItem("spur_session_id");
    const id = saved || crypto.randomUUID();
    localStorage.setItem("spur_session_id", id);
    return id;
  });

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data } = await chatApi.getHistory(sessionId);
        if (Array.isArray(data) && data.length > 0) {
          setMessages(data);
        }
      } catch {
        // No history
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [sessionId]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      const { data } = await chatApi.sendMessage(userMsg, sessionId);
      setMessages((prev) => [...prev, { sender: "ai", text: data.response }]);
    } catch (error: any) {
      let errorMessage =
        "I'm having trouble connecting right now. Please try again.";

      if (error.response?.status === 429) {
        errorMessage =
          "I’ll connect you with a human support agent to help further.";
      } else if (error.response?.status === 500) {
        errorMessage = "Something went wrong on our end. Please try again.";
      }

      setMessages((prev) => [...prev, { sender: "ai", text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingHistory) {
    return (
      <Card className="w-full max-w-md h-162.5 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md h-162.5 flex flex-col shadow-2xl border-none rounded-2xl overflow-hidden bg-white">
      <CardHeader className="bg-blue-600 text-white py-4 px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <MdSupportAgent className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Lisa</CardTitle>
            <div className="flex items-center gap-1.5 mt-1">
              <Circle className="w-2 h-2 fill-green-400 text-green-400" />
              <span className="text-[10px] text-blue-100 uppercase font-medium">
                Online
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 bg-slate-50/50 min-h-0">
        <ScrollArea className="h-full px-4">
          <div className="py-6 space-y-6">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${
                  m.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                    m.sender === "user"
                      ? "bg-white text-blue-500 border-blue-100"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {m.sender === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <MdSupportAgent className="w-4 h-4" />
                  )}
                </div>

                <div
                  className={`p-3.5 rounded-2xl shadow-sm max-w-[85%] ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                  }`}
                >
                  <div
                    className={`chat-md ${
                      m.sender === "user" ? "chat-md-invert" : ""
                    } max-h-72 overflow-y-auto`}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
                    >
                      {m.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                </div>
                <div className="bg-white border border-slate-100 p-3 rounded-2xl text-xs text-slate-400">
                  Lisa is typing…
                </div>
              </div>
            )}

            <div ref={scrollRef} className="h-2" />
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-4 border-t bg-white shrink-0">
        <div className="flex w-full gap-2 items-center bg-slate-100 rounded-full px-4 py-1 border border-slate-200 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Write a message..."
            disabled={isLoading}
            className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm py-6"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="rounded-full w-8 h-8 bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
