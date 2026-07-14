import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { FadeIn } from "@/components/ui/FadeIn";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-ink-100 bg-surface-warm">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(176,141,91,0.08),_transparent_50%)]" />
      <div className="container-premium relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
            Shivbless Enterprise
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.1] text-ink-900 text-balance sm:text-5xl lg:text-[3.5rem]">
            Everyday Products, Carefully Selected.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-600 sm:text-lg">
            Explore quality products from Shivbless Enterprise and shop securely
            through Meesho and Flipkart.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/shop" size="lg">
              Shop Products
            </ButtonLink>
            <ButtonLink href="/shop?sort=popular" variant="outline" size="lg">
              View Best Sellers
            </ButtonLink>
          </div>
        </FadeIn>

        <FadeIn delay={150} className="relative">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] shadow-elevated lg:max-w-none">
            <Image
              src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1200&q=85"
              alt="Curated home and lifestyle products from Shivbless Enterprise"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/30 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-4 -left-2 hidden max-w-[200px] rounded-2xl border border-ink-100 bg-white p-4 shadow-card sm:block lg:-left-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              Shop securely
            </p>
            <p className="mt-1 text-sm text-ink-700">
              Checkout on Meesho & Flipkart
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
