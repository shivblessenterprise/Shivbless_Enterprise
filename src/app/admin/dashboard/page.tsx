"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ImagePlus,
  Mail,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useProducts } from "@/hooks/useProducts";
import { ADMIN_SESSION_KEY } from "@/lib/admin";
import { calculateDiscount, formatPrice, slugify, isAppMediaSrc } from "@/lib/utils";
import { categories } from "@/data/categories";
import { siteConfig } from "@/lib/site";
import type { Marketplace, Product, StockStatus } from "@/types";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  product: string;
  quantity: string;
  city: string;
  message: string;
  createdAt: string;
  status: "new" | "read";
};

type FormState = Omit<Product, "id" | "createdAt" | "discount"> & {
  id?: string;
  createdAt?: string;
};

function emptyForm(): FormState {
  return {
    slug: "",
    title: "",
    shortDescription: "",
    fullDescription: "",
    category: "daily-essentials",
    subCategory: "",
    images: [],
    price: 0,
    originalPrice: 0,
    rating: 4.5,
    reviewCount: 0,
    marketplace: "meesho",
    meeshoUrl: siteConfig.meeshoStoreUrl,
    flipkartUrl: siteConfig.flipkartStoreUrl,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isTrending: false,
    stockStatus: "in_stock",
    colours: [],
    sizes: [],
    highlights: [],
    specifications: [],
    tags: [],
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { products, isReady, save, remove, saveToServer, refresh } =
    useProducts();
  const [authed, setAuthed] = useState(false);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [tab, setTab] = useState<"products" | "inquiries">("products");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadInquiries = async () => {
    setInquiriesLoading(true);
    try {
      const res = await fetch("/api/inquiries", { cache: "no-store" });
      const data = (await res.json()) as {
        ok?: boolean;
        inquiries?: Inquiry[];
      };
      if (data.ok && Array.isArray(data.inquiries)) {
        setInquiries(data.inquiries);
      }
    } catch {
      setStatus("Inquiries load nahi ho payi.");
    } finally {
      setInquiriesLoading(false);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem(ADMIN_SESSION_KEY) !== "1") {
      router.replace("/admin");
    } else {
      setAuthed(true);
    }
  }, [router]);

  useEffect(() => {
    if (authed) {
      void loadInquiries();
    }
  }, [authed]);

  useEffect(() => {
    if (authed && tab === "inquiries") {
      void loadInquiries();
    }
  }, [authed, tab]);

  const filtered = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.includes(q) ||
        p.slug.includes(q)
    );
  }, [products, query]);

  const logout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    router.push("/admin");
  };

  const openCreate = () => {
    setEditing(emptyForm());
    setImageUrlInput("");
    setStatus(null);
  };

  const openEdit = (product: Product) => {
    setEditing({ ...product });
    setImageUrlInput("");
    setStatus(null);
  };

  const uploadImages = async (files: FileList | null) => {
    if (!files?.length || !editing) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = (await res.json()) as {
          ok: boolean;
          url?: string;
          error?: string;
        };
        if (!data.ok || !data.url) {
          throw new Error(data.error || "Upload failed");
        }
        urls.push(data.url);
      }
      setEditing({
        ...editing,
        images: [...editing.images.filter(Boolean), ...urls],
      });
      setStatus(`${urls.length} photo upload ho gayi.`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Photo upload fail hui");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const addImageUrl = () => {
    if (!editing || !imageUrlInput.trim()) return;
    setEditing({
      ...editing,
      images: [...editing.images.filter(Boolean), imageUrlInput.trim()],
    });
    setImageUrlInput("");
  };

  const removeImage = (index: number) => {
    if (!editing) return;
    setEditing({
      ...editing,
      images: editing.images.filter((_, i) => i !== index),
    });
  };

  const clearAllProducts = async () => {
    if (
      !confirm(
        "Saare products delete ho jayenge. Phir aap manual add kar sakte ho. Continue?"
      )
    ) {
      return;
    }
    await fetch("/api/catalog", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: [], source: "manual-clear" }),
    });
    localStorage.setItem("shivbless_products_v3", JSON.stringify([]));
    await refresh();
    setStatus("Catalogue empty. Ab Add Product se naya data daalo.");
  };

  const markInquiryRead = async (id: string) => {
    const res = await fetch("/api/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "read" }),
    });
    const data = (await res.json()) as { ok?: boolean; inquiries?: Inquiry[] };
    if (data.ok && data.inquiries) setInquiries(data.inquiries);
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Ye inquiry delete karni hai?")) return;
    const res = await fetch(`/api/inquiries?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = (await res.json()) as { ok?: boolean; inquiries?: Inquiry[] };
    if (data.ok && data.inquiries) {
      setInquiries(data.inquiries);
      setStatus("Inquiry delete ho gayi.");
    }
  };

  const newInquiryCount = inquiries.filter((i) => i.status === "new").length;

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    if (!editing.title.trim()) {
      alert("Product name zaroori hai.");
      return;
    }
    if (!editing.images.filter(Boolean).length) {
      alert("Kam se kam 1 photo add/upload karo.");
      return;
    }
    if (!editing.price || editing.price <= 0) {
      alert("Sahi price daalo.");
      return;
    }

    const images = editing.images.filter(Boolean);
    const originalPrice =
      editing.originalPrice > 0 ? Number(editing.originalPrice) : Number(editing.price);
    const price = Number(editing.price);
    const discount = calculateDiscount(price, originalPrice);

    const product: Product = {
      id: editing.id || `prod-${Date.now()}`,
      createdAt: editing.createdAt || new Date().toISOString().slice(0, 10),
      slug: editing.slug || slugify(editing.title),
      title: editing.title.trim(),
      shortDescription:
        editing.shortDescription.trim() ||
        `${editing.title.trim()} — Shivbless Enterprise`,
      fullDescription:
        editing.fullDescription.trim() ||
        editing.shortDescription.trim() ||
        `${editing.title.trim()} available on Meesho / Flipkart.`,
      category: editing.category,
      subCategory: editing.subCategory || "General",
      images,
      price,
      originalPrice,
      discount,
      rating: Number(editing.rating) || 4.5,
      reviewCount: Number(editing.reviewCount) || 0,
      marketplace: editing.marketplace,
      meeshoUrl: editing.meeshoUrl || siteConfig.meeshoStoreUrl,
      flipkartUrl: editing.flipkartUrl || undefined,
      isFeatured: editing.isFeatured,
      isBestSeller: editing.isBestSeller,
      isNewArrival: editing.isNewArrival,
      isTrending: editing.isTrending,
      stockStatus: editing.stockStatus,
      colours: editing.colours,
      sizes: editing.sizes,
      highlights: editing.highlights.length
        ? editing.highlights
        : ["Quality product", "Available on marketplace"],
      specifications: editing.specifications.length
        ? editing.specifications
        : [
            { label: "Brand", value: "Shivbless Enterprise" },
            {
              label: "Sold on",
              value:
                editing.marketplace === "both"
                  ? "Meesho & Flipkart"
                  : editing.marketplace === "flipkart"
                    ? "Flipkart"
                    : "Meesho",
            },
          ],
      tags: editing.tags.length
        ? editing.tags
        : ["shivbless", editing.marketplace],
      badge: editing.isBestSeller
        ? "Bestseller"
        : editing.isNewArrival
          ? "New"
          : editing.isTrending
            ? "Trending"
            : undefined,
    };

    if (product.marketplace === "meesho") product.flipkartUrl = undefined;
    if (product.marketplace === "flipkart") product.meeshoUrl = undefined;

    await save(product);
    setEditing(null);
    setStatus(`Saved: ${product.title}`);
  };

  if (!authed || !isReady) {
    return (
      <div className="container-premium py-20 text-center text-ink-500">
        Loading admin…
      </div>
    );
  }

  return (
    <div className="container-premium py-10 lg:py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
            Admin Panel
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink-900">
            Manual Product Manager
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-500">
            Yahan se aap khud product name, price, photo, Meesho/Flipkart link
            add/edit/delete kar sakte ho. Photo apne phone/PC se upload karo.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={openCreate} size="lg">
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              await saveToServer();
              setStatus("Sab products server pe save ho gaye.");
            }}
          >
            <Save className="h-4 w-4" />
            Save All
          </Button>
          <Button variant="ghost" onClick={logout}>
            Log out
          </Button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50 px-5 py-4 text-sm text-ink-800">
        <p className="font-semibold text-ink-900">Kaise add karein (simple):</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-ink-600">
          <li>
            <strong>Add New Product</strong> dabao
          </li>
          <li>Name, price, category, Meesho/Flipkart link bharo</li>
          <li>
            <strong>Photo Upload</strong> se product ki image select karo (JPG/PNG)
          </li>
          <li>
            <strong>Save Product</strong> dabao — website pe turant dikhega
          </li>
        </ol>
      </div>

      {status && (
        <p className="mt-4 rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-700 shadow-soft">
          {status}
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-2 border-b border-ink-100 pb-3">
        <button
          type="button"
          onClick={() => setTab("products")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            tab === "products"
              ? "bg-ink-900 text-white"
              : "bg-surface-muted text-ink-600 hover:bg-ink-100"
          }`}
        >
          Products ({products.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("inquiries")}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
            tab === "inquiries"
              ? "bg-ink-900 text-white"
              : "bg-surface-muted text-ink-600 hover:bg-ink-100"
          }`}
        >
          <Mail className="h-4 w-4" />
          Bulk Inquiries ({inquiries.length})
          {newInquiryCount > 0 && (
            <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-semibold text-white">
              {newInquiryCount} new
            </span>
          )}
        </button>
      </div>

      {tab === "inquiries" ? (
        <div className="mt-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-500">
              Contact page se aayi bulk inquiries yahan dikhengi.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadInquiries()}
              disabled={inquiriesLoading}
            >
              {inquiriesLoading ? "Loading…" : "Refresh"}
            </Button>
          </div>

          {inquiriesLoading && inquiries.length === 0 ? (
            <p className="py-12 text-center text-ink-500">Loading inquiries…</p>
          ) : inquiries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-16 text-center">
              <Mail className="mx-auto h-10 w-10 text-ink-300" />
              <p className="mt-4 font-display text-2xl text-ink-900">
                Abhi koi inquiry nahi hai
              </p>
              <p className="mt-2 text-sm text-ink-500">
                Jab koi Contact page se Bulk Inquiry bhejega, woh yahan dikhegi.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inq) => (
                <article
                  key={inq.id}
                  className={`rounded-2xl border bg-white p-5 shadow-soft ${
                    inq.status === "new"
                      ? "border-brand-200 ring-1 ring-brand-100"
                      : "border-ink-100"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-xl text-ink-900">
                          {inq.name}
                        </h3>
                        {inq.status === "new" && (
                          <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                            New
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-ink-400">
                        {new Date(inq.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {inq.status === "new" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void markInquiryRead(inq.id)}
                        >
                          Mark read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void deleteInquiry(inq.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-ink-400">
                        Email
                      </p>
                      <a
                        href={`mailto:${inq.email}`}
                        className="font-medium text-ink-800 hover:text-brand-700"
                      >
                        {inq.email}
                      </a>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-ink-400">
                        City
                      </p>
                      <p className="font-medium text-ink-800">
                        {inq.city || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-ink-400">
                        Product
                      </p>
                      <p className="font-medium text-ink-800">{inq.product}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-ink-400">
                        Quantity
                      </p>
                      <p className="font-medium text-ink-800">{inq.quantity}</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-surface-muted px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-ink-400">
                      Message
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-ink-700">
                      {inq.message}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="h-11 w-full max-w-md rounded-xl border border-ink-200 px-3 text-sm"
        />
        <div className="flex flex-wrap items-center gap-3 text-sm text-ink-500">
          <span>{products.length} products</span>
          <button
            type="button"
            onClick={() => void clearAllProducts()}
            className="text-red-600 hover:underline"
          >
            Clear all (start fresh)
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-16 text-center">
          <p className="font-display text-2xl text-ink-900">
            Abhi koi product nahi hai
          </p>
          <p className="mt-2 text-sm text-ink-500">
            Add New Product se pehla product daalo — photo ke saath.
          </p>
          <Button className="mt-6" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-soft">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-ink-100 bg-surface-muted text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Links</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-ink-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-surface-warm">
                        <Image
                          src={product.images[0]}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                          unoptimized={isAppMediaSrc(product.images[0])}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-ink-900">
                          {product.title}
                        </p>
                        <Link
                          href={`/products/${product.slug}`}
                          className="text-xs text-brand-700 hover:underline"
                        >
                          View on site
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3 text-xs capitalize text-ink-500">
                    {product.marketplace}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(product)}
                        className="rounded-lg p-2 text-ink-600 hover:bg-ink-50 focus-ring"
                        aria-label={`Edit ${product.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete “${product.title}”?`)) {
                            void remove(product.id);
                          }
                        }}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 focus-ring"
                        aria-label={`Delete ${product.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
        </>
      )}

      {editing && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink-950/50 p-3 sm:items-center">
          <form
            onSubmit={onSave}
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-5 shadow-elevated sm:p-7"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl text-ink-900">
                  {editing.id ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="mt-1 text-sm text-ink-500">
                  Saari details manually bharo. Photo zaroor upload karo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-xl p-2 hover:bg-ink-50"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Images first - most important for user */}
            <div className="mt-6 rounded-2xl border border-dashed border-brand-300 bg-brand-50/40 p-4">
              <p className="text-sm font-semibold text-ink-900">
                Product Photos *
              </p>
              <p className="mt-1 text-xs text-ink-500">
                JPG / PNG / WEBP — max 5MB each. Multiple photos allowed.
              </p>

              {editing.images.filter(Boolean).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {editing.images.filter(Boolean).map((img, index) => (
                    <div
                      key={`${img}-${index}`}
                      className="relative h-24 w-24 overflow-hidden rounded-xl border border-ink-100 bg-white"
                    >
                      <Image
                        src={img}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized={isAppMediaSrc(img)}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-1 top-1 rounded-full bg-ink-900/80 p-1 text-white"
                        aria-label="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                >
                  <ImagePlus className="h-4 w-4" />
                  {uploading ? "Uploading…" : "Upload from Computer"}
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="hidden"
                  onChange={(e) => void uploadImages(e.target.files)}
                />
              </div>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Ya image URL paste karo (optional)"
                  className="h-10 flex-1 rounded-xl border border-ink-200 px-3 text-sm"
                />
                <Button type="button" variant="outline" onClick={addImageUrl}>
                  Add URL
                </Button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Product Name *" className="sm:col-span-2">
                <input
                  required
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      title: e.target.value,
                      slug: editing.id ? editing.slug : slugify(e.target.value),
                    })
                  }
                      placeholder="Example: Elegant Fancy Pooja Mats"
                  className="mt-1.5 h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </Field>

              <Field label="Selling Price ₹ *">
                <input
                  type="number"
                  min={1}
                  required
                  value={editing.price || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, price: Number(e.target.value) })
                  }
                  placeholder="299"
                  className="mt-1.5 h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </Field>

              <Field label="MRP / Original Price ₹">
                <input
                  type="number"
                  min={0}
                  value={editing.originalPrice || ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      originalPrice: Number(e.target.value),
                    })
                  }
                  placeholder="399"
                  className="mt-1.5 h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </Field>

              <Field label="Category">
                <select
                  value={editing.category}
                  onChange={(e) =>
                    setEditing({ ...editing, category: e.target.value })
                  }
                  className="mt-1.5 h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Marketplace">
                <select
                  value={editing.marketplace}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      marketplace: e.target.value as Marketplace,
                    })
                  }
                  className="mt-1.5 h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                >
                  <option value="meesho">Meesho only</option>
                  <option value="flipkart">Flipkart only</option>
                  <option value="both">Meesho + Flipkart</option>
                </select>
              </Field>

              <Field label="Meesho Product / Shop Link" className="sm:col-span-2">
                <input
                  type="url"
                  value={editing.meeshoUrl || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, meeshoUrl: e.target.value })
                  }
                  placeholder={siteConfig.meeshoStoreUrl}
                  className="mt-1.5 h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </Field>

              <Field
                label="Flipkart Product Link"
                className="sm:col-span-2"
              >
                <input
                  type="url"
                  value={editing.flipkartUrl || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, flipkartUrl: e.target.value })
                  }
                  placeholder={siteConfig.flipkartStoreUrl}
                  className="mt-1.5 h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </Field>

              <Field label="Short Description" className="sm:col-span-2">
                <textarea
                  rows={2}
                  value={editing.shortDescription}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      shortDescription: e.target.value,
                    })
                  }
                  placeholder="1-2 lines about product"
                  className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </Field>

              <Field label="Full Description" className="sm:col-span-2">
                <textarea
                  rows={4}
                  value={editing.fullDescription}
                  onChange={(e) =>
                    setEditing({ ...editing, fullDescription: e.target.value })
                  }
                  placeholder="Full product details"
                  className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </Field>

              <Field label="Stock">
                <select
                  value={editing.stockStatus}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      stockStatus: e.target.value as StockStatus,
                    })
                  }
                  className="mt-1.5 h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                >
                  <option value="in_stock">In stock</option>
                  <option value="low_stock">Low stock</option>
                  <option value="out_of_stock">Out of stock</option>
                </select>
              </Field>

              <Field label="URL Slug (auto)">
                <input
                  value={editing.slug}
                  onChange={(e) =>
                    setEditing({ ...editing, slug: slugify(e.target.value) })
                  }
                  className="mt-1.5 h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </Field>

              <Field label="Colours (comma)">
                <input
                  value={editing.colours.join(", ")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      colours: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Red, Maroon"
                  className="mt-1.5 h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </Field>

              <Field label="Sizes (comma)">
                <input
                  value={editing.sizes.join(", ")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      sizes: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Standard"
                  className="mt-1.5 h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </Field>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(
                [
                  ["isFeatured", "Featured"],
                  ["isBestSeller", "Bestseller"],
                  ["isNewArrival", "New"],
                  ["isTrending", "Trending"],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 rounded-xl border border-ink-100 px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(editing[key])}
                    onChange={(e) =>
                      setEditing({ ...editing, [key]: e.target.checked })
                    }
                  />
                  {label}
                </label>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
              <Button type="submit" size="lg">
                Save Product
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="text-sm font-medium text-ink-800">{label}</span>
      {children}
    </label>
  );
}
