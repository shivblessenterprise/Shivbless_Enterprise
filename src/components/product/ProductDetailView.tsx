"use client";

import { useEffect, useState } from "react";
import { Share2, Truck, RotateCcw } from "lucide-react";
import { MarketplaceBadge, MarketplaceButton } from "@/components/ui/MarketplaceBadge";
import { StarRating } from "@/components/ui/StarRating";
import { WishlistButton } from "@/components/product/WishlistButton";
import { ProductCard } from "@/components/product/ProductCard";
import { PremiumImageZoom } from "@/components/product/PremiumImageZoom";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { formatPrice, cn } from "@/lib/utils";
import {
  getCategoriesWithCounts,
  getRelatedProducts,
  loadProducts,
} from "@/lib/products";
import type { Product } from "@/types";

export function ProductDetailView({ product }: { product: Product }) {
  const [selectedColour, setSelectedColour] = useState(product.colours[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [related, setRelated] = useState<Product[]>([]);

  const images = product.images.filter(Boolean);

  const categoryName =
    getCategoriesWithCounts().find((c) => c.slug === product.category)?.name ||
    product.category;

  useEffect(() => {
    setSelectedColour(product.colours[0] || "");
    setSelectedSize(product.sizes[0] || "");
    setRelated(getRelatedProducts(product, 4, loadProducts()));
  }, [product]);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard");
    }
  };

  return (
    <div className="container-premium py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: categoryName, href: `/categories/${product.category}` },
          { label: product.title },
        ]}
      />

      <div className="grid gap-10 overflow-visible lg:grid-cols-2 lg:gap-14">
        <div className="relative z-20 overflow-visible">
          <PremiumImageZoom
            images={images}
            alt={product.title}
            badge={product.badge}
          />
        </div>

        {/* Details */}
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              {categoryName}
            </p>
            <MarketplaceBadge marketplace={product.marketplace} />
          </div>

          <h1 className="mt-3 font-display text-3xl text-ink-900 sm:text-4xl text-balance">
            {product.title}
          </h1>

          <div className="mt-4">
            <StarRating
              rating={product.rating}
              reviewCount={product.reviewCount}
              size="md"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold text-ink-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-lg text-ink-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="rounded-lg bg-brand-50 px-2 py-1 text-sm font-semibold text-brand-700">
                  {product.discount}% off
                </span>
              </>
            )}
          </div>
          <p className="mt-2 text-xs text-ink-400">
            Prices may change on Meesho or Flipkart at checkout.
          </p>

          <p className="mt-5 text-ink-600 leading-relaxed">
            {product.shortDescription}
          </p>

          {product.colours.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-ink-900">Colour</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colours.map((colour) => (
                  <button
                    key={colour}
                    type="button"
                    onClick={() => setSelectedColour(colour)}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-sm transition focus-ring",
                      selectedColour === colour
                        ? "border-ink-900 bg-ink-900 text-white"
                        : "border-ink-200 bg-white text-ink-700 hover:border-ink-400"
                    )}
                  >
                    {colour}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-ink-900">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-sm transition focus-ring",
                      selectedSize === size
                        ? "border-ink-900 bg-ink-900 text-white"
                        : "border-ink-200 bg-white text-ink-700 hover:border-ink-400"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-ink-100 bg-surface-muted p-5">
            <h2 className="font-display text-xl text-ink-900">
              Choose Where You Want to Shop
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              You will be redirected to the selected marketplace to complete your
              purchase securely.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {product.meeshoUrl && (
                <MarketplaceButton platform="meesho" url={product.meeshoUrl} />
              )}
              {product.flipkartUrl && (
                <MarketplaceButton platform="flipkart" url={product.flipkartUrl} />
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <WishlistButton productId={product.id} />
            <button
              type="button"
              onClick={share}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 text-sm font-medium text-ink-700 transition hover:bg-surface-warm focus-ring"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="flex gap-3 rounded-xl border border-ink-100 bg-white p-4">
              <Truck className="h-5 w-5 shrink-0 text-brand-600" />
              <div>
                <p className="text-sm font-medium text-ink-900">Shipping</p>
                <p className="mt-0.5 text-xs text-ink-500">
                  Handled by the marketplace after you complete checkout.
                </p>
              </div>
            </div>
            <div className="flex gap-3 rounded-xl border border-ink-100 bg-white p-4">
              <RotateCcw className="h-5 w-5 shrink-0 text-brand-600" />
              <div>
                <p className="text-sm font-medium text-ink-900">Returns</p>
                <p className="mt-0.5 text-xs text-ink-500">
                  Return policies follow Meesho or Flipkart terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights & specs */}
      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl text-ink-900">Highlights</h2>
          <ul className="mt-4 space-y-2">
            {product.highlights.map((h) => (
              <li key={h} className="flex gap-2 text-sm text-ink-700">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                {h}
              </li>
            ))}
          </ul>
          <h2 className="mt-8 font-display text-2xl text-ink-900">Description</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-600">
            {product.fullDescription}
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-ink-900">Specifications</h2>
          <dl className="mt-4 divide-y divide-ink-100 rounded-2xl border border-ink-100 bg-white">
            {product.specifications.map((spec) => (
              <div
                key={spec.label}
                className="grid grid-cols-2 gap-4 px-4 py-3 text-sm"
              >
                <dt className="text-ink-500">{spec.label}</dt>
                <dd className="font-medium text-ink-900">{spec.value}</dd>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4 px-4 py-3 text-sm">
              <dt className="text-ink-500">Availability</dt>
              <dd className="font-medium capitalize text-ink-900">
                {product.stockStatus.replace("_", " ")}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl text-ink-900 sm:text-3xl">
            Related Products
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
