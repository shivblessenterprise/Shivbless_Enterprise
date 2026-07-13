import {
  buildMeeshoShopProducts,
  MEESHO_CATALOG_VERSION,
} from "@/data/meesho-shop-catalog";
import { siteConfig } from "@/lib/site";
import type { Product } from "@/types";

export type MeeshoSyncResult = {
  ok: boolean;
  source: "meesho-supplier-api" | "shop-catalog-snapshot";
  version: string;
  shopUrl: string;
  count: number;
  products: Product[];
  message: string;
  syncedAt: string;
};

/**
 * Sync Meesho products for Shivbless shop.
 * Live Supplier API is used when MEESHO_SUPPLIER_API_KEY is set.
 * Otherwise returns the shop catalog snapshot (all 22 Meesho listings).
 */
export async function syncMeeshoProducts(): Promise<MeeshoSyncResult> {
  const apiKey = process.env.MEESHO_SUPPLIER_API_KEY;
  const syncedAt = new Date().toISOString();

  if (apiKey) {
    try {
      const live = await fetchFromSupplierApi(apiKey);
      if (live.length > 0) {
        return {
          ok: true,
          source: "meesho-supplier-api",
          version: MEESHO_CATALOG_VERSION,
          shopUrl: siteConfig.meeshoStoreUrl,
          count: live.length,
          products: live,
          message: `Live sync: ${live.length} products from Meesho Supplier API.`,
          syncedAt,
        };
      }
    } catch {
      // Fall through to snapshot
    }
  }

  const products = buildMeeshoShopProducts();
  return {
    ok: true,
    source: "shop-catalog-snapshot",
    version: MEESHO_CATALOG_VERSION,
    shopUrl: siteConfig.meeshoStoreUrl,
    count: products.length,
    products,
    message: apiKey
      ? "Supplier API returned no products — loaded shop catalog snapshot."
      : `Loaded ${products.length} products from your Meesho shop catalogue. Add MEESHO_SUPPLIER_API_KEY for live auto-sync.`,
    syncedAt,
  };
}

async function fetchFromSupplierApi(apiKey: string): Promise<Product[]> {
  const base = process.env.MEESHO_API_BASE || "https://api.meesho.io";
  const res = await fetch(`${base}/api/v1/catalog`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) return [];

  const data = (await res.json()) as {
    products?: Array<Record<string, unknown>>;
    data?: Array<Record<string, unknown>>;
    catalogs?: Array<Record<string, unknown>>;
  };

  const rows = data.products || data.data || data.catalogs || [];
  if (!Array.isArray(rows) || rows.length === 0) return [];

  return rows.map((row, index) => mapSupplierRow(row, index));
}

function mapSupplierRow(row: Record<string, unknown>, index: number): Product {
  const title = String(row.name || row.title || row.product_name || `Meesho Product ${index + 1}`);
  const price = Number(row.price || row.selling_price || 0);
  const originalPrice = Number(row.mrp || row.original_price || price);
  const image =
    String(
      row.image ||
        row.image_url ||
        (Array.isArray(row.images) ? row.images[0] : "") ||
        ""
    ) ||
    "https://images.unsplash.com/photo-1609602946980-4c921b23a0d5?w=900&q=80";
  const productUrl = String(row.url || row.product_url || siteConfig.meeshoStoreUrl);
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const discount =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  return {
    id: String(row.id || row.product_id || `meesho-live-${index + 1}`),
    slug: slug || `meesho-product-${index + 1}`,
    title,
    shortDescription: String(row.description || "Available on Meesho from Shivbless Enterprise."),
    fullDescription: String(
      row.description ||
        `${title} — shop securely on Meesho via Shivbless Enterprise.`
    ),
    category: "daily-essentials",
    subCategory: "Meesho",
    images: [image],
    price,
    originalPrice,
    discount,
    rating: Number(row.rating || 4.2),
    reviewCount: Number(row.rating_count || row.review_count || 0),
    marketplace: "meesho",
    meeshoUrl: productUrl,
    isFeatured: index < 8,
    isBestSeller: index < 5,
    isNewArrival: index < 4,
    isTrending: index < 6,
    stockStatus: "in_stock",
    colours: [],
    sizes: [],
    highlights: ["Synced from Meesho", "Secure marketplace checkout"],
    specifications: [
      { label: "Brand", value: "Shivbless Enterprise" },
      { label: "Sold on", value: "Meesho" },
    ],
    tags: ["meesho", "shivbless", "synced"],
    createdAt: new Date().toISOString().slice(0, 10),
    badge: index < 5 ? "Bestseller" : undefined,
  };
}
