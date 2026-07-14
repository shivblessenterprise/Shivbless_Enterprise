"use client";

import Link from "next/link";
import { Heart, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Logo } from "@/components/layout/Logo";
import { SearchModal } from "@/components/layout/SearchModal";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { count } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <header
          className={cn(
            "border-b border-transparent bg-surface-muted/90 backdrop-blur-md transition-all duration-300",
            scrolled && "border-ink-100/80 bg-white/95 shadow-header"
          )}
        >
          <div className="container-premium flex h-16 items-center justify-between gap-4 lg:h-[72px]">
            <Logo compact />

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
              {NAV_LINKS.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href.split("?")[0]);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-ring",
                      active
                        ? "text-ink-900"
                        : "text-ink-500 hover:text-ink-900"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink-700 transition hover:bg-ink-100 focus-ring"
                aria-label="Search products"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link
                href="/wishlist"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink-700 transition hover:bg-ink-100 focus-ring"
                aria-label={`Wishlist${count ? `, ${count} items` : ""}`}
              >
                <Heart className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </Link>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink-700 transition hover:bg-ink-100 focus-ring lg:hidden"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-ink-950/40 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-white shadow-elevated transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-ink-100 px-4">
            <Logo compact />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl p-2 text-ink-600 hover:bg-ink-50 focus-ring"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-4" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-3 text-base font-medium text-ink-800 transition hover:bg-surface-warm focus-ring"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
