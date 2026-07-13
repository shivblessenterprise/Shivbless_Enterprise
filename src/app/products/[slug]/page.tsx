import { ProductDetailLoader } from "@/components/product/ProductDetailLoader";
import { getCatalogProductBySlug, getCatalogProducts } from "@/lib/catalog-server";
import { getCategoriesWithCounts } from "@/lib/products";
import { breadcrumbSchema, buildMetadata, productSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getCatalogProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);
  if (!product) {
    return {
      title: "Product | Shivbless Enterprise",
    };
  }
  return buildMetadata({
    title: product.title,
    description: product.shortDescription,
    path: `/products/${product.slug}`,
    image: product.images[0],
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  // Even if not found on server, client loader can find localStorage products
  if (!product) {
    return <ProductDetailLoader slug={slug} />;
  }

  const categoryName =
    getCategoriesWithCounts().find((c) => c.slug === product.category)?.name ||
    product.category;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema(product)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Shop", path: "/shop" },
              { name: categoryName, path: `/categories/${product.category}` },
              { name: product.title, path: `/products/${product.slug}` },
            ])
          ),
        }}
      />
      <ProductDetailLoader slug={slug} initialProduct={product} />
    </>
  );
}
