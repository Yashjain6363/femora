"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldIcon, HeartIcon } from "@/components/ui/icons";
import { LogoWatermark } from "@/components/shared/LogoWatermark";
import { SITE_CONFIG, NAV_ITEMS } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative border-t border-[#E8DFD5] bg-[#F8F3E9] text-[#101F3B] overflow-hidden"
      aria-label="Site footer"
    >
      <LogoWatermark variant="corner-bottom-left" size={240} opacity={0.035} />

      <div className="container-max section-padding py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-6 h-8 relative flex-shrink-0">
                <Image
                  src="/images/femora.logo.png"
                  alt="FERMORA Logo"
                  width={24}
                  height={30}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="font-display text-2xl font-semibold tracking-wider text-[#101F3B]">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="text-[#26334A]/80 text-xs sm:text-sm leading-relaxed max-w-xs font-light">
              {SITE_CONFIG.tagline}. A modern, private space for menstrual health intelligence, craving balance, and hormonal well-being.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#26334A]/70 pt-1">
              <ShieldIcon size={14} className="text-[#B66ACB]" />
              <span>Zero-knowledge client encryption</span>
            </div>
          </div>

          {/* Navigation Modules */}
          <div className="space-y-3.5">
            <h3 className="font-semibold text-[#101F3B] text-xs uppercase tracking-wider">
              Wellness Modules
            </h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-block text-[#26334A]/75 hover:text-[#B66ACB] hover:translate-x-1 text-xs sm:text-sm transition-all duration-150 ease-out"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Privacy - Mandatory */}
          <div className="space-y-3.5">
            <h3 className="font-semibold text-[#101F3B] text-xs uppercase tracking-wider">
              Legal &amp; Privacy
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="inline-block text-[#26334A]/75 hover:text-[#B66ACB] hover:translate-x-1 text-xs sm:text-sm transition-all duration-150 ease-out"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="inline-block text-[#26334A]/75 hover:text-[#B66ACB] hover:translate-x-1 text-xs sm:text-sm transition-all duration-150 ease-out"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms#clinical-notice"
                  className="inline-block text-[#26334A]/75 hover:text-[#B66ACB] hover:translate-x-1 text-xs sm:text-sm transition-all duration-150 ease-out"
                >
                  Clinical &amp; Medical Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy#data-rights"
                  className="inline-block text-[#26334A]/75 hover:text-[#B66ACB] hover:translate-x-1 text-xs sm:text-sm transition-all duration-150 ease-out"
                >
                  Your Data Rights
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Care */}
          <div className="space-y-3.5">
            <h3 className="font-semibold text-[#101F3B] text-xs uppercase tracking-wider">
              Contact &amp; Care
            </h3>
            <p className="text-xs text-[#26334A]/75 leading-relaxed font-light">
              Questions about cycle insights or our privacy pledge? Reach our team directly:
            </p>
            <div className="pt-1">
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-xs sm:text-sm font-medium text-[#B66ACB] hover:text-[#9C4EB3] transition-colors"
              >
                {SITE_CONFIG.email}
              </a>
            </div>
            <div className="text-[11px] text-[#26334A]/60 pt-2 font-light">
              FERMORA operates under strict data sovereignty. Educational wellness companion, not medical diagnosis.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#E8DFD5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#26334A]/65">
          <p>© {currentYear} FERMORA Health Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-[#B66ACB] transition-colors">
              Terms
            </Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-[#B66ACB] transition-colors">
              Privacy
            </Link>
            <span>·</span>
            <span>Crafted with care for menstrual well-being</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
