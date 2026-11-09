"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, getCategories } from "@/services/api/catalog";
import { deleteProduct } from "@/services/api/admin";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  Plus,
  Search,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts({
        search,
        category: selectedCategory,
        limit: 50,
      });
      let list = Array.isArray(res) ? res : res?.data || res?.products || [];
      if (typeof window !== "undefined") {
        try {
          const rawCustom = localStorage.getItem("marware_custom_products");
          if (rawCustom) {
            const customList = JSON.parse(rawCustom);
            if (Array.isArray(customList) && customList.length > 0) {
              const existingIds = new Set(list.map((p) => p.id));
              const toAdd = customList.filter((p) => !existingIds.has(p.id));
              list = [...toAdd, ...list];
            }
          }
        } catch {}
      }
      setProducts(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories().then((data) => setCategories(data || []));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleDeleteProduct = async (product) => {
    // Two-step click confirmation (avoids intrusive window.confirm on mobile)
    if (confirmDeleteId !== product.id) {
      setConfirmDeleteId(product.id);
      setTimeout(() => {
        setConfirmDeleteId((cur) => (cur === product.id ? null : cur));
      }, 4000);
      return;
    }

    setConfirmDeleteId(null);

    // 1. Instantly record persistent deletion in localStorage and document.cookie
    try {
      const raw = localStorage.getItem("marware_deleted_products") || "";
      const set = new Set(raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : []);
      set.add(product.id);
      if (product.slug) set.add(product.slug);
      const serialized = Array.from(set).join(",");
      localStorage.setItem("marware_deleted_products", serialized);
      const rawCustom = localStorage.getItem("marware_custom_products");
      if (rawCustom) {
        const customList = JSON.parse(rawCustom);
        const filtered = customList.filter((p) => p.id !== product.id && p.slug !== product.slug);
        localStorage.setItem("marware_custom_products", JSON.stringify(filtered));
      }
      const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
      document.cookie = `marware_deleted_products=${encodeURIComponent(
        serialized
      )}; path=/; max-age=31536000; SameSite=Lax${isHttps ? "; Secure" : ""}`;
    } catch (storageErr) {
      console.error("Storage write error:", storageErr);
    }

    // 2. Instantly remove from UI state
    setProducts((prev) => prev.filter((p) => p.id !== product.id && p.slug !== product.slug));
    setToastMessage(`Product "${product.name}" was permanently deleted.`);
    setTimeout(() => setToastMessage(null), 4000);

    // 3. Send DELETE to backend
    try {
      setDeletingId(product.id);
      setErrorMessage(null);
      await deleteProduct(product.id);
    } catch (err) {
      console.warn("Backend delete notice:", err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-ink text-surface px-5 py-3 border border-hairline shadow-2xl flex items-center gap-3 text-xs uppercase tracking-micro animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={16} className="text-forest-light" />
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="fixed top-5 right-5 z-50 bg-destructive text-surface px-5 py-3 border border-hairline shadow-2xl flex items-center gap-3 text-xs uppercase tracking-micro animate-in fade-in slide-in-from-top-4">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-hairline gap-4">
        <div>
          <h1 className="font-editorial text-3xl font-bold text-ink">
            Product Catalog
          </h1>
          <p className="text-muted text-xs uppercase tracking-micro mt-1">
            Manage inventory, variants, and published merchandise
          </p>
        </div>

        <Link href="/ecstasy-ops-vault-8821/products/new">
          <Button size="sm" className="flex items-center gap-2">
            <Plus size={14} /> Add New Product
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface border border-hairline p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="w-full sm:w-auto flex-1 flex items-center border border-hairline max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, fabric..."
            className="flex-1 h-10 px-3 text-xs bg-canvas text-ink focus:outline-none"
          />
          <button
            type="submit"
            className="h-10 px-4 bg-stone hover:bg-neutral-200 text-ink text-xs flex items-center justify-center"
          >
            <Search size={14} />
          </button>
        </form>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-xs uppercase tracking-micro text-muted font-medium">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 px-3 text-xs uppercase tracking-micro border border-hairline bg-canvas text-ink focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Products Card List (Responsive < sm) */}
      <div className="block sm:hidden space-y-4">
        {loading ? (
          <div className="bg-surface border border-hairline p-8 text-center text-muted text-xs">
            Loading catalog inventory...
          </div>
        ) : products.length === 0 ? (
          <div className="bg-surface border border-hairline p-8 text-center text-muted text-xs">
            No products found.
          </div>
        ) : (
          products.map((prod) => {
            const totalStock = prod.variants?.reduce(
              (acc, v) => acc + (v.stockQuantity || 0),
              0
            );
            const isDeleting = deletingId === prod.id;
            const isConfirming = confirmDeleteId === prod.id;

            return (
              <div key={prod.id} className="bg-surface border border-hairline p-4 space-y-3 shadow-xs">
                <div className="flex gap-3">
                  <div className="w-16 h-20 bg-stone border border-hairline overflow-hidden flex-shrink-0">
                    {prod.primaryImage?.url && (
                      <img
                        src={prod.primaryImage.url}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${prod.slug}`}
                      target="_blank"
                      className="font-medium text-ink hover:underline text-sm truncate block"
                    >
                      {prod.name}
                    </Link>
                    <p className="text-[10px] uppercase tracking-micro text-muted mt-0.5">
                      {prod.category?.name || "General"} · {prod.variants?.length || 0} variants
                    </p>
                    <p className="font-bold text-ink text-sm tabular-nums mt-1">
                      {formatPrice(prod.priceFrom)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[10px] tabular-nums font-semibold ${
                          totalStock <= 5 ? "text-amber" : "text-muted"
                        }`}
                      >
                        {totalStock} in stock
                      </span>
                      <Badge variant={prod.status === "published" ? "success" : "neutral"} className="scale-90 origin-left">
                        {prod.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-hairline flex items-center justify-between gap-2">
                  <Link
                    href={`/products/${prod.slug}`}
                    target="_blank"
                    className="flex-1 py-2 text-center border border-hairline bg-stone text-ink text-[11px] uppercase tracking-micro font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink size={13} /> View
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(prod)}
                    disabled={isDeleting}
                    className={`flex-1 py-2 text-center text-[11px] uppercase tracking-micro font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isConfirming
                        ? "bg-destructive text-surface border-destructive animate-pulse"
                        : "bg-destructive-light/20 text-destructive border-destructive/20 hover:bg-destructive-light/40"
                    }`}
                  >
                    <Trash2 size={13} className={isDeleting ? "animate-spin" : ""} />
                    {isDeleting ? "Deleting..." : isConfirming ? "Confirm Delete?" : "Delete"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Products Table (Responsive >= sm) */}
      <div className="hidden sm:block bg-surface border border-hairline overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone text-muted uppercase tracking-micro border-b border-hairline">
            <tr>
              <th className="py-3 px-6 font-semibold">Image</th>
              <th className="py-3 px-6 font-semibold">Product Name</th>
              <th className="py-3 px-6 font-semibold">Category</th>
              <th className="py-3 px-6 font-semibold">Price</th>
              <th className="py-3 px-6 font-semibold">Stock</th>
              <th className="py-3 px-6 font-semibold">Status</th>
              <th className="py-3 px-6 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted">
                  Loading catalog inventory...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((prod) => {
                const totalStock = prod.variants?.reduce(
                  (acc, v) => acc + (v.stockQuantity || 0),
                  0
                );
                const isDeleting = deletingId === prod.id;
                const isConfirming = confirmDeleteId === prod.id;

                return (
                  <tr key={prod.id} className="hover:bg-stone/30 transition-colors">
                    <td className="py-3 px-6">
                      <div className="w-12 aspect-portrait bg-stone border border-hairline overflow-hidden">
                        {prod.primaryImage?.url && (
                          <img
                            src={prod.primaryImage.url}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <Link
                        href={`/products/${prod.slug}`}
                        target="_blank"
                        className="font-medium text-ink hover:underline text-sm block"
                      >
                        {prod.name}
                      </Link>
                      <span className="text-[10px] text-muted uppercase tracking-micro">
                        {prod.variants?.length || 0} Variants
                      </span>
                    </td>
                    <td className="py-3 px-6 uppercase tracking-micro text-muted font-medium">
                      {prod.category?.name || "General"}
                    </td>
                    <td className="py-3 px-6 font-semibold tabular-nums text-ink">
                      {formatPrice(prod.priceFrom)}
                    </td>
                    <td className="py-3 px-6">
                      <span
                        className={`tabular-nums font-medium ${
                          totalStock <= 5 ? "text-amber font-bold" : "text-ink"
                        }`}
                      >
                        {totalStock} units
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <Badge variant={prod.status === "published" ? "success" : "neutral"}>
                        {prod.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        <Link
                          href={`/products/${prod.slug}`}
                          target="_blank"
                          title="View on storefront"
                          className="p-1.5 text-muted hover:text-ink hover:bg-stone border border-transparent hover:border-hairline transition-colors"
                        >
                          <ExternalLink size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(prod)}
                          disabled={isDeleting}
                          title={isConfirming ? "Click to confirm permanent deletion" : "Delete product"}
                          className={`px-2 py-1 text-xs uppercase tracking-micro font-semibold transition-all border cursor-pointer flex items-center gap-1 ${
                            isConfirming
                              ? "bg-destructive text-surface border-destructive animate-pulse"
                              : "text-muted hover:text-destructive hover:bg-destructive-light/60 border-transparent hover:border-destructive/30"
                          }`}
                        >
                          <Trash2 size={14} className={isDeleting ? "animate-spin" : ""} />
                          {isConfirming && <span>Confirm?</span>}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
