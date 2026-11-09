"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { getSwatchColor } from "./ProductGallery";

export default function ProductCard({ product }) {
  if (!product) return null;

  const isSoldOut = !product.inStock;
  const isOnSale = product.onSale || !!product.compareAtPriceFrom;
  const defaultPrimaryImg = product.primaryImage?.url || product.images?.[0]?.url;
  const defaultSecondaryImg = product.images?.[1]?.url || defaultPrimaryImg;

  // Extract distinct color variants and their corresponding images
  const colorOptions = (() => {
    const list = [];
    const seen = new Set();
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((v) => {
        if (v.color && !seen.has(v.color.trim().toLowerCase())) {
          seen.add(v.color.trim().toLowerCase());
          const matchedImg =
            v.image ||
            product.images?.find(
              (img) =>
                img.color &&
                img.color.trim().toLowerCase() === v.color.trim().toLowerCase()
            )?.url ||
            defaultPrimaryImg;

          list.push({
            color: v.color,
            image: matchedImg,
          });
        }
      });
    }
    return list;
  })();

  const [activeColor, setActiveColor] = useState(
    colorOptions.length > 0 ? colorOptions[0].color : null
  );

  // Active displayed image based on color selection
  const currentDisplayedImg = (() => {
    if (activeColor) {
      const match = colorOptions.find(
        (c) => c.color.toLowerCase() === activeColor.toLowerCase()
      );
      if (match?.image) return match.image;
    }
    return defaultPrimaryImg;
  })();

  // Calculate discount percentage if available
  let discountPercent = null;
  if (isOnSale && product.compareAtPriceFrom) {
    const current = parseFloat(product.priceFrom);
    const original = parseFloat(product.compareAtPriceFrom);
    if (original > current) {
      discountPercent = Math.round(((original - current) / original) * 100);
    }
  }

  // Link target with preselected color parameter
  const productHref = activeColor
    ? `/products/${product.slug}?color=${encodeURIComponent(activeColor)}`
    : `/products/${product.slug}`;

  return (
    <article className="group flex flex-col">
      {/* 3:4 Portrait Image Frame */}
      <Link
        href={productHref}
        className="relative w-full aspect-portrait bg-stone overflow-hidden border border-hairline block"
      >
        {currentDisplayedImg && (
          <img
            src={currentDisplayedImg}
            alt={product.primaryImage?.alt || product.name}
            className="w-full h-full object-cover object-top transition-all duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* Hover image crossfade only if no explicit color is hovered and secondary exists */}
        {!activeColor && defaultSecondaryImg && defaultSecondaryImg !== defaultPrimaryImg && (
          <img
            src={defaultSecondaryImg}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover object-top opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
            loading="lazy"
          />
        )}

        {/* Status Badge Overlays */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {isSoldOut ? (
            <Badge variant="soldout">Sold Out</Badge>
          ) : isOnSale ? (
            <Badge variant="sale">
              {discountPercent ? `-${discountPercent}%` : "Sale"}
            </Badge>
          ) : null}
        </div>
      </Link>

      {/* Product Information */}
      <div className="pt-3 pb-2 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Title */}
          {product.category?.name && (
            <p className="text-[10px] uppercase tracking-micro text-muted font-medium mb-1">
              {product.category.name}
            </p>
          )}

          <h3 className="text-sm font-medium text-ink group-hover:underline line-clamp-1">
            <Link href={productHref}>{product.name}</Link>
          </h3>

          {/* Color Swatch Dots on Card (if more than 1 color) */}
          {colorOptions.length > 1 && (
            <div className="flex items-center gap-1.5 mt-2">
              {colorOptions.map((opt) => {
                const isSelected =
                  activeColor?.toLowerCase() === opt.color.toLowerCase();
                const hex = getSwatchColor(opt.color);
                const isLight =
                  hex === "#FFFFFF" || hex === "#FAF4E8" || hex === "#FFFDD0";

                return (
                  <button
                    key={opt.color}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveColor(opt.color);
                    }}
                    onMouseEnter={() => setActiveColor(opt.color)}
                    aria-label={`Select color ${opt.color}`}
                    title={opt.color}
                    className={`relative w-3.5 h-3.5 rounded-full transition-transform cursor-pointer ${
                      isLight ? "border border-neutral-300" : "border border-transparent"
                    } ${
                      isSelected
                        ? "scale-125 ring-1 ring-ink ring-offset-1"
                        : "hover:scale-110 opacity-80 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                );
              })}
              <span className="text-[9px] uppercase tracking-micro text-muted ml-1">
                {activeColor || `${colorOptions.length} colors`}
              </span>
            </div>
          )}
        </div>

        {/* Price Row */}
        <div className="flex items-center gap-2 mt-2 tabular-nums">
          <span
            className={`text-sm font-semibold ${
              isOnSale ? "text-sale" : "text-ink"
            }`}
          >
            {formatPrice(product.priceFrom)}
          </span>

          {product.compareAtPriceFrom && (
            <span className="text-xs text-muted line-through">
              {formatPrice(product.compareAtPriceFrom)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
