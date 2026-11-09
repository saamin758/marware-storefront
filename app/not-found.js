import Link from "next/link";
import { ArrowLeft, Compass, ShoppingBag } from "lucide-react";

export const metadata = {
  title: "404 - Page Not Found | MARWARE",
  description: "The requested garment, editorial, or catalog resource could not be found.",
};

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 text-center">
      {/* Editorial Monogram Badge */}
      <div className="w-16 h-16 bg-surface border border-hairline flex items-center justify-center mb-8 shadow-xs relative">
        <span className="font-editorial text-2xl font-bold tracking-widest text-ink">
          M
        </span>
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
      </div>

      <p className="text-[11px] uppercase tracking-[0.25em] text-muted font-bold mb-3">
        404 · Resource Not Found
      </p>

      <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-ink tracking-tight mb-6 max-w-xl leading-tight">
        The Requested Page Does Not Exist
      </h1>

      <p className="text-muted text-sm sm:text-base max-w-md mx-auto mb-10 leading-relaxed">
        The destination you are trying to reach has been relocated, archived, or does not exist within our digital storefront.
      </p>

      {/* Quick Action Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-ink text-surface text-xs uppercase tracking-micro font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
        >
          <ArrowLeft size={14} /> Return to Storefront
        </Link>
        <Link
          href="/collections/new-arrivals"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-surface text-ink border border-hairline text-xs uppercase tracking-micro font-semibold hover:border-ink transition-colors"
        >
          <ShoppingBag size={14} /> New Arrivals
        </Link>
      </div>

      {/* Discreet Category Shortcuts */}
      <div className="border-t border-hairline pt-8 max-w-sm w-full">
        <p className="text-[10px] uppercase tracking-micro text-muted font-semibold mb-3">
          Popular Departments:
        </p>
        <div className="flex justify-center gap-6 text-xs uppercase tracking-micro font-medium text-ink">
          <Link href="/collections/men" className="hover:underline">
            Men
          </Link>
          <span className="text-muted">·</span>
          <Link href="/collections/women" className="hover:underline">
            Women
          </Link>
          <span className="text-muted">·</span>
          <Link href="/collections/lifestyle" className="hover:underline">
            Lifestyle
          </Link>
          <span className="text-muted">·</span>
          <Link href="/collections/sale" className="text-sale hover:underline font-bold">
            Sale
          </Link>
        </div>
      </div>
    </div>
  );
}

