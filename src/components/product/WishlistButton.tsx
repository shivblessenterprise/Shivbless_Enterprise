"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "md";
}

export function WishlistButton({
  productId,
  className,
  size = "md",
}: WishlistButtonProps) {
  const { isWishlisted, toggle } = useWishlist();
  const active = isWishlisted(productId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-ink-100 bg-white/95 text-ink-600 shadow-soft backdrop-blur transition-all hover:border-brand-300 hover:text-brand-600 focus-ring",
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
        active && "border-brand-300 text-brand-600",
        className
      )}
    >
      <Heart
        className={cn(
          size === "sm" ? "h-4 w-4" : "h-4.5 w-4.5",
          active && "fill-brand-500 text-brand-500 animate-heart-pop"
        )}
      />
    </button>
  );
}
