import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: `Privacy Policy for ${siteConfig.name}.`,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <article className="container-premium prose prose-neutral max-w-3xl py-12 lg:py-16">
      <h1>Privacy Policy</h1>
      <p className="lead text-ink-500">Last updated: July 2026</p>

      <p>
        {siteConfig.name} (&ldquo;we&rdquo;, &ldquo;our&rdquo;) operates this
        product catalogue website. We respect your privacy and are committed to
        protecting personal information you choose to share with us.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>Contact form submissions (name, mobile, email, message)</li>
        <li>Optional email for product update notifications</li>
        <li>Wishlist preferences stored locally on your device</li>
        <li>Standard analytics/technical data if analytics tools are added later</li>
      </ul>

      <h2>How we use information</h2>
      <p>
        We use contact details only to respond to enquiries or send product
        updates you requested. We do not sell personal data.
      </p>

      <h2>Payments and orders</h2>
      <p>
        {siteConfig.name} does not process payments or collect payment card
        information. All purchases are completed on third-party marketplaces
        (Meesho, Flipkart), which have their own privacy policies.
      </p>

      <h2>Local storage</h2>
      <p>
        Wishlist and admin demo data may be stored in your browser&apos;s local
        storage. Clearing site data removes this information.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy questions, email{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>
    </article>
  );
}
