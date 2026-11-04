"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, MinusIcon, HelpCircleIcon } from "@/components/ui/icons";
import { LogoWatermark } from "@/components/shared/LogoWatermark";
import { FAQ_ITEMS } from "@/lib/constants";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className="relative py-24 px-4 bg-[#F8F3E9] border-t border-[#E8DFD5]"
    >
      <LogoWatermark variant="corner-bottom-left" size={200} opacity={0.03} />

      <div className="container-max section-padding relative z-10">
        {/* Header */}
        <div className="space-y-4 text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#E6DDF4]/70 text-[#7A3E8E] text-xs font-semibold tracking-wider uppercase border border-[#E8DFD5]">
            <HelpCircleIcon size={14} />
            Questions &amp; Insights
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-[#101F3B] tracking-tight">
            Common questions answered
          </h2>
          <p className="text-sm sm:text-base text-[#26334A]/75 font-light">
            Everything you need to know about cycle tracking, craving wisdom, and privacy on FERMORA.
          </p>
        </div>

        {/* FAQ items (editorial accordion, no shadows, warm alabaster surfaces) */}
        <div className="max-w-3xl mx-auto space-y-3.5" role="list">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              role="listitem"
              className={`rounded-xl border transition-all duration-200 ease-out overflow-hidden ${
                openIndex === index
                  ? "border-[#B66ACB]/60 bg-[#FAF5EC]"
                  : "border-[#E8DFD5] bg-[#FAF7F2] hover:border-[#B66ACB]/50 hover:bg-[#FAF4EB] hover:-translate-y-0.5"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4.5 text-left transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B66ACB]"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-semibold text-[#101F3B] text-sm sm:text-base leading-snug">
                  {item.question}
                </span>
                <div
                  className={`flex-shrink-0 w-7 h-7 rounded-md border flex items-center justify-center transition-all duration-200 ${
                    openIndex === index
                      ? "bg-[#B66ACB]/15 border-[#B66ACB]/40 text-[#B66ACB] scale-105"
                      : "bg-[#F8F3E9] border-[#E8DFD5] text-[#26334A]/60"
                  }`}
                >
                  {openIndex === index ? (
                    <MinusIcon size={14} className="text-[#B66ACB]" aria-hidden="true" />
                  ) : (
                    <PlusIcon size={14} className="text-[#26334A]/60" aria-hidden="true" />
                  )}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-1 border-t border-[#E8DFD5]/70">
                      <p className="text-[#26334A]/80 text-xs sm:text-sm leading-relaxed font-light">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
