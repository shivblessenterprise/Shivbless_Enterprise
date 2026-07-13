"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deleteProduct,
  loadProducts,
  resetProducts,
  saveProducts,
  upsertProduct,
} from "@/lib/products";
import type { Product } from "@/types";

async function fetchServerCatalog(): Promise<Product[] | null> {
  try {
    const res = await fetch("/api/catalog", { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { ok?: boolean; products?: Product[] };
    if (data.ok && Array.isArray(data.products)) {
      return data.products;
    }
  } catch {
    // fall back
  }
  return null;
}

async function persistServerCatalog(
  products: Product[],
  source = "admin"
): Promise<void> {
  await fetch("/api/catalog", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ products, source }),
  });
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const fromServer = await fetchServerCatalog();
    if (fromServer) {
      saveProducts(fromServer);
      setProducts(fromServer);
    } else {
      setProducts(loadProducts());
    }
    setIsReady(true);
  }, []);

  const importFile = useCallback(async (file: File) => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/catalog/import", {
        method: "POST",
        body: form,
      });
      const data = (await res.json()) as {
        ok: boolean;
        products?: Product[];
        message?: string;
        error?: string;
        count?: number;
      };
      if (!data.ok || !data.products) {
        throw new Error(data.error || "Import failed");
      }
      saveProducts(data.products);
      setProducts(data.products);
      setSyncMessage(data.message || `Imported ${data.count} products`);
      return data;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const saveToServer = useCallback(async (list?: Product[]) => {
    const payload = list ?? products;
    await persistServerCatalog(payload, "admin-save");
    saveProducts(payload);
    setSyncMessage(`Saved ${payload.length} products to server catalogue.`);
  }, [products]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(
    async (product: Product) => {
      const next = upsertProduct(product);
      setProducts(next);
      await persistServerCatalog(next, "admin-edit");
      return next;
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    const next = deleteProduct(id);
    setProducts(next);
    await persistServerCatalog(next, "admin-delete");
    return next;
  }, []);

  const reset = useCallback(async () => {
    const next = resetProducts();
    setProducts(next);
    await persistServerCatalog(next, "reset-seed");
    return next;
  }, []);

  return {
    products,
    isReady,
    isSyncing,
    syncMessage,
    refresh,
    save,
    remove,
    reset,
    importFile,
    saveToServer,
  };
}
