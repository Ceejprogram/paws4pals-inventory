import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        warning:
          "border-transparent bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
        success:
          "border-transparent bg-green-100 text-green-700 hover:bg-green-200",
        danger: "border-transparent bg-red-100 text-red-700 hover:bg-red-200",
        "out-stock":
          "border-transparent bg-red-200 text-red-800 hover:bg-red-300 dark:bg-red-800/40 dark:text-red-500 dark:hover:bg-red-800/60",
        "low-stock":
          "border-transparent bg-yellow-200 text-yellow-800 hover:bg-yellow-300 dark:bg-yellow-800/40 dark:text-yellow-500 dark:hover:bg-yellow-800/60",
        "suspend-order":
          "border-transparent bg-sky-100 text-sky-700 hover:bg-sky-200",
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
