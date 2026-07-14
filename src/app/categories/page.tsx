import Image from "next/image";
import Link from "next/link";
import { getCategoriesWithCounts } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/ui/FadeIn";

export const metadata = buildMetadata({
  title: "Categories",
  description:
    "Explore Shivbless Enterprise product categories — Home & Kitchen, Storage, Fashion, Beauty, Daily Essentials and more.",
  path: "/categories",
});

export default function CategoriesPage() {
  const categories = getCategoriesWithCounts().filter((c) => c.productCount > 0);

  return (
    <div className="container-premium py-12 lg:py-16">
      <FadeIn>
        <h1 className="font-display text-3xl text-ink-900 sm:text-4xl">
          Categories
        </h1>
        <p className="mt-3 max-w-2xl text-ink-500">
          Browse curated collections designed for everyday Indian shopping.
        </p>
      </FadeIn>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => (
          <FadeIn key={cat.id} delay={i * 50}>
            <Link
              href={`/categories/${cat.slug}`}
              className="group block overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-card focus-ring"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h2 className="font-display text-xl text-ink-900">{cat.name}</h2>
                <p className="mt-1 text-sm text-ink-500">{cat.description}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-brand-600">
                  {cat.productCount} products
                </p>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
