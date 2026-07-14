import Image from "next/image";
import { FadeIn } from "@/components/ui/FadeIn";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { externalLinkProps } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "Learn about Shivbless Enterprise — making useful, quality products easier to discover on Meesho and Flipkart.",
  path: "/about",
});

const journey = [
  {
    step: "01",
    title: "Browse with calm",
    text: "Explore a curated catalogue — clear photos, honest details, no clutter.",
  },
  {
    step: "02",
    title: "Choose your marketplace",
    text: "Open the listing on Meesho or Flipkart — platforms you already trust.",
  },
  {
    step: "03",
    title: "Buy with confidence",
    text: "Payments, delivery, and returns stay with the marketplace you choose.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero — one composition, brand first */}
      <section className="relative min-h-[88vh] overflow-hidden bg-ink-950 text-white">
        <Image
          src="/uploads/products/meesho-1783915611083-3.webp"
          alt=""
          fill
          priority
          unoptimized
          className="object-cover object-center opacity-50 scale-105 animate-fade-in"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/75 to-ink-950/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-ink-950/40" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(196,165,116,0.16),transparent_50%)]" />

        <div className="container-premium relative flex min-h-[88vh] flex-col justify-end pb-16 pt-28 lg:justify-center lg:pb-24 lg:pt-20">
          <FadeIn>
            <p className="font-display text-3xl tracking-tight text-brand-300 sm:text-4xl lg:text-5xl">
              {siteConfig.name}
            </p>
            <h1 className="mt-5 max-w-2xl font-display text-4xl leading-[1.08] text-white text-balance sm:text-5xl lg:text-6xl">
              Quality, made easier to find.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
              A calm catalogue for everyday rituals — browse here, buy securely
              on Meesho or Flipkart.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink
                href="/shop"
                size="lg"
                className="bg-brand-500 text-white hover:bg-brand-600"
              >
                Explore the catalogue
              </ButtonLink>
              <ButtonLink
                href="/contact"
                size="lg"
                variant="outline"
                className="border-white/25 bg-white/5 text-white hover:bg-white/10"
              >
                Bulk inquiry
              </ButtonLink>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Story — editorial, one job */}
      <section className="relative overflow-hidden bg-surface-muted">
        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="container-premium grid items-center gap-12 py-20 lg:grid-cols-12 lg:gap-16 lg:py-28">
          <FadeIn className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
              <Image
                src="/uploads/products/meesho-1783915610504-0.webp"
                alt="Shivbless Enterprise product"
                fill
                unoptimized
                className="object-cover transition duration-700 hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
              <p className="absolute bottom-6 left-6 right-6 font-display text-2xl text-white">
                Crafted for everyday devotion.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={100} className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">
              Our story
            </p>
            <h2 className="mt-4 font-display text-3xl text-ink-900 sm:text-4xl lg:text-5xl text-balance">
              Built for shoppers who want clarity, not chaos.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
              Shivbless Enterprise began with a simple belief: discovering good
              products should feel calm and trustworthy. We bring carefully
              selected essentials into one premium catalogue — then guide you to
              Meesho and Flipkart for secure checkout.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-500">
              No pressure. No fake urgency. Just a clear path from interest to
              purchase on platforms Indian families already use every day.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Journey — numbered, not cards */}
      <section className="border-y border-ink-100 bg-white">
        <div className="container-premium py-20 lg:py-28">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">
              How it works
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl text-ink-900 sm:text-4xl">
              From browse to buy — three quiet steps.
            </h2>
          </FadeIn>

          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-0">
            {journey.map((item, i) => (
              <FadeIn
                key={item.step}
                delay={i * 90}
                className={
                  i > 0
                    ? "md:border-l md:border-ink-100 md:pl-10"
                    : "md:pr-10"
                }
              >
                <p className="font-display text-5xl text-brand-300 transition duration-500 hover:text-brand-500">
                  {item.step}
                </p>
                <h3 className="mt-4 font-display text-2xl text-ink-900">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-500">
                  {item.text}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Promise — pull quote atmosphere */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(176,141,91,0.14),transparent_55%)]" />
        <div className="container-premium relative py-20 lg:py-28">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">
              Our promise
            </p>
            <blockquote className="mt-6 max-w-3xl font-display text-3xl leading-snug text-white sm:text-4xl lg:text-5xl text-balance">
              “Useful products. Honest presentation. Secure shopping on the
              marketplace you trust.”
            </blockquote>
            <p className="mt-8 max-w-xl text-ink-300 leading-relaxed">
              We showcase what we sell — pooja essentials and everyday pieces —
              with clarity. You leave this site only when you are ready to
              complete purchase on Meesho or Flipkart.
            </p>
          </FadeIn>

          <FadeIn delay={120}>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:max-w-3xl">
              {[
                "Curated catalogue, not endless noise",
                "Direct links to authentic marketplace listings",
                "Transparent pricing context before you leave",
                "No checkout friction on this website",
              ].map((line) => (
                <li
                  key={line}
                  className="border-l border-brand-400/50 pl-4 text-sm text-ink-200"
                >
                  {line}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-surface-warm">
        <div className="container-premium py-20 text-center lg:py-24">
          <FadeIn>
            <p className="font-display text-2xl text-brand-700 sm:text-3xl">
              {siteConfig.name}
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl text-ink-900 sm:text-4xl">
              Ready to explore the collection?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-ink-500">
              Browse products here, then shop securely through Meesho or
              Flipkart.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/shop" size="lg">
                Browse products
              </ButtonLink>
              <a
                {...externalLinkProps(siteConfig.meeshoStoreUrl)}
                className="inline-flex h-12 items-center rounded-2xl border border-ink-200 bg-white px-7 text-sm font-medium text-ink-900 transition hover:border-brand-400 hover:bg-brand-50"
              >
                Visit Meesho shop
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
