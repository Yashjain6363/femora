import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "rose-violet" | "violet-rose" | "gold" | "rose-gold";
}

export function GradientText({
  children,
  className,
  variant = "rose-violet",
}: GradientTextProps) {
  const gradients = {
    "rose-violet": "from-rose-400 via-rose-300 to-violet-400",
    "violet-rose": "from-violet-400 via-rose-300 to-rose-400",
    gold: "from-gold-light via-gold-DEFAULT to-gold-dark",
    "rose-gold": "from-rose-300 via-gold-light to-gold-DEFAULT",
  };

  return (
    <span
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent",
        gradients[variant],
        className
      )}
    >
      {children}
    </span>
  );
}