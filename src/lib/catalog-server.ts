import { readFile } from "fs/promises";
import path from "path";
import { getSeedProducts } from "@/lib/products";
import type { Product } from "@/types";

/** Server-side: load products from data/catalog.json, fallback to seed. */
export async function getCatalogProducts(): Promise<Product[]> {
  try {
    const file = path.join(process.cwd(), "data", "catalog.json");
    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw) as { products?: Product[] } | Product[];
    const list = Array.isArray(parsed) ? parsed : parsed.products;
    if (Array.isArray(list)) return list;
  } catch {
    // no catalog yet
  }
  return getSeedProducts();
}

export async function getCatalogProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const products = await getCatalogProducts();
  return products.find((p) => p.slug === slug);
}
