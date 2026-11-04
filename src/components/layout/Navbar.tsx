"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MenuIcon, CloseIcon } from "@/components/ui/icons";
import { NAV_ITEMS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { NavAuthButtons } from "@/components/layout/NavAuthButtons";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-200",
        scrolled
          ? "bg-[#F8F3E9] border-b border-[#E8DFD5]"
          : "bg-[#F8F3E9]/95 border-b border-transparent"
      )}
    >
      <nav
        className="container-max section-padding flex items-center justify-between h-18 sm:h-20"
        aria-label="Main navigation"
      >
        {/* Brand with official logo symbol */}
        <Link
          href="/"
          className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B66ACB]"
        >
          <div className="relative w-8 h-10 flex-shrink-0">
            <Image
              src="/images/femora.logo.png"
              alt="FERMORA Logo"
              width={32}
              height={39}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <span className="font-display text-2xl font-semibold tracking-wider text-[#101F3B] hover:text-[#B66ACB] transition-colors">
            {SITE_CONFIG.name}
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3.5 py-2 text-sm font-medium text-[#26334A] hover:text-[#B66ACB] transition-all duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 rounded-md hover:bg-[#E6DDF4]/40"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-2">
          <NavAuthButtons />
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-md text-[#101F3B] hover:bg-[#E6DDF4]/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B66ACB]"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-[#F8F3E9] border-b border-[#E8DFD5]"
          >
            <div className="section-padding py-6 space-y-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-[#101F3B] hover:text-[#B66ACB] hover:bg-[#E6DDF4]/40 rounded-md transition-colors"
                >
                  {item.label}
                </a>
              ))}

              <div className="pt-2 pb-2 border-t border-[#E8DFD5]/60 flex items-center gap-4 px-4 text-xs text-[#26334A]/70">
                <Link
                  href="/terms"
                  onClick={() => setIsOpen(false)}
                  className="hover:text-[#B66ACB] transition-colors"
                >
                  Terms
                </Link>
                <span>·</span>
                <Link
                  href="/privacy"
                  onClick={() => setIsOpen(false)}
                  className="hover:text-[#B66ACB] transition-colors"
                >
                  Privacy
                </Link>
              </div>

              <div className="pt-3 border-t border-[#E8DFD5]/70">
                <NavAuthButtons mobile onClickLink={() => setIsOpen(false)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
