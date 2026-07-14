import { getDb } from "@/lib/mongodb";
import type { Product } from "@/types";

const META_ID = "main";

type CatalogDoc = {
  _id: string;
  updatedAt: string;
  source: string;
  products: Product[];
};

export async function getCatalogProducts(): Promise<Product[]> {
  const db = await getDb();
  const doc = await db.collection<CatalogDoc>("catalog").findOne({ _id: META_ID });

  if (doc?.products && Array.isArray(doc.products)) {
    return doc.products;
  }

  return [];
}

export async function saveCatalogProducts(
  products: Product[],
  source = "admin"
): Promise<void> {
  const db = await getDb();
  await db.collection<CatalogDoc>("catalog").updateOne(
    { _id: META_ID },
    {
      $set: {
        _id: META_ID,
        updatedAt: new Date().toISOString(),
        source,
        products,
      },
    },
    { upsert: true }
  );
}
