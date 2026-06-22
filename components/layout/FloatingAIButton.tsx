"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Loader2, Sparkles, Minimize2 } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "Who is Shreya Rathore?",
  "What does she do at CloudNexus?",
  "What are her key skills?",
  "Can I hire her?",
];

export function FloatingAIButton() {
  const { theme, mounted } = useTheme();
  const isDark = theme === "dark";
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm **Shreya AI**. Ask me anything about Shreya Rathore's experience, skills, or education!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (text?: string) => {
    const query = text || input.trim();
    if (!query || loading) return;

    setInput("");
    const userMsg: Message = { role: "user", content: query, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();
      const aiMsg: Message = {
        role: "assistant",
        content: data.response || "I'm sorry, I couldn't process that. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallback: Message = {
        role: "assistant",
        content:
          "I'm having a momentary issue, but I'm back! Shreya Rathore is a Business Development Associate at CloudNexus. Feel free to ask me anything!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-2xl flex items-center justify-center group"
            style={{
              boxShadow: "0 8px 32px rgba(124, 58, 237, 0.4), 0 0 0 0 rgba(124, 58, 237, 0.4)",
              animation: "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          >
            <Bot size={28} className="relative z-10" />
            <Sparkles
              size={14}
              className="absolute top-2 right-2 text-yellow-300 animate-pulse"
            />
            
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 right-0 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Ask Shreya AI
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-32px)] h-[600px] max-h-[calc(100vh-100px)] rounded-2xl overflow-hidden shadow-2xl"
            style={{
              boxShadow: isDark
                ? "0 20px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(124, 58, 237, 0.3)"
                : "0 20px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(124, 58, 237, 0.1)",
            }}
          >
            <div
              className={`h-full flex flex-col ${
                isDark
                  ? "bg-[#0a0a1a] border border-white/10"
                  : "bg-white border border-gray-200"
              }`}
            >
              {/* Header */}
              <div
                className={`flex items-center justify-between p-4 border-b ${
                  isDark ? "border-white/10 bg-white/[0.02]" : "border-gray-100 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                      <Bot size={20} className="text-white" />
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 ${
                        isDark ? "border-[#0a0a1a]" : "border-white"
                      }`}
                    />
                  </div>
                  <div>
                    <div
                      className={`text-sm font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Shreya AI
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs text-green-400">Online</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? "hover:bg-white/10 text-gray-400"
                      : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`flex gap-2 ${
                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-violet-600 to-blue-600"
                            : isDark
                            ? "bg-white/10"
                            : "bg-gray-100"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <span className="text-xs font-bold text-white">You</span>
                        ) : (
                          <Bot size={14} className={isDark ? "text-violet-400" : "text-violet-600"} />
                        )}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-tr-sm"
                            : isDark
                            ? "bg-white/5 border border-white/10 text-gray-300 rounded-tl-sm"
                            : "bg-gray-50 border border-gray-100 text-gray-700 rounded-tl-sm"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <div className="prose prose-sm max-w-none prose-invert">
                            <ReactMarkdown
                              components={{
                                a: ({ href, children }) => (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-violet-400 hover:underline"
                                  >
                                    {children}
                                  </a>
                                ),
                                strong: ({ children }) => (
                                  <strong
                                    className={
                                      isDark
                                        ? "text-white font-semibold"
                                        : "text-gray-900 font-semibold"
                                    }
                                  >
                                    {children}
                                  </strong>
                                ),
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          msg.content
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Loading */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2"
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isDark ? "bg-white/10" : "bg-gray-100"
                      }`}
                    >
                      <Bot size={14} className={isDark ? "text-violet-400" : "text-violet-600"} />
                    </div>
                    <div
                      className={`px-4 py-3 rounded-2xl rounded-tl-sm ${
                        isDark
                          ? "bg-white/5 border border-white/10"
                          : "bg-gray-50 border border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Loader2 size={14} className="text-violet-400 animate-spin" />
                        <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Suggested Questions */}
              {messages.length <= 1 && (
                <div className={`px-4 py-2 border-t ${isDark ? "border-white/5" : "border-gray-100"}`}>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        disabled={loading}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          isDark
                            ? "border-violet-500/30 text-violet-300 hover:bg-violet-500/10"
                            : "border-violet-200 text-violet-700 hover:bg-violet-50"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className={`p-4 border-t ${isDark ? "border-white/5" : "border-gray-100"}`}>
                <div
                  className={`flex gap-2 items-center p-3 rounded-xl ${
                    isDark
                      ? "bg-white/5 border border-white/10"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    disabled={loading}
                    placeholder="Ask about Shreya..."
                    className={`flex-1 bg-transparent text-sm outline-none ${
                      isDark
                        ? "text-white placeholder:text-gray-500"
                        : "text-gray-900 placeholder:text-gray-400"
                    }`}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      input.trim() && !loading
                        ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg"
                        : isDark
                        ? "bg-white/5 text-gray-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Send size={14} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes pulse-ring {
          0%, 100% {
            box-shadow: 0 8px 32px rgba(124, 58, 237, 0.4), 0 0 0 0 rgba(124, 58, 237, 0.4);
          }
          50% {
            box-shadow: 0 8px 32px rgba(124, 58, 237, 0.4), 0 0 0 12px rgba(124, 58, 237, 0);
          }
        }
      `}</style>
    </>
  );
}
