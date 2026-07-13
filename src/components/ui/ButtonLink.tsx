import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "marketplace";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary: "bg-ink-900 text-white hover:bg-ink-800 shadow-soft",
  secondary: "bg-brand-500 text-white hover:bg-brand-600 shadow-soft",
  outline:
    "border border-ink-200 bg-white text-ink-900 hover:border-ink-400 hover:bg-surface-warm",
  ghost: "text-ink-700 hover:bg-ink-100 hover:text-ink-900",
  marketplace:
    "bg-white border border-ink-200 text-ink-900 hover:border-brand-400 hover:bg-brand-50 shadow-soft",
};

const sizes = {
  sm: "h-9 px-3.5 text-sm rounded-xl",
  md: "h-11 px-5 text-sm rounded-xl",
  lg: "h-12 px-7 text-base rounded-2xl",
};

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-[0.98] focus-ring",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
