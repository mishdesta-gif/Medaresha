import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-olive disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-olive text-ivory hover:bg-olive-900 active:scale-[0.99] shadow-subtle",
        botanical:
          "bg-botanical text-white hover:bg-botanical-light active:scale-[0.99]",
        outline:
          "border border-olive text-olive hover:bg-olive hover:text-ivory",
        outlineMuted:
          "border border-meda-border text-meda-text hover:bg-sand/60",
        ghost:
          "text-meda-text hover:bg-sand/60 hover:text-olive",
        sand:
          "bg-sand text-meda-text hover:bg-sand-dark",
        danger:
          "bg-[#A3322B] text-white hover:bg-[#85251F]",
      },
      size: {
        default: "h-11 px-6 py-2.5 rounded-full",
        sm: "h-9 px-4 text-xs rounded-full",
        lg: "h-13 px-8 text-base rounded-full",
        icon: "h-10 w-10 rounded-full",
        pill: "h-12 px-8 rounded-full tracking-wide",
      },
    },
    defaultVariants: {
      variant: "primary",
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
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
