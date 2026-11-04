"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  MessageCircleIcon,
  SendIcon,
  CloseIcon,
  LoaderIcon,
  HeartIcon,
} from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Role = "user" | "assistant";

type ChatMessage = { role: Role; content: string };

const WELCOME_TEXT =
  "Welcome to FERMORA. I am your private companion for cycle intelligence, craving wisdom, and wellness care. Ask about cycle phases, cramps, comfort snacks, mood swings, or planning your energy. (Educational guidance, not medical diagnosis.)";

export function SakhiChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    const nextUser: ChatMessage = { role: "user", content: text };
    const forApi: ChatMessage[] = [...messages, nextUser];
    setMessages(forApi);
    setInput("");
    setLoading(true);

    try {
      const url = `${window.location.origin}/api/chat`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          messages: forApi.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const raw = await res.text();
      let data: { reply?: string; error?: string } = {};
      try {
        data = raw ? (JSON.parse(raw) as { reply?: string; error?: string }) : {};
      } catch {
        setError("Server returned an invalid response. Try again in a moment.");
        setMessages((prev) => prev.slice(0, -1));
        return;
      }

      if (!res.ok) {
        setError(
          data.error ?? `Request failed (${res.status}). Try again shortly.`
        );
        setMessages((prev) => prev.slice(0, -1));
        return;
      }

      if (!data.reply) {
        setError("Empty reply. Try again.");
        setMessages((prev) => prev.slice(0, -1));
        return;
      }

      const reply = data.reply as string;
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setError("Network error. Check your connection.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  return (
    <>
      <div
        className={cn(
          "fixed z-[140] flex flex-col items-end gap-3",
          "bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]"
        )}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "w-[min(100vw-2rem,22rem)] sm:w-[24rem]",
                "h-[min(70dvh,32rem)] flex flex-col overflow-hidden",
                "rounded-xl border border-[#E8DFD5] bg-[#FAF7F2]"
              )}
              role="dialog"
              aria-label="FERMORA Wellness chat"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-2 px-4 py-3.5 border-b border-[#E8DFD5] bg-[#FAF7F2]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-8 relative shrink-0">
                    <Image
                      src="/images/femora.logo.png"
                      alt="FERMORA Logo"
                      width={24}
                      height={30}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#101F3B] truncate">
                      FERMORA Wellness Guide
                    </p>
                    <p className="text-[10px] text-[#26334A]/60 truncate font-light">
                      Cycle intelligence · Cravings · Mindful care
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-md text-[#26334A]/60 hover:text-[#101F3B] hover:bg-[#F8F3E9] transition-colors cursor-pointer"
                  aria-label="Close chat"
                >
                  <CloseIcon size={16} />
                </button>
              </div>

              {/* Chat Message History */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth text-xs"
              >
                {messages.length === 0 && (
                  <div className="flex justify-start">
                    <div className="max-w-[92%] rounded-lg p-3.5 leading-relaxed bg-[#F8F3E9] text-[#101F3B] border border-[#E8DFD5] font-light">
                      {WELCOME_TEXT}
                    </div>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex",
                      m.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[92%] rounded-lg p-3 leading-relaxed",
                        m.role === "user"
                          ? "bg-[#B66ACB] text-white"
                          : "bg-[#F8F3E9] text-[#101F3B] border border-[#E8DFD5] font-light"
                      )}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-[#F8F3E9] border border-[#E8DFD5] text-[#26334A]/70 text-xs font-light">
                      <LoaderIcon size={13} className="text-[#B66ACB]" />
                      Reflecting gently...
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <p className="px-4 pb-1 text-xs text-red-600 font-medium" role="alert">
                  {error}
                </p>
              )}

              <p className="px-4 text-[10px] text-[#26334A]/60 leading-snug font-light">
                Educational guidance. Consult your doctor for clinical advice.
              </p>

              {/* Chat Input */}
              <form
                className="p-3 border-t border-[#E8DFD5] bg-[#FAF7F2] flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void send();
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask FERMORA about your cycle or cravings..."
                  disabled={loading}
                  maxLength={2000}
                  className="flex-1 h-9 rounded-md border border-[#E8DFD5] bg-[#F8F3E9] px-3 text-xs text-[#101F3B] placeholder-[#26334A]/40 focus:outline-none focus:ring-2 focus:ring-[#B66ACB]"
                  aria-label="Message"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={loading || !input.trim()}
                  className="h-9 w-9 shrink-0 rounded-md bg-[#B66ACB] hover:bg-[#9C4EB3] text-white cursor-pointer border border-[#9C4EB3]"
                  aria-label="Send"
                >
                  <SendIcon size={14} />
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Toggle Button (No drop shadow, crisp border) */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center cursor-pointer",
            "bg-[#B66ACB] text-white hover:bg-[#9C4EB3] hover:scale-105 active:scale-95 transition-all duration-150 ease-out",
            "border border-[#9C4EB3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B66ACB]"
          )}
          aria-expanded={open}
          aria-label={open ? "Close FERMORA assistant" : "Open FERMORA assistant"}
        >
          {open ? (
            <CloseIcon size={20} aria-hidden="true" />
          ) : (
            <MessageCircleIcon size={20} aria-hidden="true" />
          )}
        </button>
      </div>
    </>
  );
}
