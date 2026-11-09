# SEO.md — Search Engine Optimization & Discoverability Guidelines

## 1. SEO Architecture Overview

The storefront implements a comprehensive, modern SEO strategy using the **Next.js Metadata API**, semantic HTML5 landmarks, server-rendered public pages, and Schema.org structured data (JSON-LD).

### Core Goals
- Maximize organic search discoverability for product lines, categories, and seasonal collections.
- Ensure all public pages render full, indexable HTML on the server.
- Strictly prevent private, duplicate, or administrative pages from leaking into search engine index results.
- Achieve excellent Core Web Vitals (zero Cumulative Layout Shift, fast First Contentful Paint).

---

## 2. Indexability Matrix & Route Configuration

| Route Pattern | Target Page | Indexability | Robots Directive | Canonical Strategy |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Homepage | **Indexable** | `index, follow` | Self-referencing root URL |
| `/collections/[slug]` | Category Listing | **Indexable** | `index, follow` | Base category URL (strips pagination & filter query params) |
| `/products/[slug]` | Product Details | **Indexable** | `index, follow` | Canonical product URL |
| `/lookbook`, `/about` | Editorial & Brand | **Indexable** | `index, follow` | Self-referencing URL |
| `/shipping`, `/terms` | Policy & FAQs | **Indexable** | `index, follow` | Self-referencing URL |
| `/cart` | Shopping Cart | **Private** | `noindex, nofollow` | Excluded from index |
| `/checkout/**` | Checkout & Confirmation | **Private** | `noindex, nofollow` | Excluded from index |
| `/account/**` | Customer Profile & Orders| **Private** | `noindex, nofollow` | Excluded from index |
| `/login`, `/register` | Authentication | **Private** | `noindex, nofollow` | Excluded from index |
| `/admin/**` | Administration Dashboard| **Private** | `noindex, nofollow` | Excluded from index & blocked via robots.txt |

---

## 3. Metadata Implementation via Next.js Metadata API

### 3.1 Root Layout Metadata (`app/layout.js`)
Define global fallback tokens and title templates:
```javascript
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
  title: {
    template: '%s | Fashion E-Commerce',
    default: 'Fashion E-Commerce | Curated Apparel & Lifestyle Collections'
  },
  description: 'Discover contemporary men\'s, women\'s, and lifestyle fashion collections crafted with precision and editorial elegance.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Fashion E-Commerce'
  },
  twitter: {
    card: 'summary_large_image'
  }
};
```

### 3.2 Dynamic Product Metadata (`app/products/[slug]/page.js`)
Use `generateMetadata({ params })` to fetch product data and return tailored metadata:
```javascript
export async function generateMetadata({ params }) {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const primaryImage = product.images?.[0]?.url || '/images/og-default.jpg';

  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.description?.slice(0, 160),
    alternates: {
      canonical: `/products/${product.slug}`
    },
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160),
      images: [{ url: primaryImage, width: 1200, height: 1600, alt: product.name }]
    }
  };
}
```

---

## 4. Structured Data (Schema.org JSON-LD)

To qualify for rich search snippets (star ratings, price display in BDT, in-stock badges), inject JSON-LD on public pages:

### 4.1 Product Schema (`@type: "Product"`)
Rendered inside `app/products/[slug]/page.js`:
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Premium Cotton Oxford Shirt",
  "image": ["https://example.com/images/shirt-front.jpg"],
  "description": "Tailored pure cotton oxford shirt with crisp collar and mother-of-pearl buttons.",
  "sku": "MSH-001-WHT",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "BDT",
    "price": "2450.00",
    "availability": "https://schema.org/InStock",
    "url": "https://example.com/products/premium-cotton-oxford-shirt",
    "itemCondition": "https://schema.org/NewCondition"
  }
}
```

### 4.2 BreadcrumbList Schema (`@type: "BreadcrumbList"`)
Rendered across category listings and product detail pages to generate clear Google search breadcrumb trails:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com" },
    { "@type": "ListItem", "position": 2, "name": "Men", "item": "https://example.com/collections/men" },
    { "@type": "ListItem", "position": 3, "name": "Shirts", "item": "https://example.com/collections/men-shirts" }
  ]
}
```

---

## 5. Semantic HTML & Content Hierarchy

* **Heading Discipline**:
  * Exactly **one** `<h1>` element per page (e.g., Category Name on PLP, Product Name on PDP, Brand Proposition on Homepage).
  * Subsections use hierarchical `<h2>` (e.g., "Related Products", "Fabric & Care", "Specifications") and `<h3>` for individual cards.
* **Image Accessibility & Search Context**:
  * Every product image must feature an informative `alt` attribute (e.g., `alt="Men's Tailored Linen Blazer in Navy - Front Angle"`).
  * Never use generic or empty `alt="image"` text.
* **Internal Linking**:
  * All navigation links, breadcrumbs, category pills, and collection hero buttons must use valid HTML `<a>` / `<Link>` tags with crawlable `href` attributes rather than unsearchable `div.onClick` handlers.

---

## 6. Robots.txt & Dynamic Sitemap

### 6.1 `app/robots.js`
Configure search engine crawler boundaries:
```javascript
export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/account/', '/checkout/', '/cart/', '/api/']
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
```

### 6.2 `app/sitemap.js`
Generate dynamic XML sitemaps indexing all active categories and published products:
```javascript
export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const categories = await getActiveCategories();
  const products = await getPublishedProducts();

  const categoryEntries = categories.map((cat) => ({
    url: `${baseUrl}/collections/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  const productEntries = products.map((prod) => ({
    url: `${baseUrl}/products/${prod.slug}`,
    lastModified: prod.updatedAt,
    changeFrequency: 'daily',
    priority: 0.9
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    ...categoryEntries,
    ...productEntries
  ];
}
```
