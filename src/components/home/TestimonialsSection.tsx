import { Star } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { testimonials } from "@/data/products";

export function TestimonialsSection() {
  return (
    <section className="section-padding border-y border-ink-100 bg-white">
      <div className="container-premium">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
              Customer experience
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink-900 sm:text-4xl">
              What Shoppers Are Saying
            </h2>
            <p className="mt-2 text-xs text-ink-400">
              {/* PLACEHOLDER: Replace testimonials in src/data/products.ts */}
              Sample testimonials for demonstration — replace with real reviews.
            </p>
          </div>
        </FadeIn>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeIn key={t.id} delay={i * 80}>
              <blockquote className="flex h-full flex-col rounded-2xl border border-ink-100 bg-surface-muted p-6 shadow-soft">
                <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-4 w-4 fill-brand-500 text-brand-500"
                    />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-700">
                  &ldquo;{t.text}&rdquo;
                </p>
                <footer className="mt-5 border-t border-ink-100 pt-4">
                  <cite className="not-italic">
                    <span className="font-medium text-ink-900">{t.name}</span>
                    <span className="mt-0.5 block text-xs text-ink-500">
                      {t.location}
                    </span>
                  </cite>
                </footer>
              </blockquote>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
