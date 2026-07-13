"use client";

import { useState } from "react";
import { MessageCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { siteConfig } from "@/lib/site";
import { externalLinkProps, getWhatsAppLink } from "@/lib/utils";

export function UpdatesCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Demo-only: no backend. Replace with email service later.
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="section-padding">
      <div className="container-premium">
        <FadeIn>
          <div className="overflow-hidden rounded-[2rem] border border-ink-100 bg-ink-900 px-6 py-12 text-center shadow-elevated sm:px-12 sm:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
              Stay in the loop
            </p>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">
              Get New Product Updates
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-300">
              Stay updated when Shivbless Enterprise adds new products and
              marketplace offers.
            </p>

            <form
              onSubmit={onSubmit}
              className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="updates-email" className="sr-only">
                Email address
              </label>
              <input
                id="updates-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-12 flex-1 rounded-xl border border-ink-700 bg-ink-800 px-4 text-sm text-white placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
              />
              <Button type="submit" variant="secondary" size="lg" className="sm:shrink-0">
                Notify Me
              </Button>
            </form>

            {submitted && (
              <p className="mt-3 text-sm text-brand-300" role="status">
                Thanks — we&apos;ll keep you posted on new arrivals.
              </p>
            )}

            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                {...externalLinkProps(
                  getWhatsAppLink(
                    siteConfig.whatsapp,
                    "Hi! I'd like product updates from Shivbless Enterprise."
                  )
                )}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-ink-700 px-5 text-sm font-medium text-white transition hover:border-brand-400 hover:bg-ink-800 focus-ring"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Updates
              </a>
              <p className="inline-flex items-center gap-1.5 text-xs text-ink-400">
                <Shield className="h-3.5 w-3.5" />
                We respect your privacy. No spam.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
