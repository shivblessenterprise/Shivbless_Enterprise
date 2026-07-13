import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { buildMeeshoShopProducts } from "@/data/meesho-shop-catalog";
import type { Product } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CATALOG_DIR = path.join(process.cwd(), "data");
const CATALOG_FILE = path.join(CATALOG_DIR, "catalog.json");

async function ensureCatalog(): Promise<Product[]> {
  try {
    const raw = await readFile(CATALOG_FILE, "utf8");
    const parsed = JSON.parse(raw) as { products?: Product[] } | Product[];
    const list = Array.isArray(parsed) ? parsed : parsed.products;
    if (Array.isArray(list)) return list;
  } catch {
    // create below
  }

  const products = buildMeeshoShopProducts();
  await mkdir(CATALOG_DIR, { recursive: true });
  await writeFile(
    CATALOG_FILE,
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        source: "meesho-shop-catalog",
        products,
      },
      null,
      2
    ),
    "utf8"
  );
  return products;
}

export async function GET() {
  const products = await ensureCatalog();
  return NextResponse.json({
    ok: true,
    count: products.length,
    products,
  });
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      products?: Product[];
      source?: string;
    };

    if (!Array.isArray(body.products)) {
      return NextResponse.json(
        { ok: false, error: "products array required" },
        { status: 400 }
      );
    }

    await mkdir(CATALOG_DIR, { recursive: true });
    await writeFile(
      CATALOG_FILE,
      JSON.stringify(
        {
          updatedAt: new Date().toISOString(),
          source: body.source || "admin",
          products: body.products,
        },
        null,
        2
      ),
      "utf8"
    );

    return NextResponse.json({
      ok: true,
      count: body.products.length,
      message: "Catalogue saved on server. Website will use these products.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
