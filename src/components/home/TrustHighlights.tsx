import { Compass, ShieldCheck, Sparkles, Store } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

const items = [
  {
    icon: Sparkles,
    title: "Quality Products",
    text: "Carefully selected essentials for everyday Indian homes.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Marketplace Shopping",
    text: "Complete purchases on trusted platforms you already know.",
  },
  {
    icon: Compass,
    title: "Easy Product Discovery",
    text: "Browse a clean catalogue without marketplace clutter.",
  },
  {
    icon: Store,
    title: "Available on Meesho & Flipkart",
    text: "Choose your preferred marketplace for every product.",
  },
];

export function TrustHighlights() {
  return (
    <section className="section-padding border-b border-ink-100 bg-white">
      <div className="container-premium grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <FadeIn key={item.title} delay={i * 80}>
            <div className="h-full rounded-2xl border border-ink-100 bg-surface-muted p-6 transition hover:border-brand-200 hover:shadow-soft">
              <item.icon className="h-6 w-6 text-brand-600" strokeWidth={1.5} />
              <h3 className="mt-4 font-display text-lg text-ink-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                {item.text}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
