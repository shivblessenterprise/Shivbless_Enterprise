import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  compact?: boolean;
}

/**
 * Classic typographic SB seal — flat color, no gradients / sparkles.
 * Uses the site display font so it matches the wordmark.
 */
function SbMark({ size = 40 }: { size?: number }) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center rounded-full border border-ink-900/15 bg-brand-100"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* Inner ring — traditional seal feel */}
      <span
        className="absolute inset-[3px] rounded-full border border-brand-400/35"
        aria-hidden
      />
      <span
        className="relative font-display font-semibold leading-none tracking-[-0.04em] text-ink-900"
        style={{ fontSize: size * 0.34 }}
      >
        SB
      </span>
    </span>
  );
}

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 focus-ring rounded-lg",
        className
      )}
      aria-label="Shivbless Enterprise home"
    >
      <SbMark size={compact ? 36 : 40} />
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-display font-semibold tracking-tight text-ink-900 transition-colors group-hover:text-brand-800",
            compact ? "text-base" : "text-lg"
          )}
        >
          Shivbless
        </span>
        <span
          className={cn(
            "font-sans font-medium uppercase tracking-[0.18em] text-ink-500",
            compact ? "text-[9px]" : "text-[10px]"
          )}
        >
          Enterprise
        </span>
      </span>
    </Link>
  );
}
