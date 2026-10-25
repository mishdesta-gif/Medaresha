import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-meda-border bg-[#FDFBF7] px-4 py-2 text-sm text-meda-text transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-meda-muted/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-olive focus-visible:border-olive disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
