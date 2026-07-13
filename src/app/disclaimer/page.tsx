import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Disclaimer",
  description: `Marketplace and product disclaimers for ${siteConfig.name}.`,
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <article className="container-premium prose prose-neutral max-w-3xl py-12 lg:py-16">
      <h1>Disclaimer</h1>
      <p className="lead text-ink-500">Last updated: July 2026</p>

      <h2>External marketplace disclaimer</h2>
      <p>
        {siteConfig.name} showcases products available on third-party
        marketplaces. Product prices, availability, shipping, return policies
        and payments are managed by the respective marketplace.
      </p>

      <h2>Price change disclaimer</h2>
      <p>
        Prices displayed on this website are indicative and may differ from the
        live price on Meesho or Flipkart at the time of purchase.
      </p>

      <h2>Product availability disclaimer</h2>
      <p>
        Stock status depends on the marketplace. A product shown here may become
        unavailable or change after you are redirected.
      </p>

      <h2>Orders and payments</h2>
      <p>
        Orders are completed on third-party platforms. Marketplace policies
        apply after redirection. {siteConfig.name} does not directly collect
        customer payment information.
      </p>

      <h2>Affiliate disclosure</h2>
      <p>
        Where applicable, marketplace links may be standard store or product
        URLs. If affiliate tracking is introduced in the future, this page will
        be updated to disclose that relationship clearly.
      </p>

      <h2>Support</h2>
      <p>
        For order, delivery, payment, or return support, contact the marketplace
        where you completed the purchase.
      </p>
    </article>
  );
}
