import WishlistClient from "./WishlistClient";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Wishlist",
  description: "Your saved Shivbless Enterprise products.",
  path: "/wishlist",
  noIndex: true,
});

export default function WishlistPage() {
  return <WishlistClient />;
}
