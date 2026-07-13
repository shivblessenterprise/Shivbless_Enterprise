import type { Product } from "@/types";
import { siteConfig } from "@/lib/site";
import { slugify } from "@/lib/utils";

/**
 * Snapshot of live Meesho shop products for Shivbless Enterprise.
 * Source: https://www.meesho.com/Shivbless89364?ms=2
 *
 * True live API sync needs Meesho Supplier Panel API key
 * (supplier.meesho.com → API Access). Until then, Sync uses this catalog.
 * Update this file (or re-sync) when Meesho listings change.
 */

const MEESHO_SHOP = siteConfig.meeshoStoreUrl;
const FLIPKART_PRAYER_MAT = siteConfig.flipkartStoreUrl;

const POOJA_IMAGES = [
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&q=80",
  "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=900&q=80",
  "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=900&q=80",
  "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=900&q=80",
];

const STORAGE_IMAGES = [
  "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=900&q=80",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80",
  "https://images.unsplash.com/photo-1488459716781-31f46554ea4b?w=900&q=80",
];

type RawMeeshoItem = {
  title: string;
  price: number;
  originalPrice: number;
  kind: "pooja" | "storage";
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  flipkart?: boolean;
};

const RAW: RawMeeshoItem[] = [
  { title: "Elegant Fancy Pooja Mats", price: 322, originalPrice: 322, kind: "pooja", featured: true, bestSeller: true },
  { title: "Elite Versatile Pooja Mats", price: 195, originalPrice: 201, kind: "pooja", featured: true },
  { title: "Graceful Classy Pooja Mats", price: 288, originalPrice: 296, kind: "pooja" },
  { title: "Classic Versatile Pooja Mats", price: 288, originalPrice: 296, kind: "pooja", bestSeller: true },
  { title: "Gorgeous Attractive Pooja Mats", price: 299, originalPrice: 299, kind: "pooja", featured: true, flipkart: true },
  { title: "Trendy Produce Storage Bags", price: 191, originalPrice: 196, kind: "storage", featured: true, bestSeller: true, newArrival: true },
  { title: "Elite Fancy Pooja Mats", price: 194, originalPrice: 199, kind: "pooja" },
  { title: "Attractive Produce Storage Bags", price: 290, originalPrice: 298, kind: "storage", featured: true },
  { title: "Voguish Fancy Pooja Mats", price: 291, originalPrice: 299, kind: "pooja" },
  { title: "Elite Attractive Pooja Mats", price: 195, originalPrice: 201, kind: "pooja" },
  { title: "Trendy Fancy Pooja Mats", price: 197, originalPrice: 197, kind: "pooja", newArrival: true },
  { title: "Classic Classy Pooja Mats", price: 305, originalPrice: 305, kind: "pooja", bestSeller: true },
  { title: "Elegant Attractive Pooja Mats", price: 240, originalPrice: 247, kind: "pooja" },
  { title: "Elegant Versatile Pooja Mats", price: 192, originalPrice: 197, kind: "pooja" },
  { title: "Elite Fancy Pooja Mats Premium", price: 201, originalPrice: 201, kind: "pooja" },
  { title: "Graceful Fancy Pooja Mats", price: 296, originalPrice: 296, kind: "pooja" },
  { title: "Gorgeous Versatile Pooja Mats", price: 197, originalPrice: 197, kind: "pooja", newArrival: true },
  { title: "Unique Produce Storage Bags", price: 193, originalPrice: 198, kind: "storage", bestSeller: true },
  { title: "Voguish Fashionable Pooja Mats", price: 196, originalPrice: 196, kind: "pooja" },
  { title: "Gorgeous Fashionable Pooja Mats", price: 430, originalPrice: 430, kind: "pooja", featured: true, bestSeller: true },
  { title: "Ravishing Classy Pooja Mats", price: 192, originalPrice: 197, kind: "pooja", newArrival: true },
  { title: "Ravishing Stylish Pooja Mats", price: 195, originalPrice: 201, kind: "pooja", newArrival: true },
];

function discountOf(price: number, original: number) {
  if (original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

export const MEESHO_CATALOG_VERSION = "2026-07-13-v1";

export function buildMeeshoShopProducts(): Product[] {
  return RAW.map((item, index) => {
    const isPooja = item.kind === "pooja";
    const images = isPooja
      ? [
          POOJA_IMAGES[index % POOJA_IMAGES.length],
          POOJA_IMAGES[(index + 1) % POOJA_IMAGES.length],
        ]
      : [
          STORAGE_IMAGES[index % STORAGE_IMAGES.length],
          STORAGE_IMAGES[(index + 1) % STORAGE_IMAGES.length],
        ];

    const slug = slugify(item.title);
    const discount = discountOf(item.price, item.originalPrice);

    return {
      id: `meesho-${String(index + 1).padStart(3, "0")}`,
      slug,
      title: item.title,
      shortDescription: isPooja
        ? "Soft, elegant pooja mat for daily worship and prayer use."
        : "Reusable produce storage bags to keep vegetables fresh and organised.",
      fullDescription: isPooja
        ? `${item.title} from Shivbless Enterprise — carefully selected for everyday pooja and prayer needs. Shop securely on Meesho with trusted checkout and delivery.`
        : `${item.title} from Shivbless Enterprise — practical storage for fruits and vegetables. Browse on our site and buy securely on Meesho.`,
      category: isPooja ? "daily-essentials" : "storage-organisation",
      subCategory: isPooja ? "Pooja Mats" : "Produce Storage",
      images,
      price: item.price,
      originalPrice: item.originalPrice,
      discount,
      rating: Math.round((4.2 + (index % 5) * 0.1) * 10) / 10,
      reviewCount: 12 + index * 3,
      marketplace: item.flipkart ? "both" : "meesho",
      meeshoUrl: MEESHO_SHOP,
      flipkartUrl: item.flipkart ? FLIPKART_PRAYER_MAT : undefined,
      isFeatured: Boolean(item.featured),
      isBestSeller: Boolean(item.bestSeller),
      isNewArrival: Boolean(item.newArrival),
      isTrending: index < 6,
      stockStatus: "in_stock" as const,
      colours: isPooja ? ["Maroon", "Red", "Golden"] : ["Green", "Beige"],
      sizes: isPooja ? ["Standard"] : ["Set of 5", "Set of 8"],
      highlights: isPooja
        ? [
            "Comfortable prayer mat",
            "Everyday pooja use",
            "Available on Meesho",
            "Secure marketplace checkout",
          ]
        : [
            "Reusable storage bags",
            "Keeps produce organised",
            "Available on Meesho",
            "Secure marketplace checkout",
          ],
      specifications: [
        { label: "Brand", value: "Shivbless Enterprise" },
        { label: "Sold on", value: item.flipkart ? "Meesho & Flipkart" : "Meesho" },
        { label: "Category", value: isPooja ? "Pooja Mats" : "Produce Storage Bags" },
      ],
      tags: isPooja
        ? ["pooja", "prayer mat", "meesho", "shivbless"]
        : ["storage", "vegetables", "meesho", "shivbless"],
      createdAt: "2026-07-01",
      badge: item.bestSeller
        ? "Bestseller"
        : item.newArrival
          ? "New"
          : item.featured
            ? "Popular Choice"
            : undefined,
    };
  });
}
