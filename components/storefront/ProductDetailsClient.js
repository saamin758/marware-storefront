"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import ProductGallery from "./ProductGallery";
import VariantSelector from "./VariantSelector";
import ProductAccordion from "./ProductAccordion";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useCart } from "@/context/CartContext";
import { Plus, Minus, Check, AlertCircle } from "lucide-react";

export default function ProductDetailsClient({ product, initialColor = null }) {
  const { addToCart, loading: cartLoading } = useCart();

  // Initialize with initialColor variant if provided, otherwise first in-stock or first variant
  const initialVariant = (() => {
    if (initialColor && product?.variants?.length > 0) {
      const byColor = product.variants.find(
        (v) => v.color?.toLowerCase() === initialColor.toLowerCase()
      );
      if (byColor) return byColor;
    }
    return (
      product?.variants?.find((v) => v.stockQuantity > 0) ||
      product?.variants?.[0] ||
      null
    );
  })();

  const [selectedVariant, setSelectedVariant] = useState(initialVariant);
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState(null);

  const isOutOfStock = !selectedVariant || selectedVariant.stockQuantity <= 0;
  const maxStock = selectedVariant?.stockQuantity || 0;

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > maxStock) return maxStock;
      return next;
    });
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setFeedback({ type: "error", message: "Please select size and color" });
      return;
    }

    if (isOutOfStock) {
      setFeedback({ type: "error", message: "This variant is out of stock" });
      return;
    }

    const result = await addToCart(selectedVariant.id, quantity);
    if (result.success) {
      setFeedback({ type: "success", message: "Added to shopping bag!" });
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: "error", message: result.error || "Failed to add" });
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
      {/* Left Column: Gallery (60% on desktop) with Real-Time Color Synchronization */}
      <div className="lg:col-span-7">
        <ProductGallery
          images={product.images}
          productName={product.name}
          selectedColor={selectedVariant?.color}
          selectedVariant={selectedVariant}
          onSelectColor={(colorName) => {
            const match =
              product.variants?.find(
                (v) =>
                  v.color?.toLowerCase() === colorName?.toLowerCase() &&
                  v.size === selectedVariant?.size
              ) ||
              product.variants?.find(
                (v) => v.color?.toLowerCase() === colorName?.toLowerCase()
              );
            if (match) {
              setSelectedVariant(match);
              setQuantity(1);
            }
          }}
        />
      </div>

      {/* Right Column: Sticky Purchase Details (40% on desktop) */}
      <div className="lg:col-span-5 flex flex-col justify-start">
        <div className="lg:sticky lg:top-28">
          {/* Category & Title */}
          {product.category?.name && (
            <p className="text-[11px] uppercase tracking-micro text-muted font-semibold mb-2">
              {product.category.name}
            </p>
          )}

          <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Price & Stock Status Row */}
          <div className="flex items-center justify-between pb-6 border-b border-hairline">
            <div className="flex items-center gap-3 tabular-nums">
              <span className="text-xl sm:text-2xl font-bold text-ink">
                {formatPrice(selectedVariant?.price || product.priceFrom)}
              </span>

              {selectedVariant?.compareAtPrice && (
                <span className="text-sm text-muted line-through">
                  {formatPrice(selectedVariant.compareAtPrice)}
                </span>
              )}
            </div>

            <div>
              {isOutOfStock ? (
                <Badge variant="soldout">Out of Stock</Badge>
              ) : selectedVariant && selectedVariant.stockQuantity <= 5 ? (
                <Badge variant="warning">
                  Only {selectedVariant.stockQuantity} Left
                </Badge>
              ) : (
                <Badge variant="success">In Stock</Badge>
              )}
            </div>
          </div>

          {/* Variant Selector (Color & Size) */}
          <VariantSelector
            variants={product.variants}
            selectedVariant={selectedVariant}
            onSelectVariant={(variant) => {
              setSelectedVariant(variant);
              setQuantity(1);
            }}
          />

          {/* Quantity & Add to Cart Controls */}
          <div className="flex flex-col gap-3 my-6">
            <div className="flex items-center gap-4">
              {/* Stepper */}
              <div className="flex items-center border border-hairline h-12">
                <button
                  type="button"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 h-full hover:bg-stone text-ink disabled:text-muted disabled:hover:bg-transparent cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-medium tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= maxStock || isOutOfStock}
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 h-full hover:bg-stone text-ink disabled:text-muted disabled:hover:bg-transparent cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Primary Add to Cart Button */}
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                disabled={isOutOfStock}
                loading={cartLoading}
                onClick={handleAddToCart}
              >
                {isOutOfStock ? "Sold Out" : "Add to Bag"}
              </Button>
            </div>

            {/* In-Line Feedback Alert */}
            {feedback && (
              <div
                className={`p-3 text-xs uppercase tracking-micro flex items-center gap-2 border ${
                  feedback.type === "success"
                    ? "bg-forest-light text-forest border-forest/30"
                    : "bg-destructive-light text-destructive border-destructive/30"
                }`}
              >
                {feedback.type === "success" ? (
                  <Check size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                <span>{feedback.message}</span>
              </div>
            )}
          </div>

          {/* Product Accordion (Fabric, Care, Shipping) */}
          <ProductAccordion product={product} />
        </div>
      </div>
    </div>
  );
}
