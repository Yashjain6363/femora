import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { LogoWatermark } from "@/components/shared/LogoWatermark";

type Variant = "rose" | "violet";

export function AuthPageChrome({
  children,
  variant = "rose",
}: {
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-[#F8F3E9] text-[#101F3B] relative overflow-hidden">
      {/* Subtle isolated logo background watermark */}
      <LogoWatermark variant="corner-top-right" size={260} opacity={0.035} />
      <LogoWatermark variant="corner-bottom-left" size={220} opacity={0.03} />

      {/* Brand Header */}
      <div className="relative z-10 mb-8 text-center">
        <Link href="/" className="inline-flex flex-col items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B66ACB]">
          <div className="w-12 h-16 relative">
            <Image
              src="/images/femora.logo.png"
              alt="FERMORA Logo"
              width={48}
              height={60}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <span className="font-display text-3xl font-semibold tracking-wider text-[#101F3B] hover:text-[#B66ACB] transition-colors">
            {SITE_CONFIG.name}
          </span>
          <span className="text-xs text-[#26334A]/70 font-light">
            {SITE_CONFIG.tagline}
          </span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>

      <div className="relative z-10 mt-8 text-center text-xs text-[#26334A]/60 flex items-center justify-center gap-4">
        <Link href="/terms" className="hover:text-[#B66ACB] transition-colors">
          Terms of Service
        </Link>
        <span>·</span>
        <Link href="/privacy" className="hover:text-[#B66ACB] transition-colors">
          Privacy Policy
        </Link>
      </div>
    </main>
  );
}
