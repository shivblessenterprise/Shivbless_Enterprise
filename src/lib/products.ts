import { categories } from "@/data/categories";
import { products as seedProducts } from "@/data/products";
import type {
  Category,
  Marketplace,
  Product,
  ProductFilters,
  SortOption,
} from "@/types";

const STORAGE_KEY = "shivbless_products_v3";
const SYNC_META_KEY = "shivbless_meesho_sync_meta";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getSeedProducts(): Product[] {
  return seedProducts;
}

export function loadProducts(): Product[] {
  if (!isBrowser()) return seedProducts;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return seedProducts;
    const parsed = JSON.parse(raw) as Product[];
    if (!Array.isArray(parsed)) return seedProducts;
    return parsed;
  } catch {
    return seedProducts;
  }
}

export function saveProducts(items: Product[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function applySyncedProducts(
  items: Product[],
  meta?: { version: string; source: string; syncedAt: string }
): Product[] {
  saveProducts(items);
  if (isBrowser() && meta) {
    localStorage.setItem(SYNC_META_KEY, JSON.stringify(meta));
  }
  return items;
}

export function getSyncMeta(): {
  version?: string;
  source?: string;
  syncedAt?: string;
} | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(SYNC_META_KEY);
    return raw ? (JSON.parse(raw) as { version?: string; source?: string; syncedAt?: string }) : null;
  } catch {
    return null;
  }
}

export function resetProducts(): Product[] {
  if (isBrowser()) localStorage.removeItem(STORAGE_KEY);
  return seedProducts;
}

export function getProductBySlug(
  slug: string,
  list?: Product[]
): Product | undefined {
  const items = list ?? (isBrowser() ? loadProducts() : seedProducts);
  return items.find((p) => p.slug === slug);
}

export function getProductById(
  id: string,
  list?: Product[]
): Product | undefined {
  const items = list ?? (isBrowser() ? loadProducts() : seedProducts);
  return items.find((p) => p.id === id);
}

export function getCategoriesWithCounts(
  list?: Product[],
  options?: { hideEmpty?: boolean }
): Category[] {
  const items = list ?? seedProducts;
  const mapped = categories.map((cat) => ({
    ...cat,
    productCount: items.filter((p) => p.category === cat.slug).length,
  }));
  if (options?.hideEmpty) {
    return mapped.filter((c) => c.productCount > 0);
  }
  return mapped;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategoriesWithCounts().find((c) => c.slug === slug);
}

export function getFeaturedProducts(list?: Product[]): Product[] {
  const items = list ?? seedProducts;
  return items.filter((p) => p.isFeatured);
}

export function getBestSellers(list?: Product[]): Product[] {
  const items = list ?? seedProducts;
  return items.filter((p) => p.isBestSeller);
}

export function getNewArrivals(list?: Product[]): Product[] {
  const items = list ?? seedProducts;
  return items
    .filter((p) => p.isNewArrival)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getRelatedProducts(
  product: Product,
  limit = 4,
  list?: Product[]
): Product[] {
  const items = list ?? seedProducts;
  return items
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category ||
          p.tags.some((t) => product.tags.includes(t)))
    )
    .slice(0, limit);
}

export function getPriceRange(list?: Product[]): { min: number; max: number } {
  const items = list ?? seedProducts;
  if (items.length === 0) return { min: 0, max: 5000 };
  const prices = items.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

function matchesMarketplace(
  product: Product,
  selected: Marketplace[]
): boolean {
  if (selected.length === 0) return true;
  return selected.some((m) => {
    if (m === "both") return product.marketplace === "both";
    if (product.marketplace === "both") return true;
    return product.marketplace === m;
  });
}

function sortProducts(items: Product[], sort: SortOption): Product[] {
  const sorted = [...items];
  switch (sort) {
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "popular":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case "featured":
    default:
      return sorted.sort((a, b) => {
        const score = (p: Product) =>
          (p.isFeatured ? 4 : 0) +
          (p.isBestSeller ? 3 : 0) +
          (p.isTrending ? 2 : 0) +
          (p.isNewArrival ? 1 : 0);
        return score(b) - score(a);
      });
  }
}

export function filterProducts(
  list: Product[],
  filters: Partial<ProductFilters>
): Product[] {
  let result = [...list];

  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.fullDescription.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.marketplace.toLowerCase().includes(q) ||
        (p.meeshoUrl && "meesho".includes(q)) ||
        (p.flipkartUrl && "flipkart".includes(q))
    );
  }

  if (filters.categories && filters.categories.length > 0) {
    result = result.filter((p) => filters.categories!.includes(p.category));
  }

  if (filters.marketplaces && filters.marketplaces.length > 0) {
    result = result.filter((p) =>
      matchesMarketplace(p, filters.marketplaces!)
    );
  }

  if (typeof filters.minPrice === "number") {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }

  if (typeof filters.maxPrice === "number") {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  if (typeof filters.minRating === "number" && filters.minRating > 0) {
    result = result.filter((p) => p.rating >= filters.minRating!);
  }

  if (filters.stockStatus && filters.stockStatus.length > 0) {
    result = result.filter((p) =>
      filters.stockStatus!.includes(p.stockStatus)
    );
  }

  return sortProducts(result, filters.sort ?? "featured");
}

export function searchSuggestions(
  query: string,
  list?: Product[],
  limit = 6
): Product[] {
  if (!query.trim()) return [];
  return filterProducts(list ?? seedProducts, {
    search: query,
    sort: "popular",
  }).slice(0, limit);
}

export function upsertProduct(product: Product): Product[] {
  const items = loadProducts();
  const index = items.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    items[index] = product;
  } else {
    items.unshift(product);
  }
  saveProducts(items);
  return items;
}

export function deleteProduct(id: string): Product[] {
  const items = loadProducts().filter((p) => p.id !== id);
  saveProducts(items);
  return items;
}
