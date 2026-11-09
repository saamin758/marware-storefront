"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import MobileNav from "./MobileNav";
import BrandLogo from "@/components/ui/BrandLogo";
import { useRouter } from "next/navigation";

export default function Header() {
  const { cart, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/collections/men?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-hairline transition-all">
        <div className="max-w-storefront mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between">
          {/* Left: Mobile Menu Trigger & Desktop Nav */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-ink hover:text-muted transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>

            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/collections/men"
                className="text-[12px] uppercase tracking-micro font-medium text-ink hover:text-muted transition-colors"
              >
                Men
              </Link>
              <Link
                href="/collections/women"
                className="text-[12px] uppercase tracking-micro font-medium text-ink hover:text-muted transition-colors"
              >
                Women
              </Link>
              <Link
                href="/collections/lifestyle"
                className="text-[12px] uppercase tracking-micro font-medium text-ink hover:text-muted transition-colors"
              >
                Lifestyle
              </Link>
              <Link
                href="/collections/new-arrivals"
                className="text-[12px] uppercase tracking-micro font-medium text-ink hover:text-muted transition-colors"
              >
                New Arrivals
              </Link>
              <Link
                href="/collections/sale"
                className="text-[12px] uppercase tracking-micro font-semibold text-sale hover:text-sale-dark transition-colors"
              >
                Sale
              </Link>
            </nav>
          </div>

          {/* Center: Brand Wordmark & Emblem */}
          <div className="flex-1 lg:flex-none text-center">
            <BrandLogo href="/" size="md" />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-ink hover:text-muted transition-colors"
              aria-label="Search catalog"
            >
              <Search size={20} />
            </button>

            {/* Account Link */}
            <Link
              href={
                user?.role === "admin" || user?.role === "super_admin"
                  ? "/ecstasy-ops-vault-8821/dashboard"
                  : user
                  ? "/account"
                  : "/login"
              }
              className="p-2 text-ink hover:text-muted transition-colors hidden sm:inline-flex"
              aria-label="Account profile"
            >
              <User size={20} />
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-ink hover:text-muted transition-colors relative"
              aria-label={`Shopping bag containing ${cart.itemCount} items`}
            >
              <ShoppingBag size={20} />
              {cart.itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-ink text-surface text-[9px] font-semibold h-4 w-4 rounded-full flex items-center justify-center tabular-nums">
                  {cart.itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Input Bar */}
        {searchOpen && (
          <div className="border-t border-hairline bg-surface py-4 px-4 sm:px-10 animate-in fade-in slide-in-from-top-2">
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-2xl mx-auto flex items-center border border-ink"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shirts, Panjabi, dresses, lifestyle..."
                className="flex-1 h-12 px-4 text-sm text-ink placeholder:text-muted focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="h-12 px-6 bg-ink text-surface text-[12px] uppercase tracking-micro font-medium hover:bg-neutral-800"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
