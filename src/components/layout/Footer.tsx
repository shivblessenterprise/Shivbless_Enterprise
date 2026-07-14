import Link from "next/link";
import { Facebook, Instagram, Mail } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { siteConfig } from "@/lib/site";
import { externalLinkProps } from "@/lib/utils";
import { getCategoriesWithCounts } from "@/lib/products";

const quickLinks = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?filter=new", label: "New Arrivals" },
  { href: "/shop?sort=popular", label: "Best Sellers" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function Footer() {
  const categories = getCategoriesWithCounts().filter((c) => c.productCount > 0);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-100 bg-ink-950 text-ink-200">
      <div className="container-premium section-padding !pb-12 !pt-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="[&_span]:!text-white [&_.text-ink-500]:!text-ink-400 [&_.bg-ink-900]:!bg-brand-500 [&_.text-brand-300]:!text-white">
              <Logo />
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-400">
              Shivbless Enterprise makes quality product discovery simple.
              Browse carefully selected essentials and complete your purchase
              securely on Meesho or Flipkart.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {siteConfig.social.instagram && (
                <a
                  {...externalLinkProps(siteConfig.social.instagram)}
                  aria-label="Instagram"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-800 text-ink-300 transition hover:border-brand-500 hover:text-brand-300 focus-ring"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {siteConfig.social.facebook && (
                <a
                  {...externalLinkProps(siteConfig.social.facebook)}
                  aria-label="Facebook"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-800 text-ink-300 transition hover:border-brand-500 hover:text-brand-300 focus-ring"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-base text-white">Quick Links</h3>
              <ul className="mt-4 space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-400 transition hover:text-brand-300 focus-ring rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-base text-white">Categories</h3>
              <ul className="mt-4 space-y-2.5">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="text-sm text-ink-400 transition hover:text-brand-300 focus-ring rounded"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-display text-base text-white">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2 text-ink-400 transition hover:text-brand-300 focus-ring rounded"
                >
                  <Mail className="h-4 w-4" />
                  {siteConfig.email}
                </a>
              </li>
            </ul>

            <div className="mt-6 space-y-2">
              <a
                {...externalLinkProps(siteConfig.meeshoStoreUrl)}
                className="block text-sm text-ink-400 transition hover:text-brand-300"
              >
                Meesho Store ↗
              </a>
              <a
                {...externalLinkProps(siteConfig.flipkartStoreUrl)}
                className="block text-sm text-ink-400 transition hover:text-brand-300"
              >
                Flipkart Store ↗
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 rounded-2xl border border-ink-800 bg-ink-900/60 p-5 text-xs leading-relaxed text-ink-500">
          <p>
            Shivbless Enterprise showcases products available on third-party
            marketplaces. Product prices, availability, shipping, return
            policies and payments are managed by the respective marketplace.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-ink-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-500">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-4">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs text-ink-500 transition hover:text-brand-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
