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
      setProducts(res?.data || res || []);
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
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${product.name}"? This action will remove the item from the live storefront catalog.`
    );
    if (!confirmed) return;

    try {
      setDeletingId(product.id);
      setErrorMessage(null);
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setToastMessage(`Product "${product.name}" was successfully deleted.`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to delete product.");
      setTimeout(() => setErrorMessage(null), 4000);
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

      {/* Products Table */}
      <div className="bg-surface border border-hairline overflow-x-auto">
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
                          title="Delete product"
                          className="p-1.5 text-muted hover:text-destructive hover:bg-destructive-light/60 border border-transparent hover:border-destructive/30 transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          <Trash2 size={14} className={isDeleting ? "animate-spin" : ""} />
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
