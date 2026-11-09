import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetailsClient from "@/components/storefront/ProductDetailsClient";
import ProductGrid from "@/components/storefront/ProductGrid";
import { getProductBySlug, getProducts } from "@/services/api/catalog";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let product = null;

  try {
    product = await getProductBySlug(slug);
  } catch (err) {
    console.error("Failed to load product metadata:", err);
  }

  if (!product) {
    return {
      title: "Product Not Found | MARWARE",
    };
  }

  const primaryImg = product.primaryImage?.url || product.images?.[0]?.url;

  return {
    title: `${product.seoTitle || product.name} | MARWARE`,
    description:
      product.seoDescription ||
      product.description?.slice(0, 160) ||
      "Explore high-grade tailored fashion from MARWARE.",
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | MARWARE`,
      description: product.description?.slice(0, 160),
      images: primaryImg ? [{ url: primaryImg, width: 1000, height: 1333, alt: product.name }] : [],
    },
  };
}

export default async function ProductDetailPage({ params, searchParams }) {
  const { slug } = await params;
  const search = searchParams ? await searchParams : {};
  const initialColor = search?.color || null;
  let product = null;
  let relatedProducts = [];

  try {
    product = await getProductBySlug(slug);
  } catch (err) {
    console.error("Error fetching product:", err);
  }

  if (!product) {
    notFound();
  }

  try {
    const relatedRes = await getProducts({
      category: product.category?.slug,
      limit: 4,
    });
    const items = relatedRes?.data || relatedRes || [];
    relatedProducts = items.filter((p) => p.id !== product.id).slice(0, 4);
  } catch (err) {
    console.warn("Could not load related items:", err);
  }

  // Schema.org Product JSON-LD
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.map((i) => i.url) || [],
    description: product.description,
    sku: product.variants?.[0]?.sku || product.slug,
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: product.priceFrom,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/products/${product.slug}`,
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <div className="max-w-storefront mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-14">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-muted mb-8 uppercase tracking-micro">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        {product.category?.slug && (
          <>
            <Link
              href={`/collections/${product.category.slug}`}
              className="hover:text-ink"
            >
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-ink font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Details Section */}
      <ProductDetailsClient product={product} initialColor={initialColor} />

      {/* Related Products Cross-Sell */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 pt-16 border-t border-hairline">
          <div className="mb-10 text-center">
            <p className="text-[11px] uppercase tracking-micro text-muted font-semibold mb-2">
              Complete the Look
            </p>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-ink">
              Related Garments
            </h2>
          </div>

          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
