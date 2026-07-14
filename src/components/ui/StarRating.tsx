import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
}

export function StarRating({
  rating,
  reviewCount,
  size = "sm",
  className,
}: StarRatingProps) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.round(rating);
          return (
            <Star
              key={i}
              className={cn(
                starSize,
                filled
                  ? "fill-brand-500 text-brand-500"
                  : "fill-ink-100 text-ink-200"
              )}
            />
          );
        })}
      </div>
      <span className="text-xs text-ink-600">
        <span className="font-medium text-ink-800">{rating.toFixed(1)}</span>
        {typeof reviewCount === "number" && (
          <span className="text-ink-400"> ({reviewCount})</span>
        )}
      </span>
    </div>
  );
}
