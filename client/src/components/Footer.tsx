import { Github, Linkedin, Mail, Heart, Sparkles, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Developer Message Section */}
        <div className="py-16 md:py-20 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 text-sm font-semibold shadow-sm">
                <Sparkles className="w-4 h-4 mr-2" />A Message from the
                Developer
              </div>
            </div>

            {/* Main Content */}
            <div className="text-center space-y-6 mb-8">
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                Hey there! 👋 Thanks for checking out this project
              </h3>

              <div className="space-y-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
                <p>
                  I built this AI Support Agent to demonstrate how{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    production-ready RAG systems
                  </span>{" "}
                  can be architected with real-world scalability in mind.
                </p>
                <p>
                  Feel free to{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    try breaking the chatbot
                  </span>{" "}
                  (seriously, I've added prompt injection defense!), explore the
                  code, or fork it for your own projects. I'm always excited to
                  discuss AI architecture, scalability patterns, or just chat
                  about tech.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-9 ">
              <Button
                variant="default"
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                asChild
              >
                <a
                  href="https://github.com/Rohit1419/Customer-Support-AI-Agent"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-5 w-5" />
                  Star on GitHub
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-gray-400 transition-all duration-200"
                asChild
              >
                <a href="mailto:rohit1419official@gmail.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Let's Connect
                </a>
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-6 mt-8">
              <a
                href="https://github.com/Rohit1419"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center"
              >
                <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-900 dark:group-hover:bg-white transition-colors">
                  <Github className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-white dark:group-hover:text-gray-900" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  GitHub
                </span>
              </a>
              <a
                href="https://linkedin.com/in/rohit-kumar-1419"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center"
              >
                <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-600 transition-colors">
                  <Linkedin className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-white" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  LinkedIn
                </span>
              </a>
              <a
                href="https://buymeacoffee.com/rohit1419"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center"
              >
                <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-amber-500 transition-colors">
                  <Coffee className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-white" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Buy Coffee
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="py-12 md:py-16">
          {/* Bottom Bar */}

          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} Built with{" "}
              <Heart className="inline w-4 h-4 text-red-500 fill-current mx-1" />
              by Rohit Gite using NestJS & Gemini AI
            </p>
            <div className="flex space-x-6">
              <a
                href="https://github.com/Rohit1419/Customer-Support-AI-Agent/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                MIT License
              </a>
              <a
                href="https://github.com/Rohit1419"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                More Projects
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
