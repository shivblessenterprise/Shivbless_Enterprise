import { notFound } from "next/navigation";
import Image from "next/image";
import { ProductCard } from "@/components/product/ProductCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import {
  getCategoryBySlug,
  getCategoriesWithCounts,
  getSeedProducts,
} from "@/lib/products";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { categories } from "@/data/categories";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return buildMetadata({
    title: category.name,
    description: category.description,
    path: `/categories/${category.slug}`,
    image: category.image,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const products = getSeedProducts().filter((p) => p.category === slug);
  const withCount = getCategoriesWithCounts().find((c) => c.slug === slug)!;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Categories", path: "/categories" },
              { name: category.name, path: `/categories/${category.slug}` },
            ])
          ),
        }}
      />
      <div className="relative border-b border-ink-100">
        <div className="relative h-48 overflow-hidden sm:h-64">
          <Image
            src={category.image}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ink-950/50" />
          <div className="container-premium relative flex h-full flex-col justify-end pb-8">
            <h1 className="font-display text-3xl text-white sm:text-4xl">
              {category.name}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/80">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      <div className="container-premium py-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/categories" },
            { label: category.name },
          ]}
        />
        <p className="mb-8 text-ink-500">
          {withCount.productCount} product
          {withCount.productCount === 1 ? "" : "s"}
        </p>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-200 py-16 text-center">
            <p className="font-display text-xl text-ink-900">
              No products in this category yet
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
