"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border bg-[#FAF7F2] px-3.5 py-2 text-xs sm:text-sm text-[#101F3B]",
            "placeholder:text-[#26334A]/40 focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-[#B66ACB] focus-visible:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-colors duration-150",
            error
              ? "border-red-500/80 focus-visible:ring-red-500"
              : "border-[#E8DFD5] hover:border-[#B66ACB]/50",
            className
          )}
          ref={ref}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${props.id}-error`}
            className="mt-1.5 text-xs text-red-600 font-medium"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
