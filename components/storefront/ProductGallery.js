"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";

// Standard editorial color palette mapping for color badges & dots
const COLOR_PALETTE_MAP = {
  "classic white": "#FFFFFF",
  "white": "#FFFFFF",
  "midnight navy": "#1B2A4A",
  "navy": "#1B2A4A",
  "sandstone ivory": "#E8DFC8",
  "ivory": "#FAF4E8",
  "royal indigo": "#1F2D68",
  "indigo": "#1F2D68",
  "terracotta": "#C85A3B",
  "sage olive": "#6B7B58",
  "olive": "#6B7B58",
  "botanical teal": "#1B5E58",
  "teal": "#1B5E58",
  "espresso brown": "#321E14",
  "espresso": "#321E14",
  "brown": "#5C3D2E",
  "onyx black": "#111111",
  "black": "#111111",
  "midnight black": "#181818",
  "deep forest": "#1C3524",
  "forest": "#1C3524",
  "sand khaki": "#C2B280",
  "khaki": "#C2B280",
  "sand": "#D5C8A7",
  "warm alabaster": "#EBE7DF",
  "alabaster": "#EBE7DF",
  "grey": "#888888",
  "gray": "#888888",
  "charcoal": "#333333",
  "beige": "#E8D8C3",
  "cream": "#FFFDD0",
  "tan": "#D2B48C",
};

export function getSwatchColor(name) {
  if (!name) return "#E4E3DF";
  const key = name.trim().toLowerCase();
  return COLOR_PALETTE_MAP[key] || "#999999";
}

export default function ProductGallery({
  images = [],
  productName = "",
  selectedColor = null,
  selectedVariant = null,
  onSelectColor = null,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Automatically switch gallery image when selectedColor or selectedVariant changes!
  useEffect(() => {
    if (!images || images.length === 0) return;

    const targetColor = (selectedColor || selectedVariant?.color || "").trim().toLowerCase();
    const targetVariantImg = selectedVariant?.image;

    // 1. Check if variant has explicit image matching an image in gallery
    if (targetVariantImg) {
      const matchIdx = images.findIndex((img) => img.url === targetVariantImg);
      if (matchIdx !== -1 && matchIdx !== activeIndex) {
        switchImage(matchIdx);
        return;
      }
    }

    // 2. Check if any image has explicit color matching selectedColor
    if (targetColor) {
      const colorMatchIdx = images.findIndex(
        (img) => img.color && img.color.trim().toLowerCase() === targetColor
      );
      if (colorMatchIdx !== -1 && colorMatchIdx !== activeIndex) {
        switchImage(colorMatchIdx);
        return;
      }

      // 3. Check if image alt or name contains the color string
      const altMatchIdx = images.findIndex((img) => {
        const text = `${img.alt || ""} ${img.name || ""}`.toLowerCase();
        return text.includes(targetColor);
      });
      if (altMatchIdx !== -1 && altMatchIdx !== activeIndex) {
        switchImage(altMatchIdx);
        return;
      }
    }
  }, [selectedColor, selectedVariant?.color, selectedVariant?.image, images]);

  const switchImage = (newIdx) => {
    if (newIdx < 0 || newIdx >= images.length) return;
    setIsFading(true);
    setTimeout(() => {
      setActiveIndex(newIdx);
      setIsFading(false);
    }, 120);
  };

  const handleThumbnailClick = (idx) => {
    switchImage(idx);
    const clickedImg = images[idx];
    if (clickedImg?.color && onSelectColor && clickedImg.color !== selectedColor) {
      onSelectColor(clickedImg.color);
    }
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % images.length;
    handleThumbnailClick(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + images.length) % images.length;
    handleThumbnailClick(prevIdx);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-portrait bg-stone border border-hairline flex items-center justify-center text-muted">
        No Images Available
      </div>
    );
  }

  const activeImage = images[activeIndex] || images[0];
  const activeColor = activeImage?.color || selectedColor || null;
  const swatchHex = getSwatchColor(activeColor);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto flex-shrink-0 max-h-[640px] pb-2 md:pb-0 scrollbar-thin">
          {images.map((img, idx) => {
            const isCurrent = activeIndex === idx;
            const isMatchingActiveColor =
              activeColor &&
              img.color &&
              img.color.toLowerCase() === activeColor.toLowerCase();

            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => handleThumbnailClick(idx)}
                aria-label={`View photo ${idx + 1}`}
                className={`relative w-16 sm:w-20 aspect-portrait bg-stone border flex-shrink-0 transition-all cursor-pointer group ${
                  isCurrent
                    ? "border-ink ring-2 ring-ink"
                    : isMatchingActiveColor
                    ? "border-neutral-400 hover:border-ink"
                    : "border-hairline opacity-75 hover:opacity-100 hover:border-muted"
                }`}
              >
                <img
                  src={img.url}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />

                {/* Subtle color dot badge on thumbnail if image has color */}
                {img.color && (
                  <span
                    className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: getSwatchColor(img.color) }}
                    title={img.color}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Large Stage */}
      <div className="flex-1 relative aspect-portrait bg-stone border border-hairline overflow-hidden group">
        <img
          src={activeImage.url}
          alt={activeImage.alt || productName}
          className={`w-full h-full object-cover object-top transition-opacity duration-200 ${
            isFading ? "opacity-30" : "opacity-100"
          }`}
        />

        {/* Live Color Badge Indicator on photograph */}
        {activeColor && (
          <div className="absolute top-3.5 right-3.5 bg-surface/90 backdrop-blur-md border border-hairline px-3 py-1.5 text-[10px] uppercase tracking-micro font-semibold text-ink flex items-center gap-2 shadow-sm transition-opacity">
            <span
              className="w-2.5 h-2.5 rounded-full border border-neutral-300"
              style={{ backgroundColor: swatchHex }}
            />
            <span>{activeColor}</span>
          </div>
        )}

        {/* Prev / Next controls for multi-image gallery */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-surface/80 hover:bg-surface border border-hairline text-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-surface/80 hover:bg-surface border border-hairline text-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Counter Pill in bottom-left */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-0.5 text-[10px] uppercase tracking-micro font-mono">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}
