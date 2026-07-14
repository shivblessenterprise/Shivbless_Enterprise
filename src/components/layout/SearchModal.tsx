"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { searchSuggestions } from "@/lib/products";
import { useProducts } from "@/hooks/useProducts";
import { formatPrice } from "@/lib/utils";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 200);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { products } = useProducts();

  const suggestions = searchSuggestions(debounced, products);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Search products">
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm"
        aria-label="Close search"
        onClick={onClose}
      />
      <div className="relative mx-auto mt-16 w-full max-w-2xl px-4 animate-fade-up">
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-elevated">
          <form onSubmit={submit} className="flex items-center gap-3 border-b border-ink-100 px-4">
            <Search className="h-5 w-5 shrink-0 text-ink-400" aria-hidden />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, categories, tags…"
              className="h-14 w-full bg-transparent text-base text-ink-900 placeholder:text-ink-400 focus:outline-none"
              aria-label="Search products"
            />
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-ink-400 hover:bg-ink-50 hover:text-ink-700 focus-ring"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </form>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {!debounced.trim() && (
              <div className="px-4 py-10 text-center">
                <p className="font-display text-lg text-ink-900">Find your next essential</p>
                <p className="mt-2 text-sm text-ink-500">
                  Try searching by product name, category, marketplace, or tags.
                </p>
              </div>
            )}

            {debounced.trim() && suggestions.length === 0 && (
              <div className="px-4 py-10 text-center">
                <p className="font-display text-lg text-ink-900">No products found</p>
                <p className="mt-2 text-sm text-ink-500">
                  We couldn&apos;t find matches for &ldquo;{debounced}&rdquo;. Try a different keyword.
                </p>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="mt-4 inline-flex text-sm font-medium text-brand-700 hover:underline"
                >
                  Browse all products
                </Link>
              </div>
            )}

            {suggestions.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-surface-warm focus-ring"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-warm">
                  <Image
                    src={product.images[0]}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink-900">{product.title}</p>
                  <p className="text-sm text-ink-500">{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))}

            {suggestions.length > 0 && (
              <button
                type="submit"
                onClick={submit}
                className="mt-1 w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-brand-700 hover:bg-brand-50 focus-ring"
              >
                View all results for &ldquo;{debounced}&rdquo;
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
