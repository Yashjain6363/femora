"use client";

import { useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

export function useScrollProgress(): {
  ref: React.RefObject<HTMLElement>;
  scrollYProgress: MotionValue<number>;
} {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return { ref, scrollYProgress };
}

export function useParallax(
  scrollYProgress: MotionValue<number>,
  distance: number
): MotionValue<number> {
  return useTransform(scrollYProgress, [0, 1], [-distance, distance]);
}