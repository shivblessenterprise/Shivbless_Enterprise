"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { getBestSellers } from "@/lib/products";

export function BestSellersSection() {
  const products = getBestSellers();
  const railRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const node = railRef.current;
    if (!node) return;
    node.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="section-padding">
      <div className="container-premium">
        <FadeIn>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                Customer favourites
              </p>
              <h2 className="mt-3 font-display text-3xl text-ink-900 sm:text-4xl">
                Best Sellers
              </h2>
            </div>
            <div className="hidden gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-700 transition hover:bg-surface-warm focus-ring"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-700 transition hover:bg-surface-warm focus-ring"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </FadeIn>

        <div
          ref={railRef}
          className="mt-10 flex gap-5 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[260px] shrink-0 snap-start sm:w-[280px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
