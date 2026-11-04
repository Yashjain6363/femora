"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  variant?: "rose" | "violet" | "gold" | "default";
  className?: string;
}

export function SectionLabel({
  children,
  variant = "rose",
  className,
}: SectionLabelProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.4 }}
      className={cn("flex justify-center", className)}
    >
      <Badge variant={variant} className="text-xs tracking-widest uppercase font-semibold px-4 py-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
        {children}
      </Badge>
    </motion.div>
  );
}