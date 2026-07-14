import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { FadeIn } from "@/components/ui/FadeIn";
import { getFeaturedProducts } from "@/lib/products";

export function FeaturedProducts() {
  const products = getFeaturedProducts().slice(0, 8);

  return (
    <section className="section-padding border-y border-ink-100 bg-white">
      <div className="container-premium">
        <FadeIn>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                Curated picks
              </p>
              <h2 className="mt-3 font-display text-3xl text-ink-900 sm:text-4xl">
                Featured Products
              </h2>
              <p className="mt-2 max-w-xl text-ink-500">
                Handpicked products ready to shop on Meesho and Flipkart.
              </p>
            </div>
            <ButtonLink href="/shop" variant="outline">
              View All
            </ButtonLink>
          </div>
        </FadeIn>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <FadeIn key={product.id} delay={i * 50}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
