"use client";

import { Check } from "lucide-react";
import { getSwatchColor } from "./ProductGallery";

export default function VariantSelector({
  variants = [],
  selectedVariant,
  onSelectVariant,
}) {
  // Extract unique colors and sizes
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))];
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];

  const handleColorChange = (color) => {
    // Find variant with this color and current size, or first variant of this color
    const match =
      variants.find(
        (v) => v.color === color && v.size === selectedVariant?.size
      ) || variants.find((v) => v.color === color);
    if (match) {
      onSelectVariant(match);
    }
  };

  const handleSizeChange = (size) => {
    // Find variant with current color and this size, or first variant of this size
    const match =
      variants.find(
        (v) => v.size === size && v.color === selectedVariant?.color
      ) || variants.find((v) => v.size === size);
    if (match) {
      onSelectVariant(match);
    }
  };

  return (
    <div className="flex flex-col gap-6 my-6">
      {/* Color Selection with Visual Swatches */}
      {colors.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] uppercase tracking-micro text-ink font-semibold flex items-center gap-2">
              <span>Color:</span>
              <span className="font-bold text-ink underline decoration-1 underline-offset-4">
                {selectedVariant?.color || "Select Color"}
              </span>
            </span>
            <span className="text-[10px] uppercase tracking-micro text-muted">
              {colors.length} {colors.length === 1 ? "Color" : "Colors"} Available
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {colors.map((color) => {
              const isSelected = selectedVariant?.color === color;
              const swatchColor = getSwatchColor(color);
              const isWhiteOrLight =
                swatchColor === "#FFFFFF" || swatchColor === "#FAF4E8" || swatchColor === "#FFFDD0";

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorChange(color)}
                  className={`group relative flex items-center gap-2.5 h-11 px-4 text-xs font-semibold uppercase tracking-micro border transition-all cursor-pointer ${
                    isSelected
                      ? "border-ink bg-ink text-surface shadow-sm ring-1 ring-ink"
                      : "border-hairline bg-surface text-ink hover:border-ink hover:bg-stone/20"
                  }`}
                >
                  {/* Color Swatch Dot */}
                  <span
                    className={`w-3.5 h-3.5 rounded-full flex-shrink-0 transition-transform ${
                      isWhiteOrLight ? "border border-neutral-300" : "border border-transparent"
                    } ${
                      isSelected
                        ? "scale-110 ring-2 ring-surface ring-offset-1 ring-offset-ink"
                        : "group-hover:scale-110"
                    }`}
                    style={{ backgroundColor: swatchColor }}
                  />

                  <span>{color}</span>

                  {isSelected && (
                    <Check size={13} className="stroke-[2.5] ml-0.5 text-surface" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {sizes.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-[11px] uppercase tracking-micro text-ink font-semibold">
              Size: <span className="font-normal text-muted">{selectedVariant?.size || "Select Size"}</span>
            </span>
            <span className="text-[11px] uppercase tracking-micro text-muted underline cursor-pointer hover:text-ink">
              Size Guide
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {sizes.map((size) => {
              const variantForSize = variants.find(
                (v) =>
                  v.size === size &&
                  (!selectedVariant?.color || v.color === selectedVariant.color)
              );
              const isOutOfStock = variantForSize ? variantForSize.stockQuantity <= 0 : false;
              const isSelected = selectedVariant?.size === size;

              return (
                <button
                  key={size}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => handleSizeChange(size)}
                  className={`h-11 flex items-center justify-center text-xs font-medium uppercase tracking-micro border transition-all relative cursor-pointer ${
                    isSelected
                      ? "border-ink bg-ink text-surface"
                      : isOutOfStock
                      ? "border-hairline bg-stone text-muted/50 cursor-not-allowed line-through"
                      : "border-hairline bg-surface text-ink hover:border-muted"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
