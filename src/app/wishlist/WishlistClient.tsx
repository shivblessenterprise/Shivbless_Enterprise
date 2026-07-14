"use client";

import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useWishlist } from "@/hooks/useWishlist";
import { useProducts } from "@/hooks/useProducts";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function WishlistClient() {
  const { ids, isReady: wishReady, clear } = useWishlist();
  const { products, isReady: productsReady } = useProducts();

  const ready = wishReady && productsReady;
  const items = products.filter((p) => ids.includes(p.id));

  return (
    <div className="container-premium py-12 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink-900 sm:text-4xl">
            Wishlist
          </h1>
          <p className="mt-2 text-ink-500">
            {ready
              ? `${items.length} saved product${items.length === 1 ? "" : "s"}`
              : "Loading…"}
          </p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="text-sm font-medium text-ink-500 hover:text-ink-800"
          >
            Clear all
          </button>
        )}
      </div>

      {!ready && (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {ready && items.length === 0 && (
        <div className="mt-12 rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-16 text-center">
          <p className="font-display text-2xl text-ink-900">
            Your wishlist is empty
          </p>
          <p className="mt-2 text-sm text-ink-500">
            Save products you love and revisit them anytime — no login needed.
          </p>
          <ButtonLink href="/shop" className="mt-6">
            Browse Products
          </ButtonLink>
        </div>
      )}

      {ready && items.length > 0 && (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <p className="mt-10 text-center text-sm text-ink-400">
        Wishlist is stored on this device.{" "}
        <Link href="/shop" className="text-brand-700 hover:underline">
          Continue shopping
        </Link>
      </p>
    </div>
  );
}
