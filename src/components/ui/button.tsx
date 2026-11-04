"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs sm:text-sm font-medium transition-all duration-150 ease-out active:scale-[0.98] motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B66ACB] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#B66ACB] text-white hover:bg-[#9C4EB3] hover:-translate-y-0.5 active:translate-y-0 border border-[#9C4EB3]",
        outline:
          "border border-[#E8DFD5] bg-[#FAF7F2] text-[#101F3B] hover:bg-[#FAF4EB] hover:border-[#B66ACB]/60 hover:-translate-y-0.5 active:translate-y-0",
        ghost:
          "text-[#26334A] hover:text-[#101F3B] hover:bg-[#E6DDF4]/40 active:scale-[0.98]",
        link: "text-[#B66ACB] underline-offset-4 hover:underline hover:text-[#9C4EB3]",
        violet:
          "bg-[#101F3B] text-white hover:bg-[#26334A] hover:-translate-y-0.5 active:translate-y-0 border border-[#101F3B]",
        orchid:
          "bg-[#B66ACB] text-white hover:bg-[#8637A7] hover:-translate-y-0.5 active:translate-y-0 border border-[#8637A7]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8.5 rounded-md px-3.5 text-xs",
        lg: "h-11 rounded-md px-7 text-sm sm:text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
