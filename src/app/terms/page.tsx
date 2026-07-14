import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Terms and Conditions",
  description: `Terms and Conditions for ${siteConfig.name}.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <article className="container-premium prose prose-neutral max-w-3xl py-12 lg:py-16">
      <h1>Terms and Conditions</h1>
      <p className="lead text-ink-500">Last updated: July 2026</p>

      <p>
        By using the {siteConfig.name} website, you agree to these terms. This
        site is a product catalogue and showcase only.
      </p>

      <h2>Nature of the service</h2>
      <p>
        We display product information and redirect you to external marketplace
        listings on Meesho and/or Flipkart. We do not operate an on-site
        checkout, cart, or payment gateway.
      </p>

      <h2>Product information</h2>
      <p>
        Product titles, descriptions, images, prices, and availability are shown
        for discovery purposes. Marketplace listings may update at any time.
        Always verify final details on Meesho or Flipkart before purchasing.
      </p>

      <h2>External links</h2>
      <p>
        Links to Meesho, Flipkart, and social platforms open in a new tab.
        Those platforms&apos; terms and policies apply once you leave our site.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Website design, branding, and original content belong to{" "}
        {siteConfig.name} unless otherwise noted. Product images may be
        illustrative placeholders until replaced with official assets.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        We are not liable for marketplace order fulfilment, payment disputes,
        shipping delays, or return outcomes handled by third-party platforms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>
    </article>
  );
}
