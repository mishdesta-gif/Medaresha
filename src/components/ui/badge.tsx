import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-sand text-meda-text border border-meda-border",
        olive: "bg-olive text-ivory",
        botanical: "bg-botanical-pale text-botanical border border-botanical/20",
        
        // Housekeeping & Operations
        clean: "bg-[#EAF3ED] text-[#245C3C] border border-[#BDE2CD]",
        dirty: "bg-[#FBEAE9] text-[#9B2C24] border border-[#F5C2BF]",
        progress: "bg-[#FBF4E8] text-[#9A6517] border border-[#F6DFB6]",
        inspected: "bg-[#EBF2F7] text-[#245070] border border-[#BFD8E8]",
        maintenance: "bg-[#F0EFF4] text-[#4E486B] border border-[#D2D0DF]",
        
        // Reservation & Payment
        confirmed: "bg-[#EAF3ED] text-[#245C3C] border border-[#BDE2CD]",
        checked_in: "bg-[#343B2A] text-[#F5F0E6]",
        checked_out: "bg-sand text-meda-muted border border-meda-border",
        awaiting_payment: "bg-[#FBF4E8] text-[#9A6517] border border-[#F6DFB6]",
        cancelled: "bg-[#FBEAE9] text-[#9B2C24] border border-[#F5C2BF]",
        paid: "bg-[#EAF3ED] text-[#245C3C] border border-[#BDE2CD]",
        unpaid: "bg-[#FBEAE9] text-[#9B2C24] border border-[#F5C2BF]",
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
