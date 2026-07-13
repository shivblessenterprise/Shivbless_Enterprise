"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ExternalLink, ShieldCheck, Sparkles, Store } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { FadeIn } from "@/components/ui/FadeIn";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { useProducts } from "@/hooks/useProducts";
import { siteConfig } from "@/lib/site";
import { externalLinkProps, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

function isLocal(src: string) {
  return src.startsWith("/uploads") || src.startsWith("blob:");
}

export function HomePageContent() {
  const { products, isReady } = useProducts();
  const [index, setIndex] = useState(0);

  // Rotate through ALL products — nothing fixed to one item
  useEffect(() => {
    if (products.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % products.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [products.length]);

  // Keep index in range when product list changes
  useEffect(() => {
    if (products.length === 0) {
      setIndex(0);
      return;
    }
    setIndex((prev) => prev % products.length);
  }, [products.length]);

  const current: Product | undefined = products[index];
  const heroImage = current?.images?.[0];

  return (
    <>
      {/* HERO — auto slides all products */}
      <section className="relative min-h-[88vh] overflow-hidden bg-ink-950 text-white">
        {heroImage ? (
          <Image
            key={heroImage}
            src={heroImage}
            alt={current?.title || "Shivbless Enterprise"}
            fill
            priority
            unoptimized={isLocal(heroImage)}
            className="object-cover object-center opacity-55 animate-fade-in"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,#3a2f24,transparent_55%),linear-gradient(160deg,#1a1a18,#2a241c)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/55 to-ink-950/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-ink-950/30" />

        <div className="container-premium relative flex min-h-[88vh] flex-col justify-end pb-16 pt-28 lg:justify-center lg:pb-24 lg:pt-20">
          <p className="font-display text-3xl tracking-tight text-brand-300 sm:text-4xl lg:text-5xl">
            Shivbless Enterprise
          </p>

          {current ? (
            <div key={current.id} className="animate-fade-in">
              <h1 className="mt-5 max-w-2xl font-display text-4xl leading-[1.08] text-white text-balance sm:text-5xl lg:text-6xl">
                {current.title}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                {current.shortDescription}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="font-display text-3xl text-brand-300">
                  {formatPrice(current.price)}
                </span>
                {current.originalPrice > current.price && (
                  <>
                    <span className="text-white/45 line-through">
                      {formatPrice(current.originalPrice)}
                    </span>
                    <span className="rounded-md bg-brand-500/20 px-2 py-1 text-xs font-semibold text-brand-200">
                      {current.discount}% off
                    </span>
                  </>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink
                  href={`/products/${current.slug}`}
                  size="lg"
                  className="bg-brand-500 text-white hover:bg-brand-600"
                >
                  View Product
                </ButtonLink>
                <ButtonLink
                  href="/shop"
                  variant="outline"
                  size="lg"
                  className="border-white/30 bg-white/5 text-white hover:bg-white/10"
                >
                  Shop All
                </ButtonLink>
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <h1 className="max-w-2xl font-display text-4xl leading-[1.08] text-white sm:text-5xl">
                Premium products for everyday rituals.
              </h1>
              <p className="mt-5 max-w-xl text-white/75">
                New products jaldi aa rahe hain. Tab tak Shop pe browse karein.
              </p>
              <ButtonLink
                href="/shop"
                size="lg"
                className="mt-8 bg-brand-500 text-white hover:bg-brand-600"
              >
                Browse Shop
              </ButtonLink>
            </div>
          )}
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-ink-100 bg-white">
        <div className="container-premium grid gap-6 py-10 sm:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "Curated Quality",
              text: "Thoughtfully selected everyday essentials.",
            },
            {
              icon: ShieldCheck,
              title: "Secure Checkout",
              text: "Buy safely on Meesho & Flipkart.",
            },
            {
              icon: Store,
              title: "Trusted Marketplaces",
              text: "Delivery & returns by the platform.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <item.icon
                className="mt-0.5 h-5 w-5 shrink-0 text-brand-600"
                strokeWidth={1.5}
              />
              <div>
                <p className="font-medium text-ink-900">{item.title}</p>
                <p className="mt-1 text-sm text-ink-500">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ALL products grid — dynamic from admin catalogue */}
      <section className="section-padding bg-surface-muted">
        <div className="container-premium">
          <FadeIn>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                  Our Collection
                </p>
                <h2 className="mt-3 font-display text-3xl text-ink-900 sm:text-4xl">
                  All Products
                </h2>
                <p className="mt-2 max-w-xl text-ink-500">
                  Carefully selected essentials — browse and shop on Meesho or
                  Flipkart.
                </p>
              </div>
              <ButtonLink href="/shop" variant="outline">
                View Shop
              </ButtonLink>
            </div>
          </FadeIn>

          {!isReady && (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {isReady && products.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-16 text-center">
              <p className="font-display text-2xl text-ink-900">
                Products coming soon
              </p>
              <p className="mt-2 text-sm text-ink-500">
                Catalogue update ho raha hai. Jaldi wapas check karein.
              </p>
              <ButtonLink href="/contact" className="mt-6">
                Contact Us
              </ButtonLink>
            </div>
          )}

          {isReady && products.length > 0 && (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, i) => (
                <FadeIn key={product.id} delay={Math.min(i * 40, 200)}>
                  <ProductCard product={product} />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Marketplace — premium seller presence */}
      <section className="section-padding relative overflow-hidden bg-ink-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(176,141,91,0.18),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(155,27,107,0.12),transparent_45%)]" />
        <div className="container-premium relative">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
                Official seller stores
              </p>
              <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">
                Shop Shivbless on Meesho & Flipkart
              </h2>
              <p className="mt-3 text-ink-300">
                Hamari products in trusted marketplaces pe available hain — click
                karke poori shop / listing dekho.
              </p>
            </div>
          </FadeIn>

          <div className="mx-auto mt-12 grid max-w-4xl gap-5 lg:grid-cols-2">
            {/* Meesho full shop card */}
            <a
              {...externalLinkProps(siteConfig.meeshoStoreUrl)}
              className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-[#9B1B6B] to-[#6B1048] p-8 text-white shadow-elevated transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(155,27,107,0.35)]"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl transition group-hover:bg-white/20" />
              <div className="relative">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold tracking-wide backdrop-blur">
                  M
                </div>
                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                  Meesho Official Shop
                </p>
                <h3 className="mt-2 font-display text-3xl text-white">
                  Shivbless Enterprise
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">
                  Puri Meesho shop dekho — saari listings, prices aur offers ek
                  jagah. Click karke directly hamari Meesho store open hogi.
                </p>
                <span className="mt-8 inline-flex h-12 items-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-[#9B1B6B] transition group-hover:bg-brand-50">
                  View Full Meesho Shop
                  <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </a>

            {/* Flipkart card */}
            <a
              {...externalLinkProps(siteConfig.flipkartStoreUrl)}
              className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-[#2874F0] to-[#1A4FB8] p-8 text-white shadow-elevated transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(40,116,240,0.35)]"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl transition group-hover:bg-white/20" />
              <div className="relative">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold tracking-wide backdrop-blur">
                  Fk
                </div>
                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                  Flipkart Listing
                </p>
                <h3 className="mt-2 font-display text-3xl text-white">
                  Buy on Flipkart
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">
                  Flipkart pe Shivbless products dekho — secure checkout,
                  delivery aur returns Flipkart handle karta hai.
                </p>
                <span className="mt-8 inline-flex h-12 items-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-[#2874F0] transition group-hover:bg-blue-50">
                  View on Flipkart
                  <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </a>
          </div>

          <p className="mt-8 text-center text-xs text-ink-400">
            Payment, shipping aur returns marketplace policies ke according
            apply hote hain.
          </p>
        </div>
      </section>

      <section className="border-t border-ink-100 bg-ink-950 py-16 text-center">
        <div className="container-premium">
          <h2 className="font-display text-3xl text-white sm:text-4xl">
            Ready to explore?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-ink-300">
            Discover Shivbless products and buy through Meesho or Flipkart.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink
              href="/shop"
              size="lg"
              className="bg-brand-500 text-white hover:bg-brand-600"
            >
              Browse Products
            </ButtonLink>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-2xl border border-ink-700 px-7 text-sm font-medium text-white transition hover:border-brand-400"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
