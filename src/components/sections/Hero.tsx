"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDownIcon, HeartIcon } from "@/components/ui/icons";
import { LogoWatermark } from "@/components/shared/LogoWatermark";
import { SITE_CONFIG } from "@/lib/constants";

export function Hero() {
  return (
    <section
      id="hero"
      aria-label="FERMORA introduction"
      className="relative min-h-[95dvh] flex flex-col items-center justify-center px-4 pt-24 pb-12 overflow-hidden bg-[#F8F3E9]"
    >
      {/* ─── Background Layer with Subtle Logo Watermarks ─── */}
      <LogoWatermark
        variant="corner-top-right"
        size={280}
        opacity={0.04}
        className="hidden sm:block"
      />
      <LogoWatermark
        variant="corner-bottom-left"
        size={240}
        opacity={0.035}
        className="hidden sm:block"
      />

      {/* ─── Centered Main Hero Content ─── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto my-auto">
        {/* Subtle Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase text-[#101F3B]/80 bg-[#E6DDF4]/70 border border-[#E8DFD5]">
            <HeartIcon size={13} className="text-[#B66ACB]" />
            Women&apos;s Wellness &amp; Cycle Intelligence
          </span>
        </motion.div>

        {/* Pure Logo Silhouette (Isolated Symbol, 100% Proportional) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative mb-6"
        >
          <div className="w-24 h-28 sm:w-28 sm:h-34 md:w-32 md:h-38 flex items-center justify-center">
            <Image
              src="/images/femora.logo.png"
              alt="FERMORA Official Logo"
              width={196}
              height={236}
              priority
              className="object-contain w-full h-full"
            />
          </div>
        </motion.div>

        {/* Large Brand Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="font-display text-5xl sm:text-7xl md:text-8xl font-semibold tracking-wider text-[#101F3B] mb-4"
        >
          {SITE_CONFIG.name}
        </motion.h1>

        {/* Brand Slogan */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.48,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-lg sm:text-2xl md:text-3xl font-light text-[#26334A]/85 tracking-wide leading-relaxed max-w-xl mx-auto"
        >
          {SITE_CONFIG.tagline}
        </motion.p>

        {/* Action Button Row - Zero Hover Animations, Crisp Focus States */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.65,
            delay: 0.6,
            ease: "easeOut",
          }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#modules"
            className="px-8 py-3 rounded-md text-sm sm:text-base font-medium text-white bg-[#B66ACB] hover:bg-[#9C4EB3] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] border border-[#9C4EB3] transition-all duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B66ACB] focus-visible:ring-offset-2 motion-reduce:transform-none"
          >
            Explore Wellness Modules
          </a>
          <Link
            href="/dashboard"
            className="px-7 py-3 rounded-md text-sm sm:text-base font-medium text-[#101F3B] bg-[#FAF7F2] hover:bg-[#FAF4EB] hover:border-[#B66ACB]/60 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] border border-[#E8DFD5] transition-all duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B66ACB] focus-visible:ring-offset-2 motion-reduce:transform-none"
          >
            Open Dashboard
          </Link>
        </motion.div>
      </div>

      {/* Static Scroll Indicator - No Animated Arrows */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="relative z-10 mt-auto pt-6"
      >
        <a
          href="#modules"
          className="flex flex-col items-center gap-1 text-[11px] font-medium tracking-widest uppercase text-[#26334A]/60 hover:text-[#B66ACB] transition-colors focus:outline-none"
          aria-label="Scroll to discover modules"
        >
          <span>Discover FERMORA</span>
          <ChevronDownIcon size={14} className="text-[#B66ACB]" />
        </a>
      </motion.div>
    </section>
  );
}
