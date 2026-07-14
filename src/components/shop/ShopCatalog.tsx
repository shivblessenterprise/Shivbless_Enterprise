"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, Grid3X3, List, X } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { useProducts } from "@/hooks/useProducts";
import {
  filterProducts,
  getCategoriesWithCounts,
  getPriceRange,
} from "@/lib/products";
import { cn, formatPrice } from "@/lib/utils";
import type { Marketplace, SortOption, StockStatus } from "@/types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Rated" },
  { value: "popular", label: "Most Popular" },
];

const PAGE_SIZE = 8;

export function ShopCatalog() {
  const searchParams = useSearchParams();
  const { products, isReady } = useProducts();
  const priceRange = useMemo(() => getPriceRange(products), [products]);
  const categories = useMemo(
    () => getCategoriesWithCounts(products).filter((c) => c.productCount > 0),
    [products]
  );

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category") ? [searchParams.get("category")!] : []
  );
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);
  const [minPrice, setMinPrice] = useState(priceRange.min);
  const [maxPrice, setMaxPrice] = useState(priceRange.max);
  const [minRating, setMinRating] = useState(0);
  const [stockStatus, setStockStatus] = useState<StockStatus[]>([]);
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "featured"
  );
  const [view, setView] = useState<"grid" | "list">("grid");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) setSearch(q);
    const cat = searchParams.get("category");
    if (cat) setSelectedCategories([cat]);
    const s = searchParams.get("sort") as SortOption | null;
    if (s) setSort(s);
    if (searchParams.get("filter") === "new") {
      setSort("newest");
    }
  }, [searchParams]);

  useEffect(() => {
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
  }, [priceRange.min, priceRange.max]);

  const filtered = useMemo(() => {
    let list = filterProducts(products, {
      search,
      categories: selectedCategories,
      marketplaces,
      minPrice,
      maxPrice,
      minRating,
      stockStatus,
      sort,
    });

    if (searchParams.get("filter") === "new") {
      list = list.filter((p) => p.isNewArrival);
    }
    if (searchParams.get("badge") === "bestseller") {
      list = list.filter((p) => p.isBestSeller);
    }

    return list;
  }, [
    products,
    search,
    selectedCategories,
    marketplaces,
    minPrice,
    maxPrice,
    minRating,
    stockStatus,
    sort,
    searchParams,
  ]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [filtered]);

  const shown = filtered.slice(0, visible);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const toggleMarketplace = (m: Marketplace) => {
    setMarketplaces((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const toggleStock = (s: StockStatus) => {
    setStockStatus((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setMarketplaces([]);
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
    setMinRating(0);
    setStockStatus([]);
    setSort("featured");
  };

  const FiltersPanel = (
    <div className="space-y-7">
      <div>
        <label htmlFor="shop-search" className="text-sm font-semibold text-ink-900">
          Search
        </label>
        <input
          id="shop-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="mt-2 h-11 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-ink-900">Categories</p>
        <ul className="mt-3 space-y-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-700">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.slug)}
                  onChange={() => toggleCategory(cat.slug)}
                  className="rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
                {cat.name}
                <span className="ml-auto text-xs text-ink-400">
                  {cat.productCount}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-sm font-semibold text-ink-900">Marketplace</p>
        <ul className="mt-3 space-y-2">
          {(
            [
              ["meesho", "Meesho"],
              ["flipkart", "Flipkart"],
              ["both", "Both platforms"],
            ] as const
          ).map(([value, label]) => (
            <li key={value}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-700">
                <input
                  type="checkbox"
                  checked={marketplaces.includes(value)}
                  onChange={() => toggleMarketplace(value)}
                  className="rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
                {label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-sm font-semibold text-ink-900">Price range</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <label className="sr-only" htmlFor="min-price">
              Min price
            </label>
            <input
              id="min-price"
              type="number"
              min={priceRange.min}
              max={maxPrice}
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="h-10 w-full rounded-xl border border-ink-200 px-3 text-sm"
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="max-price">
              Max price
            </label>
            <input
              id="max-price"
              type="number"
              min={minPrice}
              max={priceRange.max}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="h-10 w-full rounded-xl border border-ink-200 px-3 text-sm"
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-ink-400">
          {formatPrice(minPrice)} – {formatPrice(maxPrice)}
        </p>
      </div>

      <div>
        <p className="text-sm font-semibold text-ink-900">Minimum rating</p>
        <select
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          className="mt-2 h-11 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm"
          aria-label="Minimum rating"
        >
          <option value={0}>Any rating</option>
          <option value={4}>4★ & above</option>
          <option value={4.5}>4.5★ & above</option>
        </select>
      </div>

      <div>
        <p className="text-sm font-semibold text-ink-900">Availability</p>
        <ul className="mt-3 space-y-2">
          {(
            [
              ["in_stock", "In stock"],
              ["low_stock", "Low stock"],
              ["out_of_stock", "Out of stock"],
            ] as const
          ).map(([value, label]) => (
            <li key={value}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-700">
                <input
                  type="checkbox"
                  checked={stockStatus.includes(value)}
                  onChange={() => toggleStock(value)}
                  className="rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
                {label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Clear filters
      </Button>
    </div>
  );

  return (
    <div className="container-premium py-10 lg:py-14">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink-900 sm:text-4xl">Shop</h1>
        <p className="mt-2 text-ink-500">
          {isReady
            ? `${filtered.length} product${filtered.length === 1 ? "" : "s"}`
            : "Loading catalogue…"}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-28 rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
            {FiltersPanel}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setDrawerOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>

            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <label htmlFor="sort" className="sr-only">
                Sort products
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="h-10 rounded-xl border border-ink-200 bg-white px-3 text-sm"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <div className="flex rounded-xl border border-ink-200 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  aria-label="Grid view"
                  aria-pressed={view === "grid"}
                  className={cn(
                    "rounded-lg p-2 transition focus-ring",
                    view === "grid" ? "bg-ink-900 text-white" : "text-ink-500"
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  aria-label="List view"
                  aria-pressed={view === "list"}
                  className={cn(
                    "rounded-lg p-2 transition focus-ring",
                    view === "list" ? "bg-ink-900 text-white" : "text-ink-500"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {!isReady && (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {isReady && shown.length === 0 && (
            <div className="rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-16 text-center">
              <p className="font-display text-2xl text-ink-900">No products found</p>
              <p className="mt-2 text-sm text-ink-500">
                Try adjusting your filters or search keywords.
              </p>
              <Button className="mt-6" variant="outline" onClick={clearFilters}>
                Reset filters
              </Button>
            </div>
          )}

          {isReady && shown.length > 0 && (
            <>
              <div
                className={cn(
                  view === "grid"
                    ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                    : "flex flex-col gap-4"
                )}
              >
                {shown.map((product) => (
                  <ProductCard key={product.id} product={product} view={view} />
                ))}
              </div>

              {visible < filtered.length && (
                <div className="mt-10 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  >
                    Load more
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[70] lg:hidden",
          drawerOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-ink-950/40 transition-opacity",
            drawerOpen ? "opacity-100" : "opacity-0"
          )}
          aria-label="Close filters"
          onClick={() => setDrawerOpen(false)}
        />
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-elevated transition-transform duration-300",
            drawerOpen ? "translate-y-0" : "translate-y-full"
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl text-ink-900">Filters</h2>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="rounded-xl p-2 hover:bg-ink-50 focus-ring"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {FiltersPanel}
          <Button className="mt-4 w-full" onClick={() => setDrawerOpen(false)}>
            Show {filtered.length} products
          </Button>
        </div>
      </div>
    </div>
  );
}
