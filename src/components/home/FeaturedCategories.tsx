import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { getCategoriesWithCounts } from "@/lib/products";

export function FeaturedCategories() {
  const categories = getCategoriesWithCounts();

  return (
    <section className="section-padding">
      <div className="container-premium">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
              Collections
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink-900 sm:text-4xl">
              Featured Categories
            </h2>
            <p className="mt-3 text-ink-500">
              Explore thoughtfully organised collections for home, style, and daily living.
            </p>
          </div>
        </FadeIn>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <FadeIn key={cat.id} delay={i * 60}>
              <Link
                href={`/categories/${cat.slug}`}
                className="group relative block overflow-hidden rounded-2xl focus-ring"
              >
                <div className="relative aspect-[5/4]">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/75 via-ink-950/25 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl">{cat.name}</h3>
                      <p className="mt-1 text-sm text-white/75">
                        {cat.productCount} products
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur transition group-hover:bg-white/25">
                      View
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
