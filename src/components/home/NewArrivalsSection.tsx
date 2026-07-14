import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { FadeIn } from "@/components/ui/FadeIn";
import { getNewArrivals } from "@/lib/products";

export function NewArrivalsSection() {
  const products = getNewArrivals().slice(0, 4);

  return (
    <section className="section-padding border-t border-ink-100">
      <div className="container-premium">
        <FadeIn>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                Just added
              </p>
              <h2 className="mt-3 font-display text-3xl text-ink-900 sm:text-4xl">
                New Arrivals
              </h2>
            </div>
            <ButtonLink href="/shop?filter=new" variant="outline">
              See What&apos;s New
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
