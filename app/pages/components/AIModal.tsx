"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Bot, User, Trash2, Sparkles, X, MessageCircle, AlertCircle, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function CopyMessageButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#D48C46]/5 hover:bg-[#D48C46]/20 border border-[#D48C46]/10 text-[#8B95A6] hover:text-[#D48C46] transition-all text-[0.7rem] uppercase tracking-wider"
      title="Salin pesan"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          <span>Tersalin</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>Salin</span>
        </>
      )}
    </button>
  );
}

const starterQuestions = [
  "Apa itu hadis?", "Berikan nasihat tentang sabar", "Pentingnya shalat berjamaah",
  "Adab menuntut ilmu", "Nasihat saat sedih", "Kisah singkat Rasulullah ﷺ",
  "Apa itu ikhlas?", "Keutamaan membaca Al-Qur'an", "Bagaimana cara bertaubat?",
  "Manfaat silaturahmi", "Zakat dan sedekah", "Puasa di bulan Ramadhan"
];

export function AIModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getRandomQuestions = useCallback(() => {
    return [...starterQuestions].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, []);

  // Update recommendations when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setRecommendations(getRandomQuestions()), 0);
    }
  }, [isOpen, getRandomQuestions]);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Sync messages from localStorage and listen for changes from other tabs
  const loadMessages = useCallback(() => {
    const savedMessages = localStorage.getItem("islam-pro-ai-chat");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Failed to parse messages", e);
      }
    } else {
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => loadMessages(), 0);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "islam-pro-ai-chat") {
        loadMessages();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadMessages]);

  // Save messages to localStorage and scroll
  useEffect(() => {
    if (messages.length > 0) {
      const trimmedStorage = messages.slice(-20);
      localStorage.setItem("islam-pro-ai-chat", JSON.stringify(trimmedStorage));
    }
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    // Optimistic update for UI feel
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    if (!overrideInput) setInput("");
    setIsLoading(true);

    try {
      const contextMessages = messages.slice(-10);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...contextMessages, userMessage],
        }),
      });

      if (!response.ok) {
        let errMsg = "Gagal menghubungi AI";
        try { const err = await response.json(); errMsg = err.error || errMsg; } catch {}
        throw new Error(errMsg);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Gagal membaca respon AI");

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);

        setMessages((prev) => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          if (newMessages[lastIndex].role === "assistant") {
            newMessages[lastIndex] = { ...newMessages[lastIndex], content: newMessages[lastIndex].content + chunk };
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg = error instanceof Error ? error.message : "Maaf, terjadi kesalahan. Silakan coba lagi nanti.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMsg },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("islam-pro-ai-chat");
    setShowAlert(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[999] w-14 h-14 bg-[#D48C46] text-[#090C15] rounded-full shadow-[0_8px_32px_rgba(212,140,70,0.3)] flex items-center justify-center border border-[#D48C46]/20 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent,rgba(255,255,255,0.2),transparent)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        <MessageCircle className="w-7 h-7" />
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6">
            {/* Background Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-[#090C15]/60 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[800px] h-[85vh] bg-[#0E1324] border border-[#D48C46]/20 rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#D48C46]/10 flex items-center justify-between bg-[#0E1324]/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D48C46]/10 flex items-center justify-center border border-[#D48C46]/20">
                    <Bot className="w-6 h-6 text-[#D48C46]" />
                  </div>
                  <div>
                    <h2 className="font-cormorant text-xl font-semibold text-[#D48C46] leading-none mb-1">
                      Ulama virtual
                    </h2>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[0.65rem] text-[#8B95A6] uppercase tracking-wider">Online</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-[#D48C46]/10 text-[#8B95A6] hover:text-[#D48C46] transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-[#D48C46]/20 scrollbar-track-transparent">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 rounded-2xl bg-[#D48C46]/5 flex items-center justify-center mb-6 border border-[#D48C46]/10"
                    >
                      <Sparkles className="w-10 h-10 text-[#D48C46]/40" />
                    </motion.div>
                    <h3 className="text-[#D48C46] font-cormorant text-2xl mb-2">Ahlan wa Sahlan</h3>
                    <p className="text-[#8B95A6] text-sm max-w-[300px] leading-relaxed mb-8">
                      Tanyakan hal seputar Islam, adab, atau bimbingan ibadah.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {recommendations.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSend(q)}
                          className="text-[0.75rem] px-4 py-2 rounded-full border border-[#D48C46]/10 bg-[#D48C46]/5 text-[#D1A582] hover:bg-[#D48C46]/15 hover:border-[#D48C46]/30 transition-all"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                          msg.role === "user"
                            ? "bg-[#D48C46] text-[#090C15]"
                            : "bg-[#1A2238] border border-[#D48C46]/20 text-[#D48C46]"
                        }`}
                      >
                        {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                      </div>
                      <div
                        className={`group/msg max-w-[85%] md:max-w-[75%] px-5 py-4 rounded-2xl text-[0.95rem] leading-relaxed ${
                          msg.role === "user"
                            ? "bg-[#D48C46]/10 border border-[#D48C46]/20 text-[#F0F2F5] rounded-tr-none"
                            : "bg-[#1A2238] border border-[#D48C46]/10 text-[#CED4DA] rounded-tl-none"
                        }`}
                      >
                        <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-[#090C15] prose-pre:border prose-pre:border-[#D48C46]/20">
                          <ReactMarkdown
                            components={{
                              a: ({ href, children }) => {
                                return (
                                  <button
                                    onClick={() => {
                                      if (href) {
                                        setIsOpen(false);
                                        router.push(href, { scroll: false });
                                      }
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D48C46]/10 border border-[#D48C46]/30 text-[#D48C46] rounded-md text-[0.75rem] no-underline hover:bg-[#D48C46]/20 transition-all mt-2 font-medium group/link cursor-pointer"
                                  >
                                    {children}
                                    <svg className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                  </button>
                                );
                              },
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                        
                        {msg.role === "assistant" && (
                          <div className="mt-3 pt-3 border-t border-[#D48C46]/10 flex justify-start opacity-0 group-hover/msg:opacity-100 transition-opacity">
                            <CopyMessageButton text={msg.content} />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
                {isLoading && (
                  <div className="flex gap-4">
                    <div className="w-9 h-9 rounded-xl bg-[#1A2238] border border-[#D48C46]/20 text-[#D48C46] flex items-center justify-center shadow-lg">
                      <Bot className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="px-5 py-4 rounded-2xl bg-[#1A2238] border border-[#D48C46]/10 text-[#CED4DA] rounded-tl-none animate-pulse flex gap-1 items-center">
                      <span className="w-1 h-1 bg-[#D48C46] rounded-full animate-bounce" />
                      <span className="w-1 h-1 bg-[#D48C46] rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1 h-1 bg-[#D48C46] rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
              </div>

              {/* Input Area */}
              <div className="p-4 md:p-6 bg-[#0E1324] border-t border-[#D48C46]/10">
                <div className="flex gap-3 items-center max-w-[700px] mx-auto">
                  <button
                    onClick={() => setShowAlert(true)}
                    disabled={messages.length === 0}
                    className="p-3 rounded-xl bg-[#D48C46]/5 border border-[#D48C46]/10 text-[#8B95A6] hover:text-[#FF4B4B] hover:bg-[#FF4B4B]/10 hover:border-[#FF4B4B]/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed shrink-0"
                    title="Hapus Percakapan"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Ketik pesan di sini..."
                      className="w-full bg-[#1A2238] border border-[#D48C46]/20 rounded-xl px-5 py-3.5 pr-14 text-[0.95rem] focus:outline-none focus:border-[#D48C46] focus:ring-1 focus:ring-[#D48C46]/30 transition-all placeholder:text-[#8B95A6]/40 text-[#F0F2F5]"
                    />
                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-[#D48C46] text-[#090C15] hover:bg-[#B87A3D] transition-all disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed shadow-lg"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <span className="text-[0.6rem] text-[#8B95A6]/40 uppercase tracking-[2px]">
                    Khusus Konteks Keislaman
                  </span>
                </div>
              </div>

              {/* Custom Popup Alert */}
              <AnimatePresence>
                {showAlert && (
                  <div className="absolute inset-0 z-[1100] flex items-center justify-center p-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#090C15]/80 backdrop-blur-md"
                      onClick={() => setShowAlert(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative w-full max-w-[340px] bg-[#1A2238] border border-[#FF4B4B]/30 rounded-2xl p-6 shadow-2xl text-center"
                    >
                      <div className="w-14 h-14 rounded-full bg-[#FF4B4B]/10 flex items-center justify-center mx-auto mb-4 border border-[#FF4B4B]/20">
                        <AlertCircle className="w-8 h-8 text-[#FF4B4B]" />
                      </div>
                      <h4 className="text-lg font-semibold text-[#F0F2F5] mb-2">Hapus Percakapan?</h4>
                      <p className="text-sm text-[#8B95A6] mb-6 leading-relaxed">
                        Seluruh riwayat chat dengan asisten AI akan dihapus secara permanen.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setShowAlert(false)}
                          className="px-4 py-2.5 rounded-xl border border-[#D48C46]/20 text-[#D1A582] hover:bg-[#D48C46]/10 transition-all text-sm"
                        >
                          Batal
                        </button>
                        <button
                          onClick={clearChat}
                          className="px-4 py-2.5 rounded-xl bg-[#FF4B4B] text-white hover:bg-[#D43B3B] transition-all shadow-lg text-sm font-semibold"
                        >
                          Hapus
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
