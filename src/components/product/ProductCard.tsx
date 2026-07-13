"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { MarketplaceBadge, MarketplaceButton } from "@/components/ui/MarketplaceBadge";
import { StarRating } from "@/components/ui/StarRating";
import { WishlistButton } from "@/components/product/WishlistButton";
import { formatPrice, cn } from "@/lib/utils";
import { getCategoriesWithCounts } from "@/lib/products";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  view?: "grid" | "list";
  className?: string;
}

export function ProductCard({
  product,
  view = "grid",
  className,
}: ProductCardProps) {
  const categoryName =
    getCategoriesWithCounts().find((c) => c.slug === product.category)?.name ||
    product.category;

  if (view === "list") {
    return (
      <article
        className={cn(
          "group flex flex-col gap-4 overflow-hidden rounded-2xl border border-ink-100 bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card sm:flex-row",
          className
        )}
      >
        <Link
          href={`/products/${product.slug}`}
          className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-[#F3EFE8] sm:aspect-square sm:w-44"
        >
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        sizes="176px"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                        unoptimized={
                          product.images[0]?.startsWith("/uploads") ||
                          product.images[0]?.startsWith("blob:")
                        }
                      />
          {product.badge && (
            <span className="absolute left-2 top-2 rounded-full bg-ink-900/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              {product.badge}
            </span>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
                {categoryName}
              </p>
              <Link href={`/products/${product.slug}`}>
                <h3 className="mt-1 font-display text-lg text-ink-900 transition-colors group-hover:text-brand-700">
                  {product.title}
                </h3>
              </Link>
            </div>
            <WishlistButton productId={product.id} size="sm" />
          </div>

          <p className="mt-2 line-clamp-2 text-sm text-ink-500">
            {product.shortDescription}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
            <MarketplaceBadge marketplace={product.marketplace} />
          </div>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-ink-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-ink-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xs font-semibold text-brand-700">
                    {product.discount}% off
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/products/${product.slug}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3 text-xs font-medium text-ink-800 transition hover:bg-surface-warm focus-ring"
              >
                <Eye className="h-3.5 w-3.5" />
                View Product
              </Link>
              {product.meeshoUrl && (
                <MarketplaceButton platform="meesho" url={product.meeshoUrl} size="sm" />
              )}
              {product.flipkartUrl && (
                <MarketplaceButton platform="flipkart" url={product.flipkartUrl} size="sm" />
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card",
        className
      )}
    >
      <div className="relative">
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-[4/5] overflow-hidden bg-[#F3EFE8]"
        >
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
            unoptimized={
              product.images[0]?.startsWith("/uploads") ||
              product.images[0]?.startsWith("blob:")
            }
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/15 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </Link>
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-ink-900/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            {product.badge}
          </span>
        )}
        <WishlistButton
          productId={product.id}
          size="sm"
          className="absolute right-3 top-3"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="truncate text-[11px] font-medium uppercase tracking-wide text-brand-600">
            {categoryName}
          </p>
          <MarketplaceBadge marketplace={product.marketplace} />
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 font-display text-base leading-snug text-ink-900 transition-colors group-hover:text-brand-700 sm:text-[17px]">
            {product.title}
          </h3>
        </Link>

        <div className="mt-2">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-ink-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <>
              <span className="text-sm text-ink-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[11px] font-semibold text-brand-700">
                {product.discount}% off
              </span>
            </>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-4">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-ink-200 bg-white text-sm font-medium text-ink-800 transition hover:bg-surface-warm focus-ring"
          >
            <Eye className="h-4 w-4" />
            View Product
          </Link>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {product.meeshoUrl && (
              <MarketplaceButton
                platform="meesho"
                url={product.meeshoUrl}
                size="sm"
                className="w-full"
              />
            )}
            {product.flipkartUrl && (
              <MarketplaceButton
                platform="flipkart"
                url={product.flipkartUrl}
                size="sm"
                className="w-full"
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
