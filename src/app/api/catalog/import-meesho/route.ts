import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/site";
import { calculateDiscount, slugify } from "@/lib/utils";
import type { Product } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type IncomingItem = {
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  productUrl?: string;
  rating?: number;
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      products?: IncomingItem[];
      shopUrl?: string;
    };

    const items = body.products || [];
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No products received" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    await mkdir(uploadDir, { recursive: true });

    const products: Product[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const title = String(item.title || "").trim();
      if (!title) continue;

      const price = Number(item.price) || 0;
      const originalPrice = Number(item.originalPrice) || price;
      const meeshoUrl =
        item.productUrl || body.shopUrl || siteConfig.meeshoStoreUrl;

      let localImage =
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&q=80";

      if (item.imageUrl) {
        const downloaded = await downloadImage(item.imageUrl, uploadDir, i);
        if (downloaded) localImage = downloaded;
        else localImage = item.imageUrl;
      }

      const isStorage = /storage|bag/i.test(title);
      products.push({
        id: `meesho-live-${Date.now()}-${i}`,
        slug: slugify(title) || `meesho-product-${i + 1}`,
        title,
        shortDescription: isStorage
          ? "Produce storage bags from Shivbless Enterprise on Meesho."
          : "Pooja mat from Shivbless Enterprise on Meesho.",
        fullDescription: `${title} — browse on Shivbless Enterprise and buy securely on Meesho.`,
        category: isStorage ? "storage-organisation" : "daily-essentials",
        subCategory: isStorage ? "Produce Storage" : "Pooja Mats",
        images: [localImage],
        price,
        originalPrice,
        discount: calculateDiscount(price, originalPrice),
        rating: Number(item.rating) || 4.2,
        reviewCount: 6,
        marketplace: "meesho",
        meeshoUrl,
        isFeatured: i < 8,
        isBestSeller: i < 5,
        isNewArrival: i < 4,
        isTrending: i < 6,
        stockStatus: "in_stock",
        colours: [],
        sizes: [],
        highlights: [
          "Imported from Meesho shop",
          "Real product image",
          "Buy on Meesho",
        ],
        specifications: [
          { label: "Brand", value: "Shivbless Enterprise" },
          { label: "Sold on", value: "Meesho" },
        ],
        tags: ["meesho", "shivbless", "live-import"],
        createdAt: new Date().toISOString().slice(0, 10),
        badge: i < 5 ? "Bestseller" : i < 8 ? "Popular Choice" : undefined,
      });
    }

    await mkdir(path.join(process.cwd(), "data"), { recursive: true });
    await writeFile(
      path.join(process.cwd(), "data", "catalog.json"),
      JSON.stringify(
        {
          updatedAt: new Date().toISOString(),
          source: "meesho-browser-import",
          shopUrl: body.shopUrl || siteConfig.meeshoStoreUrl,
          products,
        },
        null,
        2
      ),
      "utf8"
    );

    return NextResponse.json(
      {
        ok: true,
        count: products.length,
        products,
        message: `${products.length} products imported with images from your Meesho shop.`,
      },
      { headers: corsHeaders() }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Import failed";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500, headers: corsHeaders() }
    );
  }
}

async function downloadImage(
  imageUrl: string,
  dir: string,
  index: number
): Promise<string | null> {
  try {
    const res = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Referer: "https://www.meesho.com/",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
    });
    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "image/webp";
    const ext = contentType.includes("png")
      ? "png"
      : contentType.includes("jpeg") || contentType.includes("jpg")
        ? "jpg"
        : "webp";

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 500) return null;

    const filename = `meesho-${Date.now()}-${index}.${ext}`;
    await writeFile(path.join(dir, filename), buffer);
    return `/uploads/products/${filename}`;
  } catch {
    return null;
  }
}
