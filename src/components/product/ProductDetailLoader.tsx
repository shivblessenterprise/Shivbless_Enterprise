"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { getProductBySlug, loadProducts } from "@/lib/products";
import type { Product } from "@/types";

export function ProductDetailLoader({
  slug,
  initialProduct,
}: {
  slug: string;
  initialProduct?: Product;
}) {
  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [ready, setReady] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // 1) localStorage / seed
      const local = getProductBySlug(slug, loadProducts());
      if (local && !cancelled) {
        setProduct(local);
        setReady(true);
        return;
      }

      // 2) server catalogue API
      try {
        const res = await fetch("/api/catalog", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as { products?: Product[] };
          const found = data.products?.find((p) => p.slug === slug);
          if (found && !cancelled) {
            setProduct(found);
            setReady(true);
            return;
          }
        }
      } catch {
        // continue
      }

      if (!cancelled) {
        if (initialProduct) {
          setProduct(initialProduct);
          setReady(true);
        } else {
          setNotFound(true);
          setReady(true);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [slug, initialProduct]);

  if (!ready) {
    return (
      <div className="container-premium grid gap-8 py-12 lg:grid-cols-2">
        <ProductCardSkeleton />
        <div className="space-y-4 pt-4">
          <div className="h-8 w-2/3 animate-pulse rounded-xl bg-ink-100" />
          <div className="h-4 w-1/3 animate-pulse rounded-xl bg-ink-100" />
          <div className="h-24 w-full animate-pulse rounded-xl bg-ink-100" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-ink-100" />
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="container-premium flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
          Product
        </p>
        <h1 className="mt-3 font-display text-3xl text-ink-900 sm:text-4xl">
          Product not found
        </h1>
        <p className="mt-3 max-w-md text-ink-500">
          Yeh product catalogue mein nahi mila. Shop pe wapas jayein ya humse
          contact karein.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/shop">Browse Shop</ButtonLink>
          <ButtonLink href="/contact" variant="outline">
            Contact Us
          </ButtonLink>
        </div>
        <p className="mt-6 text-sm text-ink-400">
          Need help?{" "}
          <Link href="/contact" className="text-brand-700 hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    );
  }

  return <ProductDetailView product={product} />;
}
