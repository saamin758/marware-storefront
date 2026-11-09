import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-hairline mt-24">
      <div className="max-w-storefront mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Column 1: Brand Philosophy */}
          <div>
            <div className="mb-4">
              <BrandLogo href="/" size="sm" />
            </div>
            <p className="text-muted text-sm leading-relaxed mb-6">
              Contemporary Bangladeshi fashion inspired by heritage craftsmanship and architectural minimalism. High-grade textiles tailored for discerning individuals.
            </p>
            <div className="text-[12px] uppercase tracking-micro text-ink font-semibold">
              Dhaka, Bangladesh · ৳ (BDT)
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h5 className="text-[11px] uppercase tracking-micro font-semibold text-ink mb-5">
              Collections
            </h5>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/collections/men"
                  className="text-sm text-muted hover:text-ink transition-colors"
                >
                  Men&apos;s Apparel
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/women"
                  className="text-sm text-muted hover:text-ink transition-colors"
                >
                  Women&apos;s Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/lifestyle"
                  className="text-sm text-muted hover:text-ink transition-colors"
                >
                  Leather & Lifestyle
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/new-arrivals"
                  className="text-sm text-muted hover:text-ink transition-colors"
                >
                  Seasonal Drops
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/sale"
                  className="text-sm text-sale hover:text-sale-dark font-medium transition-colors"
                >
                  Sale Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Services */}
          <div>
            <h5 className="text-[11px] uppercase tracking-micro font-semibold text-ink mb-5">
              Client Support
            </h5>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-muted hover:text-ink transition-colors"
                >
                  Shipping & Delivery Zones
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-muted hover:text-ink transition-colors"
                >
                  Exchange & Return Rules
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="text-sm text-muted hover:text-ink transition-colors"
                >
                  Order Tracking & History
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted hover:text-ink transition-colors"
                >
                  Help & FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Delivery & Payment Methods */}
          <div>
            <h5 className="text-[11px] uppercase tracking-micro font-semibold text-ink mb-5">
              Payment & Security
            </h5>
            <p className="text-muted text-sm leading-relaxed mb-4">
              Cash on Delivery (COD) supported across 64 districts in Bangladesh. Digital transactions are secured with industry standards.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-micro font-semibold text-muted">
              <span className="px-2 py-1 bg-stone border border-hairline">Cash on Delivery</span>
              <span className="px-2 py-1 bg-stone border border-hairline">bKash</span>
              <span className="px-2 py-1 bg-stone border border-hairline">Visa / MC</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted gap-4">
          <div>
            <p>© {new Date().getFullYear()} MARWARE. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6 uppercase tracking-micro text-[10px]">
            <Link href="/terms" className="hover:text-ink">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-ink">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
