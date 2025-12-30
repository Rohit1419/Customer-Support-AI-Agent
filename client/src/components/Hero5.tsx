"use client";
import { useState, useEffect } from "react";

// --- PNG ICONS (Project Technologies) ---
const NestJSIcon = ({ className }: { className?: string }) => (
  <img
    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg"
    alt="NestJS"
    className={className}
  />
);

const ReactIcon = ({ className }: { className?: string }) => (
  <img
    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
    alt="React"
    className={className}
  />
);

const PostgreSQLIcon = ({ className }: { className?: string }) => (
  <img
    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
    alt="PostgreSQL"
    className={className}
  />
);

const PrismaIcon = ({ className }: { className?: string }) => (
  <img
    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg"
    alt="Prisma"
    className={className}
  />
);

const RedisIcon = ({ className }: { className?: string }) => (
  <img
    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg"
    alt="Redis"
    className={className}
  />
);

const LangChainIcon = ({ className }: { className?: string }) => (
  <img
    src="https://api.iconify.design/simple-icons:langchain.svg"
    alt="LangChain"
    className={className}
  />
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const ArrowRight = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

// --- DATA & MAPPING ---
const iconMap = {
  nestjs: NestJSIcon,
  react: ReactIcon,
  postgresql: PostgreSQLIcon,
  prisma: PrismaIcon,
  redis: RedisIcon,
  langchain: LangChainIcon,
};

// --- REUSABLE COMPONENTS ---
interface FrameworkPillProps {
  framework: keyof typeof iconMap;
  text: string;
  active: boolean;
  onClick: () => void;
}

const FrameworkPill = ({
  framework,
  text,
  active,
  onClick,
}: FrameworkPillProps) => {
  const Icon = iconMap[framework];
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-all duration-200 hover:scale-105 hover:shadow-md
        ${
          active
            ? "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 shadow-sm"
            : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600"
        }
      `}
    >
      <Icon className="w-4 h-4 mr-1.5 sm:mr-2" />
      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
        {text}
      </span>
    </button>
  );
};

// --- MAIN APP ---
export default function Hero5() {
  const [activeTab, setActiveTab] = useState<keyof typeof iconMap>("react");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const frameworks: Array<{ id: keyof typeof iconMap; name: string }> = [
    { id: "nestjs", name: "NestJS" },
    { id: "react", name: "React" },
    { id: "postgresql", name: "PostgreSQL" },
    { id: "prisma", name: "Prisma" },
    { id: "redis", name: "Redis" },
    { id: "langchain", name: "LangChain" },
  ];

  return (
    <div className="font-sans">
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-400 { animation-delay: 400ms; }
      `}</style>

      <div className="py-8 sm:py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-8 sm:mb-12 transition-all duration-500 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm font-medium tracking-wide transition-colors duration-300 mb-4 sm:mb-6">
              Powered by Gemini 2.5 Flash Lite
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mt-4 sm:mt-6 mb-4 sm:mb-6 leading-tight transition-colors duration-300">
              AI Support Agent
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>Built with RAG
            </h1>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed transition-colors duration-300">
              A production-ready customer support chatbot demonstrating how to
              build scalable AI systems with Retrieval Augmented Generation.
            </p>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-16">
              {frameworks.map((fw) => (
                <FrameworkPill
                  key={fw.id}
                  framework={fw.id}
                  text={fw.name}
                  active={activeTab === fw.id}
                  onClick={() => setActiveTab(fw.id)}
                />
              ))}
            </div>
          </div>

          <div
            className={`mb-8 sm:mb-12 ${
              isVisible ? "animate-slide-up animation-delay-200" : "opacity-0"
            }`}
          ></div>

          <div
            className={`text-center ${
              isVisible ? "animate-slide-up animation-delay-400" : "opacity-0"
            }`}
          >
            <a
              href="https://github.com/Rohit1419/Customer-Support-AI-Agent"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-medium text-base sm:text-lg transition-all duration-200 hover:bg-gray-800 dark:hover:bg-gray-200 hover:scale-105 hover:shadow-lg"
            >
              <GithubIcon className="mr-2 w-5 h-5" />
              View on GitHub
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
