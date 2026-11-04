import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoWatermarkProps {
  variant?: "corner-top-right" | "corner-bottom-left" | "center" | "card" | "inline";
  className?: string;
  size?: number;
  opacity?: number;
}

/**
 * Isolated FERMORA logo symbol integrated as a subtle, elegant background decorative pattern.
 * Maintains authentic 196:236 logo proportions, never distorts, and operates with
 * restrained opacity to guarantee zero content interference.
 */
export function LogoWatermark({
  variant = "corner-top-right",
  className = "",
  size = 220,
  opacity = 0.045,
}: LogoWatermarkProps) {
  const height = Math.round(size * (236 / 196));

  if (variant === "corner-top-right") {
    return (
      <div
        className={cn(
          "absolute -top-10 -right-10 pointer-events-none select-none z-0 overflow-hidden",
          className
        )}
        style={{ opacity }}
        aria-hidden="true"
      >
        <Image
          src="/images/femora.logo.png"
          alt=""
          width={size}
          height={height}
          className="object-contain"
        />
      </div>
    );
  }

  if (variant === "corner-bottom-left") {
    return (
      <div
        className={cn(
          "absolute -bottom-10 -left-10 pointer-events-none select-none z-0 overflow-hidden scale-x-[-1]",
          className
        )}
        style={{ opacity }}
        aria-hidden="true"
      >
        <Image
          src="/images/femora.logo.png"
          alt=""
          width={size}
          height={height}
          className="object-contain"
        />
      </div>
    );
  }

  if (variant === "center") {
    return (
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 overflow-hidden",
          className
        )}
        style={{ opacity }}
        aria-hidden="true"
      >
        <Image
          src="/images/femora.logo.png"
          alt=""
          width={size}
          height={height}
          className="object-contain"
        />
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={cn(
          "absolute -bottom-6 -right-6 pointer-events-none select-none z-0 overflow-hidden",
          className
        )}
        style={{ opacity: opacity || 0.04 }}
        aria-hidden="true"
      >
        <Image
          src="/images/femora.logo.png"
          alt=""
          width={Math.round(size * 0.65)}
          height={Math.round(height * 0.65)}
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={cn("inline-block pointer-events-none select-none", className)}
      style={{ opacity }}
      aria-hidden="true"
    >
      <Image
        src="/images/femora.logo.png"
        alt=""
        width={size}
        height={height}
        className="object-contain"
      />
    </div>
  );
}
