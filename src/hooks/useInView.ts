"use client";

import { useInView as useFramerInView } from "framer-motion";
import { useRef } from "react";

export function useInView(options?: { once?: boolean; amount?: number }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useFramerInView(ref, {
    once: options?.once ?? true,
    amount: options?.amount ?? 0.2,
  });

  return { ref, isInView };
}