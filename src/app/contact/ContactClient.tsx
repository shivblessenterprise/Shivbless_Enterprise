"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    setSubmitted(false);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          product: data.get("product"),
          quantity: data.get("quantity"),
          city: data.get("city"),
          message: data.get("message"),
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Submit failed");
      }
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container-premium py-12 lg:py-16">
      <FadeIn>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
            Contact
          </p>
          <h1 className="mt-3 font-display text-3xl text-ink-900 sm:text-4xl">
            Bulk Inquiry
          </h1>
          <p className="mt-3 text-ink-500">
            Wholesale / bulk order ke liye details bhejein. Hum aapse jaldi
            contact karenge.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <form
          onSubmit={onSubmit}
          className="mx-auto mt-10 max-w-2xl rounded-2xl border border-ink-100 bg-white p-6 shadow-soft sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-ink-800">
                Name *
              </label>
              <input
                id="name"
                name="name"
                required
                className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-ink-800"
              >
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
              />
            </div>
            <div>
              <label
                htmlFor="product"
                className="text-sm font-medium text-ink-800"
              >
                Product name *
              </label>
              <input
                id="product"
                name="product"
                required
                placeholder="Example: Velvet Pooja Aasan"
                className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
              />
            </div>
            <div>
              <label
                htmlFor="quantity"
                className="text-sm font-medium text-ink-800"
              >
                Quantity *
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min={1}
                required
                placeholder="Example: 100"
                className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="city" className="text-sm font-medium text-ink-800">
                City / Area
              </label>
              <input
                id="city"
                name="city"
                placeholder="Your city"
                className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="text-sm font-medium text-ink-800"
              >
                Bulk inquiry details *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Product, quantity, delivery location, and any other requirements..."
                className="mt-1.5 w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="mt-6 w-full sm:w-auto"
            size="lg"
            disabled={sending}
          >
            {sending ? "Sending…" : "Submit Bulk Inquiry"}
          </Button>

          {submitted && (
            <p className="mt-4 text-sm text-brand-700" role="status">
              Thank you — aapki bulk inquiry Admin panel mein save ho gayi hai.
            </p>
          )}
          {error && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </form>
      </FadeIn>
    </div>
  );
}
