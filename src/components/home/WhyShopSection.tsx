import { Check } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

const benefits = [
  "Selected useful products",
  "Simple product comparison",
  "Direct marketplace links",
  "Secure checkout through trusted platforms",
  "No complicated ordering process",
];

export function WhyShopSection() {
  return (
    <section className="section-padding border-y border-ink-100 bg-surface-warm">
      <div className="container-premium grid items-center gap-12 lg:grid-cols-2">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
            Why Shivbless
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink-900 sm:text-4xl text-balance">
            Why Shop Through Shivbless
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-600 sm:text-lg">
            We make online product discovery simple. Browse carefully selected
            products from Shivbless Enterprise and complete your purchase
            securely through trusted marketplaces like Meesho and Flipkart.
          </p>
        </FadeIn>

        <FadeIn delay={100}>
          <ul className="space-y-3 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft sm:p-8">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                <span className="text-ink-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
