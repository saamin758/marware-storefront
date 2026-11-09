"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCategories } from "@/services/api/catalog";
import { createProduct } from "@/services/api/admin";
import Button from "@/components/ui/Button";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  CheckCircle2,
  Trash2,
  Eye,
  Plus,
  Star,
  Layers,
  Sparkles,
  AlertCircle,
  Check,
} from "lucide-react";

export default function AdminNewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Image source mode: "upload" (file) or "url" (web link)
  const [imageMode, setImageMode] = useState("upload");
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  // Multiple Images Gallery List
  const [galleryImages, setGalleryImages] = useState([
    {
      id: "img-init-1",
      url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop",
      name: "Front Angle",
      size: "Preset CDN",
      isPrimary: true,
    },
    {
      id: "img-init-2",
      url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop",
      name: "Hover Alternate Angle",
      size: "Preset CDN",
      isPrimary: false,
    },
  ]);

  // General Form Data
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    priceFrom: "",
    compareAtPriceFrom: "",
    color: "Standard",
    fabric: "",
    fit: "Tailored Standard",
    careInstructions: "Machine wash cold. Gentle iron.",
    description: "",
    defaultStock: 20,
  });

  // Size Configuration State
  const commonSizePresets = {
    apparel: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    waist: ["28", "30", "32", "34", "36", "38"],
    footwear: ["39", "40", "41", "42", "43", "44", "45"],
    universal: ["One Size"],
  };

  const [activeSizeCategory, setActiveSizeCategory] = useState("apparel");
  const [selectedSizes, setSelectedSizes] = useState([
    { size: "S", stock: 15, active: true },
    { size: "M", stock: 25, active: true },
    { size: "L", stock: 25, active: true },
    { size: "XL", stock: 15, active: true },
  ]);
  const [customSizeInput, setCustomSizeInput] = useState("");

  // Preset fast-fill templates
  const presets = [
    {
      label: "Men's Formal Oxford",
      name: "Supima Cotton Oxford Shirt",
      fabric: "100% Supima Long-Staple Cotton",
      price: "3450",
      categorySlug: "men",
      color: "Classic White",
      sizes: ["S", "M", "L", "XL", "XXL"],
      images: [
        {
          id: "p1-1",
          url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop",
          name: "Front Portrait",
          isPrimary: true,
        },
        {
          id: "p1-2",
          url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop",
          name: "Collar Detail",
          isPrimary: false,
        },
        {
          id: "p1-3",
          url: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=1000&auto=format&fit=crop",
          name: "Fabric Texture",
          isPrimary: false,
        },
      ],
    },
    {
      label: "Women's Linen Kurti",
      name: "Handwoven Linen Embroidered Kurti",
      fabric: "100% Pure Organic Linen",
      price: "4250",
      categorySlug: "women",
      color: "Natural Beige",
      sizes: ["XS", "S", "M", "L", "XL"],
      images: [
        {
          id: "p2-1",
          url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop",
          name: "Front Look",
          isPrimary: true,
        },
        {
          id: "p2-2",
          url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop",
          name: "Full Silhouette",
          isPrimary: false,
        },
      ],
    },
    {
      label: "Leather Messenger Bag",
      name: "Full-Grain Leather Crossbody Satchel",
      fabric: "100% Vegetable-Tanned Cowhide",
      price: "6800",
      categorySlug: "lifestyle",
      color: "Antique Tan",
      sizes: ["One Size"],
      images: [
        {
          id: "p3-1",
          url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop",
          name: "Front View",
          isPrimary: true,
        },
        {
          id: "p3-2",
          url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
          name: "Strap & Buckle",
          isPrimary: false,
        },
      ],
    },
  ];

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data || []);
      if (data && data.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
      }
    });
  }, []);

  // Multi-File Upload Processing (Converts Files to Real-Time Data URLs)
  const processFiles = (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const validFiles = Array.from(fileList).filter((f) => {
      if (!f.type.startsWith("image/")) {
        setError("Only valid image files (PNG, JPG, WEBP, AVIF) are accepted.");
        return false;
      }
      if (f.size > 10 * 1024 * 1024) {
        setError(`File "${f.name}" exceeds 10MB limit.`);
        return false;
      }
      return true;
    });

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setGalleryImages((prev) => {
          const isFirstEver = prev.length === 0;
          return [
            ...prev,
            {
              id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              url: dataUrl,
              name: file.name,
              size: (file.size / 1024).toFixed(1) + " KB",
              isPrimary: isFirstEver,
            },
          ];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // Add Image via Direct Web URL
  const handleAddUrlImage = () => {
    if (!urlInput.trim()) return;
    const newImg = {
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      url: urlInput.trim(),
      name: `Photo #${galleryImages.length + 1}`,
      size: "Web Link",
      isPrimary: galleryImages.length === 0,
    };
    setGalleryImages((prev) => [...prev, newImg]);
    setUrlInput("");
  };

  // Set Primary Cover Photo
  const setPrimaryImage = (id) => {
    setGalleryImages((prev) =>
      prev.map((img) => ({
        ...img,
        isPrimary: img.id === id,
      }))
    );
  };

  // Remove an Image from Gallery
  const removeImage = (id) => {
    setGalleryImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Toggle Size in Selected Sizes
  const handleToggleSize = (sizeName) => {
    setSelectedSizes((prev) => {
      const existing = prev.find((s) => s.size === sizeName);
      if (existing) {
        return prev.filter((s) => s.size !== sizeName);
      } else {
        return [
          ...prev,
          {
            size: sizeName,
            stock: parseInt(formData.defaultStock, 10) || 20,
            active: true,
          },
        ];
      }
    });
  };

  // Add Custom Size
  const handleAddCustomSize = (e) => {
    e.preventDefault();
    const trimmed = customSizeInput.trim().toUpperCase();
    if (!trimmed) return;
    if (selectedSizes.some((s) => s.size === trimmed)) {
      setCustomSizeInput("");
      return;
    }
    setSelectedSizes((prev) => [
      ...prev,
      {
        size: trimmed,
        stock: parseInt(formData.defaultStock, 10) || 20,
        active: true,
      },
    ]);
    setCustomSizeInput("");
  };

  // Update Stock for a specific size
  const handleStockChange = (sizeName, newStock) => {
    setSelectedSizes((prev) =>
      prev.map((s) =>
        s.size === sizeName
          ? { ...s, stock: Math.max(0, parseInt(newStock, 10) || 0) }
          : s
      )
    );
  };

  // Apply default stock to all selected sizes
  const handleApplyDefaultStockToAll = () => {
    const defaultQty = parseInt(formData.defaultStock, 10) || 20;
    setSelectedSizes((prev) =>
      prev.map((s) => ({
        ...s,
        stock: defaultQty,
      }))
    );
  };

  // Preset Selection
  const handleApplyPreset = (preset) => {
    const matchedCategory = categories.find(
      (c) => c.slug.toLowerCase() === preset.categorySlug.toLowerCase()
    );
    setFormData((prev) => ({
      ...prev,
      name: preset.name,
      fabric: preset.fabric,
      priceFrom: preset.price,
      color: preset.color,
      categoryId: matchedCategory ? matchedCategory.id : prev.categoryId,
    }));
    setGalleryImages(preset.images);
    setSelectedSizes(
      preset.sizes.map((sz) => ({
        size: sz,
        stock: 20,
        active: true,
      }))
    );
  };

  // Calculate Primary and Secondary Images for Storefront Card Preview
  const primaryImg =
    galleryImages.find((img) => img.isPrimary) || galleryImages[0] || null;
  const secondaryImg =
    galleryImages.find((img) => img.id !== primaryImg?.id) || null;

  // Calculate Total Combined Inventory
  const totalCalculatedStock = selectedSizes.reduce(
    (sum, s) => sum + (parseInt(s.stock, 10) || 0),
    0
  );

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.categoryId || !formData.priceFrom) {
      setError("Please fill out product title, category, and base price.");
      return;
    }

    if (galleryImages.length === 0) {
      setError("Please upload at least one product photo.");
      return;
    }

    if (selectedSizes.length === 0) {
      setError("Please select at least one size for the product.");
      return;
    }

    try {
      setLoading(true);

      const activePrimary = primaryImg || galleryImages[0];

      // Format Images Array
      const imagesArray = galleryImages.map((img, idx) => ({
        id: img.id || `img-${Date.now()}-${idx}`,
        url: img.url,
        alt: `${formData.name} - ${img.name || `View ${idx + 1}`}`,
        color: img.color || formData.color || "Standard",
        isPrimary: img.id === activePrimary.id,
      }));

      // Generate Variants Array with Selected Sizes and Individual Stock
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const variantsArray = selectedSizes.map((sz, idx) => ({
        id: `var-${Date.now()}-${sz.size.toLowerCase()}-${idx}`,
        sku: `${slug.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}-${sz.size}`,
        size: sz.size,
        color: formData.color || "Standard",
        image: activePrimary.url,
        price: formData.priceFrom,
        compareAtPrice: formData.compareAtPriceFrom || null,
        stockQuantity: parseInt(sz.stock, 10) || 0,
        isActive: true,
      }));

      await createProduct({
        name: formData.name,
        categoryId: formData.categoryId,
        priceFrom: formData.priceFrom,
        compareAtPriceFrom: formData.compareAtPriceFrom || null,
        description: formData.description,
        fabric: formData.fabric,
        fit: formData.fit,
        careInstructions: formData.careInstructions,
        primaryImage: {
          url: activePrimary.url,
          alt: formData.name,
        },
        images: imagesArray,
        variants: variantsArray,
      });

      router.push("/ecstasy-ops-vault-8821/products");
    } catch (err) {
      setError(err.message || "Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl font-sans">
      {/* Top Header */}
      <div className="mb-6 pb-4 border-b border-hairline">
        <Link
          href="/ecstasy-ops-vault-8821/products"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-micro text-muted hover:text-ink transition-colors mb-3"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-editorial text-3xl font-bold text-ink">
              Add New Product
            </h1>
            <p className="text-muted text-xs uppercase tracking-micro mt-1">
              Configure apparel details, custom size matrix & multi-angle photography
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-micro text-muted font-semibold mr-1">
              Quick Presets:
            </span>
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1 text-[10px] uppercase tracking-micro bg-stone hover:bg-neutral-200 text-ink border border-hairline font-medium transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-destructive-light text-destructive border border-destructive/30 text-xs flex items-center gap-2 font-medium">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Product Details & Size Matrix (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* General Info Card */}
            <div className="bg-surface border border-hairline p-6 sm:p-8 space-y-5">
              <div className="border-b border-hairline pb-3">
                <h2 className="text-xs uppercase tracking-micro font-bold text-ink">
                  General Product Information
                </h2>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-micro font-medium text-ink mb-1.5">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Fine Poplin Regular Fit Shirt"
                  className="w-full h-12 px-4 text-sm border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-micro font-medium text-ink mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full h-12 px-4 text-xs uppercase tracking-micro border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-micro font-medium text-ink mb-1.5">
                    Base Price (BDT / ৳) *
                  </label>
                  <input
                    type="number"
                    step="50"
                    value={formData.priceFrom}
                    onChange={(e) =>
                      setFormData({ ...formData, priceFrom: e.target.value })
                    }
                    placeholder="2450"
                    className="w-full h-12 px-4 text-sm border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink tabular-nums"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-micro font-medium text-ink mb-1.5">
                    Compare At Price (BDT ৳)
                  </label>
                  <input
                    type="number"
                    step="50"
                    value={formData.compareAtPriceFrom}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        compareAtPriceFrom: e.target.value,
                      })
                    }
                    placeholder="Optional (e.g. 2950 for sale)"
                    className="w-full h-12 px-4 text-sm border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-micro font-medium text-ink mb-1.5">
                    Color Variation
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    placeholder="e.g. Navy Blue, Ecru, Black"
                    className="w-full h-12 px-4 text-sm border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-micro font-medium text-ink mb-1.5">
                  Fabric Composition
                </label>
                <input
                  type="text"
                  value={formData.fabric}
                  onChange={(e) =>
                    setFormData({ ...formData, fabric: e.target.value })
                  }
                  placeholder="e.g. 100% Giza Cotton, Twill Weave"
                  className="w-full h-12 px-4 text-sm border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-micro font-medium text-ink mb-1.5">
                  Product Description & Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Detailed tailoring, silhouette and textile notes..."
                  className="w-full p-3 text-sm border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink"
                />
              </div>
            </div>

            {/* Size & Inventory Matrix Card (User Request #2) */}
            <div className="bg-surface border border-hairline p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <div>
                  <h2 className="text-xs uppercase tracking-micro font-bold text-ink">
                    Size Matrix & Stock Levels
                  </h2>
                  <p className="text-[11px] text-muted mt-0.5">
                    Select sizes available for this item and define inventory per size
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-micro text-muted block">
                    Total Inventory:
                  </span>
                  <span className="font-editorial text-lg font-bold text-ink tabular-nums">
                    {totalCalculatedStock} units
                  </span>
                </div>
              </div>

              {/* Size Category Presets */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] uppercase tracking-micro font-semibold text-muted">
                    Pick Sizes to Enable:
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveSizeCategory("apparel")}
                      className={`text-[10px] uppercase tracking-micro px-2 py-0.5 border ${
                        activeSizeCategory === "apparel"
                          ? "bg-ink text-surface border-ink font-bold"
                          : "bg-canvas text-muted border-hairline"
                      }`}
                    >
                      Apparel
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSizeCategory("waist")}
                      className={`text-[10px] uppercase tracking-micro px-2 py-0.5 border ${
                        activeSizeCategory === "waist"
                          ? "bg-ink text-surface border-ink font-bold"
                          : "bg-canvas text-muted border-hairline"
                      }`}
                    >
                      Waist
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSizeCategory("footwear")}
                      className={`text-[10px] uppercase tracking-micro px-2 py-0.5 border ${
                        activeSizeCategory === "footwear"
                          ? "bg-ink text-surface border-ink font-bold"
                          : "bg-canvas text-muted border-hairline"
                      }`}
                    >
                      Footwear
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSizeCategory("universal")}
                      className={`text-[10px] uppercase tracking-micro px-2 py-0.5 border ${
                        activeSizeCategory === "universal"
                          ? "bg-ink text-surface border-ink font-bold"
                          : "bg-canvas text-muted border-hairline"
                      }`}
                    >
                      Free Size
                    </button>
                  </div>
                </div>

                {/* Size Chips */}
                <div className="flex flex-wrap gap-2 p-3 bg-stone/30 border border-hairline">
                  {commonSizePresets[activeSizeCategory]?.map((sz) => {
                    const isSelected = selectedSizes.some((s) => s.size === sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleToggleSize(sz)}
                        className={`h-9 px-3.5 text-xs font-semibold uppercase tracking-micro border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-ink text-surface border-ink shadow-sm"
                            : "bg-surface text-ink border-hairline hover:border-ink"
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                        <span>{sz}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Size Adder */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customSizeInput}
                  onChange={(e) => setCustomSizeInput(e.target.value)}
                  placeholder="Or enter custom size (e.g. 42R, 2XL, Custom)..."
                  className="flex-1 h-10 px-3 text-xs uppercase tracking-micro border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSize}
                  className="h-10 px-4 bg-stone hover:bg-neutral-200 text-ink text-xs uppercase tracking-micro font-semibold border border-hairline flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus size={14} /> Add Size
                </button>
              </div>

              {/* Active Sizes Breakdown Table */}
              <div className="border border-hairline">
                <div className="bg-stone/50 px-4 py-2.5 border-b border-hairline flex items-center justify-between text-[10px] uppercase tracking-micro text-muted font-semibold">
                  <span>Selected Size</span>
                  <div className="flex items-center gap-4">
                    <span>Stock Quantity</span>
                    <button
                      type="button"
                      onClick={handleApplyDefaultStockToAll}
                      className="text-sale hover:underline font-bold"
                    >
                      Apply 20 to All
                    </button>
                  </div>
                </div>

                {selectedSizes.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted">
                    No sizes selected yet. Click the size chips above to add sizes.
                  </div>
                ) : (
                  <div className="divide-y divide-hairline bg-surface max-h-64 overflow-y-auto">
                    {selectedSizes.map((sz) => (
                      <div
                        key={sz.size}
                        className="px-4 py-2.5 flex items-center justify-between hover:bg-stone/20"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-10 h-7 bg-stone border border-hairline flex items-center justify-center text-xs font-bold text-ink uppercase">
                            {sz.size}
                          </span>
                          <span className="text-xs text-muted">Variant Size</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              value={sz.stock}
                              onChange={(e) =>
                                handleStockChange(sz.size, e.target.value)
                              }
                              className="w-20 h-8 px-2 text-xs text-center border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink tabular-nums font-semibold"
                            />
                            <span className="text-[10px] text-muted">pcs</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleSize(sz.size)}
                            title="Remove size"
                            className="text-muted hover:text-destructive p-1 transition-colors cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Image Gallery & Live Card Preview (5 Cols) (User Request #3) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface border border-hairline p-6">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-hairline">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-ink" />
                  <h2 className="text-xs uppercase tracking-micro font-bold text-ink">
                    Photo Gallery ({galleryImages.length} Images)
                  </h2>
                </div>
                <span className="text-[10px] uppercase tracking-micro text-sale font-bold">
                  3:4 Portrait
                </span>
              </div>

              {/* Mode Toggle: File Upload vs URL Link */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setImageMode("upload")}
                  className={`flex items-center justify-center gap-1.5 py-2 text-[10px] uppercase tracking-micro font-bold border transition-colors cursor-pointer ${
                    imageMode === "upload"
                      ? "bg-ink text-surface border-ink"
                      : "bg-canvas text-muted border-hairline hover:text-ink hover:bg-stone"
                  }`}
                >
                  <Upload size={12} /> Upload Multiple Files
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode("url")}
                  className={`flex items-center justify-center gap-1.5 py-2 text-[10px] uppercase tracking-micro font-bold border transition-colors cursor-pointer ${
                    imageMode === "url"
                      ? "bg-ink text-surface border-ink"
                      : "bg-canvas text-muted border-hairline hover:text-ink hover:bg-stone"
                  }`}
                >
                  <LinkIcon size={12} /> Add by Image URL
                </button>
              </div>

              {/* Mode A: Drag & Drop Multi-File Upload */}
              {imageMode === "upload" ? (
                <div>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                      dragActive
                        ? "border-ink bg-stone/50 scale-[1.01]"
                        : "border-hairline hover:border-ink bg-canvas"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,image/webp,image/avif"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          processFiles(e.target.files);
                        }
                      }}
                      className="hidden"
                    />

                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-stone flex items-center justify-center text-ink">
                        <Upload size={18} />
                      </div>
                      <p className="text-xs font-semibold text-ink uppercase tracking-micro">
                        Click to Choose Multiple Photos
                      </p>
                      <p className="text-[10px] text-muted max-w-[220px]">
                        Select one or more files at once, or drag & drop here (PNG, JPG, WEBP)
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Mode B: Add Image via URL */
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 h-10 px-3 text-xs border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrlImage}
                      className="h-10 px-3 bg-ink text-surface text-xs uppercase tracking-micro font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                  <p className="text-[10px] text-muted">
                    Paste external HTTPS image URLs one by one to append to the gallery.
                  </p>
                </div>
              )}

              {/* Uploaded Images List & Primary Cover Chooser */}
              <div className="mt-5 pt-4 border-t border-hairline">
                <div className="flex items-center justify-between mb-3 text-[10px] uppercase tracking-micro text-muted font-semibold">
                  <span>Photo Gallery Angles ({galleryImages.length}):</span>
                  <span className="text-sale font-bold">★ Click star to set Primary</span>
                </div>

                {galleryImages.length === 0 ? (
                  <div className="p-4 bg-stone/30 border border-hairline text-center text-xs text-muted">
                    No images added. Please upload or paste at least one photo.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2.5 max-h-72 overflow-y-auto p-1">
                    {galleryImages.map((img, idx) => {
                      const isCover = img.isPrimary;
                      return (
                        <div
                          key={img.id || idx}
                          className={`relative aspect-portrait bg-stone border overflow-hidden group select-none transition-all ${
                            isCover
                              ? "border-ink ring-2 ring-ink"
                              : "border-hairline hover:border-muted"
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={img.name}
                            className="w-full h-full object-cover object-top"
                          />

                          {/* Cover Badge */}
                          {isCover && (
                            <div className="absolute top-1 left-1 bg-ink text-surface text-[8px] uppercase tracking-micro font-bold px-1 py-0.2 shadow">
                              Cover #1
                            </div>
                          )}

                          {/* Actions Overlay */}
                          <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5 text-surface">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => removeImage(img.id)}
                                title="Remove photo"
                                className="p-1 bg-destructive text-surface hover:bg-destructive-dark transition-colors cursor-pointer"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>

                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => setPrimaryImage(img.id)}
                                className="w-full py-1 bg-surface text-ink text-[8px] uppercase tracking-micro font-bold hover:bg-amber-100 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              >
                                <Star size={10} className="fill-amber text-amber" />
                                Make Cover
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Live Fashion Storefront 3:4 Card Preview */}
              <div className="mt-6 pt-6 border-t border-hairline">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-micro text-muted font-bold flex items-center gap-1">
                    <Eye size={12} /> Live Storefront Card Preview
                  </span>
                  <span className="text-[9px] uppercase tracking-micro text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
                    Aspect 3:4 (Hover Active)
                  </span>
                </div>

                <div className="w-full aspect-portrait bg-stone border border-hairline overflow-hidden relative group select-none">
                  {primaryImg ? (
                    <img
                      src={primaryImg.url}
                      alt="Primary cover angle"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-muted">
                      <ImageIcon size={32} className="stroke-1 mb-2 opacity-50" />
                      <span className="text-xs uppercase tracking-micro">
                        No Photos Uploaded
                      </span>
                    </div>
                  )}

                  {/* Secondary hover image crossfade if available */}
                  {secondaryImg && (
                    <img
                      src={secondaryImg.url}
                      alt="Secondary hover angle"
                      className="absolute inset-0 w-full h-full object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  )}

                  {formData.compareAtPriceFrom && (
                    <span className="absolute top-2 left-2 bg-sale text-surface text-[9px] uppercase tracking-micro font-bold px-1.5 py-0.5">
                      SALE
                    </span>
                  )}
                </div>

                <div className="mt-2 text-center">
                  <p className="text-xs font-bold text-ink truncate">
                    {formData.name || "Untitled Product"}
                  </p>
                  <p className="text-xs font-semibold text-ink tabular-nums mt-0.5">
                    ৳{formData.priceFrom || "0"}
                  </p>
                  <p className="text-[10px] text-muted mt-0.5">
                    Available in {selectedSizes.length} sizes • {galleryImages.length} photos
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} /> Publish Product to Catalog
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
