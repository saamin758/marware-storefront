"use client";

import Link from "next/link";
import { X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    isInitialized,
    loading,
  } = useCart();

  if (!isCartOpen) return null;

  const subtotalNumeric = parseFloat(cart.subtotal || 0);
  const freeShippingThreshold = 3000;
  const progressPercent = Math.min(
    100,
    (subtotalNumeric / freeShippingThreshold) * 100
  );
  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotalNumeric
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-out Drawer */}
      <div className="relative w-full max-w-md bg-surface h-full shadow-2xl flex flex-col z-10 border-l border-hairline animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-hairline flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-editorial text-xl font-bold tracking-tight text-ink">
              Shopping Bag
            </h3>
            <span className="text-[11px] font-semibold text-muted tabular-nums">
              ({cart.itemCount})
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-ink hover:text-muted transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-canvas border-b border-hairline text-center">
          <p className="text-[11px] uppercase tracking-micro text-ink font-medium mb-1.5">
            {remainingForFreeShipping > 0
              ? `Add ${formatPrice(remainingForFreeShipping)} more for FREE Nationwide Shipping`
              : "✓ You have unlocked FREE Nationwide Shipping"}
          </p>
          <div className="w-full bg-stone h-1.5 overflow-hidden">
            <div
              className="bg-ink h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-hairline">
          {/* 1. Loading Skeleton while initializing (prevents 2-second empty flash) */}
          {!isInitialized && loading && cart.items.length === 0 ? (
            <div className="py-4 space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-20 aspect-portrait bg-stone border border-hairline flex-shrink-0" />
                  <div className="flex-1 space-y-2.5 py-1">
                    <div className="h-4 bg-stone w-3/4" />
                    <div className="h-3 bg-stone w-1/2" />
                    <div className="h-4 bg-stone w-1/4 mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : cart.items.length === 0 ? (
            /* 2. Truly Empty State */
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <p className="text-muted text-sm mb-6">Your shopping bag is currently empty.</p>
              <Button
                variant="secondary"
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            /* 3. Render Items */
            cart.items.map((item) => (
              <div key={item.id} className="py-4 flex gap-4">
                {/* 3:4 Thumbnail Frame */}
                <div className="relative w-20 aspect-portrait bg-stone border border-hairline flex-shrink-0 overflow-hidden">
                  {item.product.primaryImage?.url && (
                    <img
                      src={item.product.primaryImage.url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="text-sm font-medium text-ink hover:underline line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted hover:text-sale transition-colors p-1 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="text-[11px] text-muted tracking-micro uppercase mt-1">
                      {item.variant.color} · Size: {item.variant.size}
                    </div>

                    <div className="text-sm font-medium text-ink tabular-nums mt-1">
                      {formatPrice(item.variant.price)}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between mt-3 pt-2">
                    <div className="flex items-center border border-hairline">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-stone transition-colors text-ink cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-xs font-medium tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-stone transition-colors text-ink cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span className="text-xs font-semibold text-ink tabular-nums">
                      {formatPrice(item.lineTotal)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.items.length > 0 && (
          <div className="p-5 border-t border-hairline bg-surface flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-semibold text-ink tabular-nums">
                {formatPrice(cart.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-muted">
              <span>Estimated Shipping</span>
              <span>
                {parseFloat(cart.shippingTotal) === 0
                  ? "FREE"
                  : formatPrice(cart.shippingTotal)}
              </span>
            </div>
            <div className="flex justify-between text-base font-semibold text-ink border-t border-hairline pt-3">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(cart.grandTotal)}</span>
            </div>

            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="mt-2 block"
            >
              <Button className="w-full flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight size={16} />
              </Button>
            </Link>

            <Link
              href="/cart"
              onClick={() => setIsCartOpen(false)}
              className="text-center text-[11px] uppercase tracking-micro text-muted hover:text-ink transition-colors py-1"
            >
              View Full Bag Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
