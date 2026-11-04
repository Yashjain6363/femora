import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LogoWatermark } from "@/components/shared/LogoWatermark";
import { ShieldIcon, ArrowRightIcon } from "@/components/ui/icons";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service, medical disclaimers, and user agreements for FERMORA.",
};

export default function TermsPage() {
  const lastUpdated = "November 2026";

  return (
    <>
      <Navbar />
      <main id="main-content" className="relative bg-[#F8F3E9] text-[#101F3B] min-h-screen pt-28 pb-20">
        <LogoWatermark variant="corner-top-right" size={260} opacity={0.04} />

        <div className="container-max section-padding">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#E6DDF4]/70 text-[#7A3E8E] text-xs font-semibold tracking-wider uppercase mb-4 border border-[#E8DFD5]">
              <ShieldIcon size={14} className="text-[#B66ACB]" />
              Legal &amp; Clinical Disclaimers
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#101F3B] tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-sm sm:text-base text-[#26334A]/80 leading-relaxed font-light">
              Last updated: {lastUpdated}. Please review these Terms of Service carefully before utilizing the FERMORA platform, cycle forecasts, and health journaling services.
            </p>
          </div>

          {/* Medical Notice Callout */}
          <div className="max-w-3xl mb-10 p-6 rounded-xl bg-[#FAF7F2] border border-[#B66ACB]/30">
            <h2 className="text-base font-semibold text-[#101F3B] mb-2">
              Important Clinical Notice
            </h2>
            <p className="text-xs sm:text-sm text-[#26334A]/85 leading-relaxed font-light">
              FERMORA is an educational wellness companion designed to empower individuals with cycle awareness, lifestyle rhythms, and nutritional mindfulness. FERMORA does not provide medical diagnoses, clinical treatment, prescription advice, or contraception validation. Always consult a qualified obstetrician, gynecologist, or healthcare professional regarding reproductive concerns or unusual physiological symptoms.
            </p>
          </div>

          {/* Terms Content Sections */}
          <div className="max-w-3xl space-y-10 text-[#26334A]/90 text-sm sm:text-base leading-relaxed font-light">
            <section className="space-y-3">
              <h2 className="font-display text-2xl font-semibold text-[#101F3B]">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing, browsing, or utilizing FERMORA (accessible at fermora.app and related subdomains), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you disagree with any portion of these terms, you are prohibited from utilizing the platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl font-semibold text-[#101F3B]">
                2. Eligibility and Privacy First Architecture
              </h2>
              <p>
                FERMORA is designed to respect user dignity, privacy, and bodily autonomy. Users under 18 years of age should review these terms with a parent or legal guardian. We believe that reproductive health data is fundamentally sensitive personal property. As detailed in our Privacy Policy, your cycle logs, craving notes, and health reflections remain under strict client-side encryption and are never monetized or distributed to marketing brokers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl font-semibold text-[#101F3B]">
                3. Algorithmic Projections and Educational Guidance
              </h2>
              <p>
                All biological phase projections, ovulation forecasts, and cycle calculations provided by FERMORA are mathematical estimates derived from statistical models and user-input averages. Natural biological cycles vary significantly due to stress, travel, illness, medications, and lifestyle changes. FERMORA shall not be utilized as a reliable method of contraception or birth control.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl font-semibold text-[#101F3B]">
                4. User Account and Security
              </h2>
              <p>
                When creating an account on FERMORA, you agree to provide truthful information and maintain the confidentiality of your credentials. You are responsible for all activities that occur under your account. Notify our security team immediately at care@fermora.app if you suspect unauthorized access.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl font-semibold text-[#101F3B]">
                5. Intellectual Property
              </h2>
              <p>
                All visual brand assets, software architecture, user interfaces, editorial articles, and logos are the exclusive proprietary property of FERMORA Health Inc. You are granted a limited, personal, non-transferable license to access the services for individual health tracking.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl font-semibold text-[#101F3B]">
                6. Limitation of Liability
              </h2>
              <p>
                To the fullest extent permitted by applicable law, FERMORA Health Inc., its founders, clinicians, and contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from the use or inability to use our platform or recommendations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-2xl font-semibold text-[#101F3B]">
                7. Contact Information
              </h2>
              <p>
                Questions or concerns regarding these terms should be addressed to our legal and clinical ethics committee at:
              </p>
              <div className="p-4 rounded-lg bg-[#FAF7F2] border border-[#E8DFD5] text-xs sm:text-sm text-[#101F3B]">
                <p className="font-semibold">FERMORA Health Inc. Legal Department</p>
                <p>Email: care@fermora.app</p>
                <p>Subject: Legal &amp; Compliance Inquiries</p>
              </div>
            </section>
          </div>

          {/* Quick link to Privacy Policy */}
          <div className="max-w-3xl mt-14 pt-8 border-t border-[#E8DFD5] flex items-center justify-between">
            <span className="text-xs sm:text-sm text-[#26334A]/70">
              Read how your personal health data is protected.
            </span>
            <Link
              href="/privacy"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#B66ACB] hover:text-[#9C4EB3] transition-colors"
            >
              <span>Privacy Policy</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
