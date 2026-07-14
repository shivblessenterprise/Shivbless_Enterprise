import { NextRequest, NextResponse } from "next/server";
import { getCatalogProducts, saveCatalogProducts } from "@/lib/catalog-db";
import { explainMongoError } from "@/lib/mongodb";
import type { Product } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getCatalogProducts();
    return NextResponse.json({
      ok: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: explainMongoError(error) },
      { status: 500 }
    );
  }
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

    await saveCatalogProducts(body.products, body.source || "admin");

    return NextResponse.json({
      ok: true,
      count: body.products.length,
      message: "Catalogue saved to MongoDB. Website will use these products.",
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: explainMongoError(error) },
      { status: 500 }
    );
  }
}
