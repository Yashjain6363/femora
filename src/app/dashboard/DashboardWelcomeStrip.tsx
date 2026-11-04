"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircleIcon } from "@/components/ui/icons";

type Props = { showWelcome: boolean };

export function DashboardWelcomeStrip({ showWelcome }: Props) {
  const router = useRouter();
  const [visible, setVisible] = useState(showWelcome);

  useEffect(() => {
    if (!showWelcome) return;
    router.replace("/dashboard", { scroll: false });
  }, [showWelcome, router]);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 8000);
    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="rounded-lg border border-[#B66ACB]/30 bg-[#E6DDF4]/60 px-4 py-3 text-xs sm:text-sm text-[#101F3B] flex items-start gap-3"
    >
      <CheckCircleIcon size={18} className="shrink-0 text-[#B66ACB] mt-0.5" aria-hidden="true" />
      <p>
        <span className="font-semibold text-[#101F3B]">Welcome to your personal space.</span>{" "}
        Your wellness logs and cycle metrics are active. Explore every module from here.
      </p>
    </div>
  );
}
