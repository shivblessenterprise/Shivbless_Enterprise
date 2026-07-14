import type { Product } from "@/types";

/**
 * Fallback seed for client/localStorage only.
 * Live catalogue comes from MongoDB via Admin (manual add).
 * Meesho is used only as buy/shop link — not for product sync.
 */
export const products: Product[] = [];

/** PLACEHOLDER testimonials — replace with real customer feedback */
export const testimonials = [
  {
    id: "t-1",
    name: "Ananya Sharma",
    location: "Ahmedabad",
    rating: 5,
    text: "Browsing products here was so easy. I found what I needed and checked out securely on Meesho within minutes.",
    isPlaceholder: true as const,
  },
  {
    id: "t-2",
    name: "Rahul Mehta",
    location: "Surat",
    rating: 5,
    text: "I love that I can compare options and then buy on Meesho. The catalogue feels curated, not cluttered.",
    isPlaceholder: true as const,
  },
  {
    id: "t-3",
    name: "Priya Patel",
    location: "Vadodara",
    rating: 4,
    text: "Clean website, clear marketplace links, and good product details. Exactly what I needed before purchasing.",
    isPlaceholder: true as const,
  },
];
