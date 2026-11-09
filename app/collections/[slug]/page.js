import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/storefront/ProductGrid";
import { getCategoryBySlug, getProducts } from "@/services/api/catalog";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let category = null;
  try {
    category = await getCategoryBySlug(slug);
  } catch (err) {
    console.error("Failed to fetch category metadata:", err);
  }

  const title = category?.name ? `${category.name}'s Collection` : "Collection";
  const description =
    category?.description ||
    "Explore our contemporary fashion and lifestyle apparel collection.";

  return {
    title: `${title} | MARWARE`,
    description,
    alternates: {
      canonical: `/collections/${slug}`,
    },
    openGraph: {
      title: `${title} | MARWARE`,
      description,
      images: category?.imageUrl ? [{ url: category.imageUrl }] : [],
    },
  };
}

export default async function CollectionPage({ params, searchParams }) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const sort = resolvedSearchParams?.sort || "newest";
  const search = resolvedSearchParams?.search || "";
  const minPrice = resolvedSearchParams?.minPrice || "";
  const maxPrice = resolvedSearchParams?.maxPrice || "";
  const inStock = resolvedSearchParams?.inStock || "";
  const onSale = resolvedSearchParams?.onSale || "";

  let category = null;
  let products = [];
  let meta = { total: 0 };

  try {
    category = await getCategoryBySlug(slug);
  } catch (err) {
    console.warn("Category fetch warning:", err.message);
  }

  // Support direct slug categories or "sale" / "new-arrivals"
  const categoryFilter = slug === "all" ? "" : slug;

  try {
    const productsRes = await getProducts({
      category: categoryFilter,
      search,
      minPrice,
      maxPrice,
      inStock,
      onSale: slug === "sale" ? "true" : onSale,
      sort,
      limit: 24,
    });
    products = productsRes?.data || productsRes || [];
    meta = productsRes?.meta || { total: products.length };
  } catch (err) {
    console.error("Failed to load products for category:", err);
  }

  const categoryName = category?.name || (slug === "sale" ? "Sale Archive" : slug === "new-arrivals" ? "New Arrivals" : "All Products");

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/collections/${slug}`,
      },
    ],
  };

  return (
    <div className="max-w-storefront mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-16">
      {/* Schema.org Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted mb-8 uppercase tracking-micro">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <span className="text-ink font-medium">{categoryName}</span>
      </nav>

      {/* Header & Title */}
      <div className="border-b border-hairline pb-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-ink tracking-tight mb-3">
              {categoryName}
            </h1>
            <p className="text-muted text-sm sm:text-base max-w-2xl leading-relaxed">
              {category?.description ||
                "Curated wardrobe staples crafted with timeless precision, natural textiles, and architectural structure."}
            </p>
          </div>
          <span className="text-xs uppercase tracking-micro text-muted font-medium tabular-nums">
            {meta.total} {meta.total === 1 ? "Item" : "Items"}
          </span>
        </div>
      </div>

      {/* Filter / Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-hairline text-xs uppercase tracking-micro">
        {/* Quick Filter Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/collections/${slug}`}
            className={`px-3 py-1.5 border transition-colors ${
              !onSale && !inStock
                ? "border-ink bg-ink text-surface"
                : "border-hairline text-muted hover:border-ink"
            }`}
          >
            All Items
          </Link>
          <Link
            href={`/collections/${slug}?inStock=true`}
            className={`px-3 py-1.5 border transition-colors ${
              inStock === "true"
                ? "border-ink bg-ink text-surface"
                : "border-hairline text-muted hover:border-ink"
            }`}
          >
            In Stock Only
          </Link>
          <Link
            href={`/collections/${slug}?onSale=true`}
            className={`px-3 py-1.5 border transition-colors ${
              onSale === "true"
                ? "border-sale bg-sale text-surface"
                : "border-hairline text-muted hover:border-sale"
            }`}
          >
            Sale Highlights
          </Link>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <span className="text-muted font-medium">Sort by:</span>
          <div className="flex items-center gap-1">
            <Link
              href={`/collections/${slug}?sort=newest`}
              className={`px-2 py-1 ${
                sort === "newest" ? "font-bold text-ink underline" : "text-muted hover:text-ink"
              }`}
            >
              Newest
            </Link>
            <span className="text-hairline">|</span>
            <Link
              href={`/collections/${slug}?sort=price_asc`}
              className={`px-2 py-1 ${
                sort === "price_asc" ? "font-bold text-ink underline" : "text-muted hover:text-ink"
              }`}
            >
              Price Low
            </Link>
            <span className="text-hairline">|</span>
            <Link
              href={`/collections/${slug}?sort=price_desc`}
              className={`px-2 py-1 ${
                sort === "price_desc" ? "font-bold text-ink underline" : "text-muted hover:text-ink"
              }`}
            >
              Price High
            </Link>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid products={products} />
    </div>
  );
}
