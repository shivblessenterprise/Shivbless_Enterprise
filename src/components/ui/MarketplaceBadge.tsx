import { ExternalLink } from "lucide-react";
import { cn, externalLinkProps } from "@/lib/utils";
import type { Marketplace } from "@/types";

interface MarketplaceBadgeProps {
  marketplace: Marketplace;
  className?: string;
}

export function MarketplaceBadge({
  marketplace,
  className,
}: MarketplaceBadgeProps) {
  const label =
    marketplace === "both"
      ? "Meesho & Flipkart"
      : marketplace === "meesho"
        ? "Meesho"
        : "Flipkart";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-700",
        className
      )}
    >
      {label}
    </span>
  );
}

interface MarketplaceButtonProps {
  platform: "meesho" | "flipkart";
  url: string;
  className?: string;
  size?: "sm" | "md";
}

export function MarketplaceButton({
  platform,
  url,
  className,
  size = "md",
}: MarketplaceButtonProps) {
  const label = platform === "meesho" ? "Buy on Meesho" : "Buy on Flipkart";

  return (
    <a
      {...externalLinkProps(url)}
      aria-label={`${label} (opens in new tab)`}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-200 focus-ring border shadow-soft",
        platform === "meesho"
          ? "border-[#9B1B6B]/30 bg-[#9B1B6B] text-white hover:bg-[#7E1557]"
          : "border-[#2874F0]/30 bg-[#2874F0] text-white hover:bg-[#1A5DC8]",
        size === "sm"
          ? "h-9 rounded-xl px-3 text-xs"
          : "h-11 rounded-xl px-4 text-sm",
        className
      )}
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5 opacity-90" aria-hidden />
    </a>
  );
}
