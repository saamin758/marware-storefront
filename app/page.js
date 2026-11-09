import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Award } from "lucide-react";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/storefront/ProductCard";
import { getProducts, getCategories } from "@/services/api/catalog";

export const revalidate = 0; // Fresh dev data

export default async function HomePage() {
  let products = [];
  let categories = [];

  try {
    const productsRes = await getProducts({ limit: 8, sort: "newest" });
    products = Array.isArray(productsRes) ? productsRes : productsRes?.data || [];
  } catch (err) {
    console.error("Failed to load products on homepage:", err);
  }

  try {
    categories = await getCategories();
  } catch (err) {
    console.error("Failed to load categories:", err);
  }

  const newArrivals = products.slice(0, 4);
  const featured = products.slice(4, 8);

  return (
    <div className="flex flex-col">
      {/* Hero Campaign Banner */}
      <section className="relative w-full min-h-[75vh] lg:min-h-[85vh] bg-stone flex items-center justify-center overflow-hidden border-b border-hairline">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop"
            alt="Autumn / Winter Editorial Campaign"
            className="w-full h-full object-cover object-center filter brightness-[0.88]"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-surface py-20">
          <p className="text-[12px] sm:text-[13px] uppercase tracking-[0.25em] font-medium mb-4 text-surface/90">
            AUTUMN / WINTER 2026 CAPSULE
          </p>
          <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.08]">
            ARCHITECTURAL ELEGANCE
          </h1>
          <p className="text-sm sm:text-base text-surface/85 max-w-xl mx-auto mb-10 leading-relaxed font-light">
            Precision tailoring meets authentic South Asian raw silk and Egyptian cotton. Designed for timeless presence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/collections/men">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto min-w-[200px] bg-surface text-ink border-surface hover:bg-neutral-200"
              >
                Explore Men
              </Button>
            </Link>
            <Link href="/collections/women">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto min-w-[200px] border-surface text-surface hover:bg-surface hover:text-ink"
              >
                Explore Women
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Collection Entry Tiles */}
      <section className="max-w-storefront mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-micro text-muted font-semibold mb-2">
            Curated Categories
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            The Collections
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Men */}
          <Link
            href="/collections/men"
            className="group relative aspect-tile bg-stone overflow-hidden border border-hairline block"
          >
            <img
              src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1000&auto=format&fit=crop"
              alt="Men's Collection"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent flex flex-col justify-end p-8 text-surface">
              <p className="text-[11px] uppercase tracking-micro text-surface/80 mb-1">Tailored Tailoring</p>
              <h3 className="font-editorial text-2xl font-bold mb-3">Men&apos;s Apparel</h3>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-micro font-medium group-hover:underline">
                Discover Collection <ArrowRight size={14} />
              </span>
            </div>
          </Link>

          {/* Women */}
          <Link
            href="/collections/women"
            className="group relative aspect-tile bg-stone overflow-hidden border border-hairline block"
          >
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop"
              alt="Women's Collection"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent flex flex-col justify-end p-8 text-surface">
              <p className="text-[11px] uppercase tracking-micro text-surface/80 mb-1">Contemporary Silhouettes</p>
              <h3 className="font-editorial text-2xl font-bold mb-3">Women&apos;s Collection</h3>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-micro font-medium group-hover:underline">
                Discover Collection <ArrowRight size={14} />
              </span>
            </div>
          </Link>

          {/* Lifestyle */}
          <Link
            href="/collections/lifestyle"
            className="group relative aspect-tile bg-stone overflow-hidden border border-hairline block"
          >
            <img
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop"
              alt="Lifestyle & Leather Goods"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent flex flex-col justify-end p-8 text-surface">
              <p className="text-[11px] uppercase tracking-micro text-surface/80 mb-1">Leather & Accessories</p>
              <h3 className="font-editorial text-2xl font-bold mb-3">Lifestyle Goods</h3>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-micro font-medium group-hover:underline">
                Discover Collection <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* New Arrivals Grid */}
      <section className="bg-surface border-y border-hairline py-16 sm:py-24">
        <div className="max-w-storefront mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-micro text-muted font-semibold mb-2">
                Just Released
              </p>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/collections/new-arrivals"
              className="text-[12px] uppercase tracking-micro font-semibold text-ink hover:underline inline-flex items-center gap-1.5"
            >
              View Full Drop <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {newArrivals.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Split Banner */}
      <section className="max-w-storefront mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 border border-hairline bg-surface">
          <div className="relative aspect-portrait lg:aspect-auto min-h-[400px] bg-stone">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop"
              alt="Raw Silk Heritage Panjabi Spotlight"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            <p className="text-[11px] uppercase tracking-micro text-sale font-semibold mb-3">
              Heritage Spotlight
            </p>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-ink tracking-tight mb-6 leading-tight">
              Raw Silk Heritage Panjabi
            </h2>
            <p className="text-muted text-sm sm:text-base leading-relaxed mb-8">
              Handloom woven in Bangladesh. Crafted with an uncompromising dedication to natural raw silk textures and intricate tonal neck embroidery. A modern celebration of cultural distinction.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/products/raw-silk-heritage-panjabi">
                <Button>Order Panjabi</Button>
              </Link>
              <Link href="/collections/men">
                <Button variant="secondary">Browse Festive Wear</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Bestsellers Grid */}
      {featured.length > 0 && (
        <section className="bg-surface border-t border-hairline py-16 sm:py-24">
          <div className="max-w-storefront mx-auto px-4 sm:px-6 lg:px-10">
            <div className="text-center mb-12">
              <p className="text-[11px] uppercase tracking-micro text-muted font-semibold mb-2">
                Curated Essentials
              </p>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                Signature Wardrobe Pieces
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {featured.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Trust Signals */}
      <section className="border-t border-hairline bg-canvas py-16">
        <div className="max-w-storefront mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4 p-4 border border-hairline bg-surface">
              <Truck size={24} className="text-ink flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs uppercase tracking-micro font-semibold text-ink mb-1">
                  Nationwide Delivery
                </h4>
                <p className="text-xs text-muted leading-relaxed">
                  Fast 2–3 day shipping in Dhaka. Standard 3–5 days across all 64 districts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border border-hairline bg-surface">
              <RefreshCw size={24} className="text-ink flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs uppercase tracking-micro font-semibold text-ink mb-1">
                  7-Day Easy Exchange
                </h4>
                <p className="text-xs text-muted leading-relaxed">
                  Complimentary size and color exchanges on all unworn items.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border border-hairline bg-surface">
              <ShieldCheck size={24} className="text-ink flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs uppercase tracking-micro font-semibold text-ink mb-1">
                  Cash On Delivery
                </h4>
                <p className="text-xs text-muted leading-relaxed">
                  Inspect your parcel upon delivery with full cash payment security.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border border-hairline bg-surface">
              <Award size={24} className="text-ink flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs uppercase tracking-micro font-semibold text-ink mb-1">
                  Authentic Textiles
                </h4>
                <p className="text-xs text-muted leading-relaxed">
                  100% natural Egyptian cotton, European linen, and pure handloom silk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
