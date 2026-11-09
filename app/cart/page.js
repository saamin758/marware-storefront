"use client";

import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const { cart, updateQuantity, removeItem, isInitialized, loading } = useCart();

  // 1. Loading Skeleton while initializing (prevents 2-second empty flash)
  if (!isInitialized && loading && cart.items.length === 0) {
    return (
      <div className="max-w-storefront mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-16 animate-pulse">
        <div className="h-9 w-64 bg-stone mb-10 pb-6 border-b border-hairline" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-8 space-y-6 divide-y divide-hairline">
            {[1, 2].map((i) => (
              <div key={i} className="py-6 flex gap-6">
                <div className="w-24 sm:w-28 aspect-portrait bg-stone border border-hairline flex-shrink-0" />
                <div className="flex-1 space-y-3 py-2">
                  <div className="h-5 bg-stone w-2/3" />
                  <div className="h-3 bg-stone w-1/3" />
                  <div className="h-4 bg-stone w-1/4 mt-4" />
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-4">
            <div className="bg-surface border border-hairline p-8 space-y-4">
              <div className="h-4 bg-stone w-1/2 mb-6" />
              <div className="h-4 bg-stone w-full" />
              <div className="h-4 bg-stone w-full" />
              <div className="h-6 bg-stone w-full mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Truly Empty State (only shown once confirmed empty)
  if (cart.items.length === 0) {
    return (
      <div className="max-w-storefront mx-auto px-4 sm:px-6 lg:px-10 py-24 text-center">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-ink mb-4">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-muted text-sm max-w-md mx-auto mb-8 leading-relaxed">
          Explore our collection of tailored shirts, raw silk Panjabis, and contemporary essentials.
        </p>
        <Link href="/collections/new-arrivals">
          <Button size="lg">Explore New Arrivals</Button>
        </Link>
      </div>
    );
  }

  // 3. Render Cart with Items
  return (
    <div className="max-w-storefront mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-16">
      <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-ink tracking-tight mb-10 pb-6 border-b border-hairline">
        Shopping Bag ({cart.itemCount})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Items List (65%) */}
        <div className="lg:col-span-8 divide-y divide-hairline">
          {cart.items.map((item) => (
            <div key={item.id} className="py-6 flex gap-4 sm:gap-6">
              {/* 3:4 Thumbnail */}
              <Link
                href={`/products/${item.product.slug}`}
                className="relative w-24 sm:w-28 aspect-portrait bg-stone border border-hairline flex-shrink-0 overflow-hidden block"
              >
                {item.product.primaryImage?.url && (
                  <img
                    src={item.product.primaryImage.url}
                    alt={item.product.name}
                    className="w-full h-full object-cover object-top"
                  />
                )}
              </Link>

              {/* Item Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-medium text-base text-ink hover:underline line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted hover:text-sale transition-colors p-1 cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="text-xs uppercase tracking-micro text-muted mt-1.5">
                    {item.variant.color} · Size: {item.variant.size}
                  </p>

                  <p className="text-sm font-semibold text-ink mt-2 tabular-nums">
                    {formatPrice(item.variant.price)}
                  </p>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-hairline/60">
                  <div className="flex items-center border border-hairline">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1.5 hover:bg-stone transition-colors text-ink cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-10 text-center text-xs font-medium tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1.5 hover:bg-stone transition-colors text-ink cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <div className="text-sm font-bold text-ink tabular-nums">
                    {formatPrice(item.lineTotal)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-6">
            <Link
              href="/collections/men"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-micro font-medium text-muted hover:text-ink transition-colors"
            >
              <ArrowLeft size={14} /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right: Sticky Summary Panel (35%) */}
        <div className="lg:col-span-4">
          <div className="bg-surface border border-hairline p-6 lg:p-8 lg:sticky lg:top-28">
            <h2 className="text-[12px] uppercase tracking-micro font-semibold text-ink mb-6 pb-4 border-b border-hairline">
              Order Summary
            </h2>

            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold text-ink tabular-nums">
                  {formatPrice(cart.subtotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted">Estimated Shipping</span>
                <span className="font-medium text-ink tabular-nums">
                  {parseFloat(cart.shippingTotal) === 0
                    ? "FREE"
                    : formatPrice(cart.shippingTotal)}
                </span>
              </div>

              <div className="border-t border-hairline pt-4 flex justify-between text-base font-bold text-ink">
                <span>Grand Total</span>
                <span className="tabular-nums">{formatPrice(cart.grandTotal)}</span>
              </div>
            </div>

            <p className="text-[11px] text-muted mb-6 leading-relaxed">
              Taxes calculated at checkout. Cash on Delivery (COD) and Card/bKash simulation available.
            </p>

            <Link href="/checkout" className="block">
              <Button size="lg" className="w-full flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
