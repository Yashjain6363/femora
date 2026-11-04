import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors border",
  {
    variants: {
      variant: {
        default: "bg-[#FAF7F2] text-[#101F3B] border-[#E8DFD5]",
        rose: "bg-[#F2DCE7] text-[#101F3B] border-[#E8DFD5]",
        violet: "bg-[#E6DDF4] text-[#7A3E8E] border-[#D1BDF2]",
        orchid: "bg-[#B66ACB]/15 text-[#7A3E8E] border-[#B66ACB]/30",
        gold: "bg-[#EBD9CC]/40 text-[#101F3B] border-[#E8DFD5]",
        success: "bg-emerald-50 text-emerald-800 border-emerald-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
