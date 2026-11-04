import type { Variants, Transition } from "framer-motion";

// Base Transitions

export const smoothTransition: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 1,
};

export const snappyTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const gentleTransition: Transition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1],
};

export const dramaticTransition: Transition = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1],
};

// Reveal Variants

export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: gentleTransition,
  },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: gentleTransition,
  },
};

// Container Stagger Variants

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

// Reduced Motion Helpers

export function getReducedVariants(variants: Variants): Variants {
  const reduced: Variants = {};
  for (const key in variants) {
    const variant = variants[key];
    if (typeof variant === "object" && !Array.isArray(variant)) {
      reduced[key] = {
        ...variant,
        transition: { duration: 0.01 },
        y: 0,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
      };
    }
  }
  return reduced;
}

// Viewport Config

export const defaultViewport = {
  once: true,
  amount: 0.2,
} as const;
