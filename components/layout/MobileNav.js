"use client";

import Link from "next/link";
import { X } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

export default function MobileNav({ isOpen, onClose }) {
  if (!isOpen) return null;

  const links = [
    { href: "/collections/men", label: "Men" },
    { href: "/collections/women", label: "Women" },
    { href: "/collections/lifestyle", label: "Lifestyle" },
    { href: "/collections/new-arrivals", label: "New Arrivals" },
    { href: "/collections/sale", label: "Sale", highlight: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-sm bg-surface h-full shadow-2xl flex flex-col z-10 border-r border-hairline">
        <div className="p-6 flex items-center justify-between border-b border-hairline">
          <div onClick={onClose}>
            <BrandLogo href="/" size="sm" />
          </div>
          <button
            onClick={onClose}
            className="p-2 text-ink hover:text-muted transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-6 flex-1 flex flex-col gap-1 overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`py-3 text-[14px] uppercase tracking-micro font-medium border-b border-hairline/50 transition-colors ${
                link.highlight
                  ? "text-sale hover:text-sale-dark font-semibold"
                  : "text-ink hover:text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-hairline bg-canvas flex flex-col gap-3">
          <Link
            href="/account"
            onClick={onClose}
            className="text-[12px] uppercase tracking-micro font-medium text-ink hover:text-muted"
          >
            My Account & Orders
          </Link>
          <Link
            href="/ecstasy-ops-vault-8821/dashboard"
            onClick={onClose}
            className="text-[12px] uppercase tracking-micro font-medium text-muted hover:text-ink"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
