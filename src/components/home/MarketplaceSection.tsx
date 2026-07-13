import { ExternalLink } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { siteConfig } from "@/lib/site";
import { externalLinkProps } from "@/lib/utils";

export function MarketplaceSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-premium">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
              Trusted platforms
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink-900 sm:text-4xl text-balance">
              Shop Through Your Preferred Marketplace
            </h2>
            <p className="mt-3 text-ink-500">
              Every purchase is completed on Meesho or Flipkart with their secure checkout.
            </p>
          </div>
        </FadeIn>

        <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
          <FadeIn>
            <div className="flex h-full flex-col rounded-3xl border border-ink-100 bg-surface-muted p-8 shadow-soft">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#9B1B6B]/10 text-sm font-bold text-[#9B1B6B]">
                M
              </div>
              <h3 className="mt-5 font-display text-2xl text-ink-900">Meesho</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-500">
                Discover affordable everyday essentials with convenient delivery
                options across India. Shop Shivbless listings directly on Meesho.
              </p>
              <a
                {...externalLinkProps(siteConfig.meeshoStoreUrl)}
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#9B1B6B] px-5 text-sm font-medium text-white transition hover:bg-[#7E1557] focus-ring"
              >
                Explore Meesho Products
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={80}>
            <div className="flex h-full flex-col rounded-3xl border border-ink-100 bg-surface-muted p-8 shadow-soft">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2874F0]/10 text-sm font-bold text-[#2874F0]">
                Fk
              </div>
              <h3 className="mt-5 font-display text-2xl text-ink-900">Flipkart</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-500">
                Shop with Flipkart&apos;s trusted checkout, delivery network, and
                return policies. Find Shivbless products on Flipkart.
              </p>
              <a
                {...externalLinkProps(siteConfig.flipkartStoreUrl)}
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2874F0] px-5 text-sm font-medium text-white transition hover:bg-[#1A5DC8] focus-ring"
              >
                Explore Flipkart Products
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
