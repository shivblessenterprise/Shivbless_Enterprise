import { Suspense } from "react";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Shop",
  description:
    "Browse the Shivbless Enterprise product catalogue. Filter by category, marketplace, price and more — then shop on Meesho or Flipkart.",
  path: "/shop",
});

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="container-premium grid gap-5 py-14 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      }
    >
      <ShopCatalog />
    </Suspense>
  );
}
