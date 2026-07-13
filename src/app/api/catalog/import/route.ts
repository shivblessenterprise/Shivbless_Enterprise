import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { siteConfig } from "@/lib/site";
import { calculateDiscount, slugify } from "@/lib/utils";
import type { Product } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Bulk import products from CSV or JSON.
 * CSV headers (flexible):
 * title,price,originalPrice,category,meeshoUrl,flipkartUrl,imageUrl,shortDescription
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let rows: Record<string, string>[] = [];

    if (contentType.includes("application/json")) {
      const body = await req.json();
      if (Array.isArray(body)) {
        rows = body as Record<string, string>[];
      } else if (Array.isArray(body.products)) {
        rows = body.products as Record<string, string>[];
      } else {
        return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
      }
    } else {
      const form = await req.formData();
      const file = form.get("file");
      if (!file || !(file instanceof File)) {
        return NextResponse.json({ ok: false, error: "CSV/JSON file required" }, { status: 400 });
      }
      const text = await file.text();
      if (file.name.endsWith(".json")) {
        const parsed = JSON.parse(text);
        rows = Array.isArray(parsed) ? parsed : parsed.products || [];
      } else {
        rows = parseCsv(text);
      }
    }

    const products: Product[] = rows
      .map((row, index) => rowToProduct(row, index))
      .filter((p) => p.title.trim().length > 0);

    if (products.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No valid products found in file" },
        { status: 400 }
      );
    }

    await mkdir(path.join(process.cwd(), "data"), { recursive: true });
    await writeFile(
      path.join(process.cwd(), "data", "catalog.json"),
      JSON.stringify(
        {
          updatedAt: new Date().toISOString(),
          source: "bulk-import",
          products,
        },
        null,
        2
      ),
      "utf8"
    );

    return NextResponse.json({
      ok: true,
      count: products.length,
      products,
      message: `Imported ${products.length} products with images/links.`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Import failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]).map((h) =>
    h.trim().toLowerCase().replace(/\s+/g, "")
  );

  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = (cols[i] || "").trim();
    });
    return row;
  });
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  result.push(current);
  return result;
}

function pick(row: Record<string, string>, keys: string[]): string {
  for (const key of keys) {
    const found = Object.entries(row).find(
      ([k]) => k.replace(/_/g, "") === key.replace(/_/g, "")
    );
    if (found?.[1]) return found[1];
  }
  return "";
}

function rowToProduct(row: Record<string, string>, index: number): Product {
  const title = pick(row, ["title", "name", "productname", "product"]);
  const price = Number(pick(row, ["price", "sellingprice", "saleprice"]) || 0);
  const originalPrice = Number(
    pick(row, ["originalprice", "mrp", "listprice"]) || price
  );
  const imageUrl =
    pick(row, ["imageurl", "image", "img", "photo"]) ||
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&q=80";
  const meeshoUrl =
    pick(row, ["meeshourl", "meesho", "producturl", "url"]) ||
    siteConfig.meeshoStoreUrl;
  const flipkartUrl = pick(row, ["flipkarturl", "flipkart"]) || undefined;
  const category =
    pick(row, ["category"]) ||
    (title.toLowerCase().includes("storage")
      ? "storage-organisation"
      : "daily-essentials");
  const shortDescription =
    pick(row, ["shortdescription", "description"]) ||
    `${title} from Shivbless Enterprise — shop on Meesho.`;

  return {
    id: `import-${Date.now()}-${index}`,
    slug: slugify(title) || `product-${index + 1}`,
    title,
    shortDescription,
    fullDescription: shortDescription,
    category,
    subCategory: pick(row, ["subcategory"]) || "Meesho",
    images: [imageUrl],
    price,
    originalPrice,
    discount: calculateDiscount(price, originalPrice),
    rating: 4.3,
    reviewCount: 0,
    marketplace: flipkartUrl ? "both" : "meesho",
    meeshoUrl,
    flipkartUrl,
    isFeatured: index < 8,
    isBestSeller: index < 5,
    isNewArrival: true,
    isTrending: index < 6,
    stockStatus: "in_stock",
    colours: [],
    sizes: [],
    highlights: ["Imported catalogue", "Available on Meesho"],
    specifications: [
      { label: "Brand", value: "Shivbless Enterprise" },
      { label: "Sold on", value: flipkartUrl ? "Meesho & Flipkart" : "Meesho" },
    ],
    tags: ["meesho", "shivbless", "imported"],
    createdAt: new Date().toISOString().slice(0, 10),
    badge: index < 5 ? "Bestseller" : "New",
  };
}
