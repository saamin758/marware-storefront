import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/storefront/ProductGrid";
import { getCategoryBySlug, getProducts } from "@/services/api/catalog";

const CATEGORY_METADATA_FALLBACK = {
  men: {
    name: "Men's Collection",
    breadcrumb: "Men",
    description: "Tailored shirts, casual polos, luxury Panjabis, and denim crafted for modern gentlemen.",
  },
  women: {
    name: "Women's Collection",
    breadcrumb: "Women",
    description: "Contemporary dresses, elegant tops, Kurti sets, and relaxed silhouettes.",
  },
  lifestyle: {
    name: "Lifestyle & Leather Goods",
    breadcrumb: "Lifestyle",
    description: "Curated leather goods, bespoke accessories, and handcrafted lifestyle essentials.",
  },
  "new-arrivals": {
    name: "New Arrivals",
    breadcrumb: "New Arrivals",
    description: "Freshly dropped season capsules and limited-run editorial essentials.",
  },
  sale: {
    name: "Sale Archive",
    breadcrumb: "Sale",
    description: "Seasonal archives and special promotional pricing up to 40% off.",
  },
  all: {
    name: "All Products",
    breadcrumb: "All Products",
    description: "Curated wardrobe staples crafted with timeless precision, natural textiles, and architectural structure.",
  },
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const slugKey = (slug || "").toLowerCase();
  const fallback = CATEGORY_METADATA_FALLBACK[slugKey] || {
    name: `${slugKey.charAt(0).toUpperCase() + slugKey.slice(1)} Collection`,
    description: "Explore our contemporary fashion and lifestyle apparel collection.",
  };

  let category = null;
  try {
    category = await getCategoryBySlug(slug);
  } catch (err) {
    console.error("Failed to fetch category metadata:", err);
  }

  const title = category?.name ? `${category.name}'s Collection` : fallback.name;
  const description = category?.description || fallback.description;

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

  const slugKey = (slug || "").toLowerCase();
  const fallback = CATEGORY_METADATA_FALLBACK[slugKey] || {
    name: `${slugKey.charAt(0).toUpperCase() + slugKey.slice(1)} Collection`,
    breadcrumb: slugKey.charAt(0).toUpperCase() + slugKey.slice(1),
    description: "Curated wardrobe staples crafted with timeless precision, natural textiles, and architectural structure.",
  };

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

  const categoryName = category?.name
    ? (category.name.toLowerCase().endsWith("collection") || category.name.toLowerCase().endsWith("goods") || category.name.toLowerCase().endsWith("arrivals") || category.name.toLowerCase().endsWith("archive")
      ? category.name
      : `${category.name}'s Collection`)
    : fallback.name;
  const categoryDescription = category?.description || fallback.description;
  const categoryBreadcrumb = fallback.breadcrumb || category?.name || categoryName;

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_SITE_URL || "https://marware.netlify.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://marware.netlify.app"}/collections/${slug}`,
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
        <span className="text-ink font-medium">{categoryBreadcrumb}</span>
      </nav>

      {/* Header & Title */}
      <div className="border-b border-hairline pb-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-ink tracking-tight mb-3">
              {categoryName}
            </h1>
            <p className="text-muted text-sm sm:text-base max-w-2xl leading-relaxed">
              {categoryDescription}
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
            className={`px-3 py-1.5 border transition-colors ${!onSale && !inStock
                ? "border-ink bg-ink text-surface"
                : "border-hairline text-muted hover:border-ink"
              }`}
          >
            All Items
          </Link>
          <Link
            href={`/collections/${slug}?inStock=true`}
            className={`px-3 py-1.5 border transition-colors ${inStock === "true"
                ? "border-ink bg-ink text-surface"
                : "border-hairline text-muted hover:border-ink"
              }`}
          >
            In Stock Only
          </Link>
          <Link
            href={`/collections/${slug}?onSale=true`}
            className={`px-3 py-1.5 border transition-colors ${onSale === "true"
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
              className={`px-2 py-1 ${sort === "newest" ? "font-bold text-ink underline" : "text-muted hover:text-ink"
                }`}
            >
              Newest
            </Link>
            <span className="text-hairline">|</span>
            <Link
              href={`/collections/${slug}?sort=price_asc`}
              className={`px-2 py-1 ${sort === "price_asc" ? "font-bold text-ink underline" : "text-muted hover:text-ink"
                }`}
            >
              Price Low
            </Link>
            <span className="text-hairline">|</span>
            <Link
              href={`/collections/${slug}?sort=price_desc`}
              className={`px-2 py-1 ${sort === "price_desc" ? "font-bold text-ink underline" : "text-muted hover:text-ink"
                }`}
            >
              Price High
            </Link>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={products}
        emptyTitle={`No Products in ${categoryName}`}
        emptyDescription={`Our seasonal ${categoryName} drop will be published shortly. Check back soon or explore our other departments.`}
      />
    </div>
  );
}
