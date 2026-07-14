import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "marketplace";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-ink-900 text-white hover:bg-ink-800 shadow-soft",
  secondary:
    "bg-brand-500 text-white hover:bg-brand-600 shadow-soft",
  outline:
    "border border-ink-200 bg-white text-ink-900 hover:border-ink-400 hover:bg-surface-warm",
  ghost: "text-ink-700 hover:bg-ink-100 hover:text-ink-900",
  marketplace:
    "bg-white border border-ink-200 text-ink-900 hover:border-brand-400 hover:bg-brand-50 shadow-soft",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-xl",
  md: "h-11 px-5 text-sm rounded-xl",
  lg: "h-12 px-7 text-base rounded-2xl",
  icon: "h-10 w-10 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-ring",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
