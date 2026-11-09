import { apiClient } from "./client";

export async function getCategories() {
  return apiClient("/categories");
}

export async function getCategoryBySlug(slug) {
  return apiClient(`/categories/${encodeURIComponent(slug)}`);
}

export async function getProducts(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      query.append(key, val);
    }
  });
  const queryString = query.toString();
  const res = await apiClient(`/products${queryString ? `?${queryString}` : ""}`);

  // Client-side instant filter against persistent deleted products
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("marware_deleted_products");
      if (raw) {
        const deletedSet = new Set(raw.split(",").map((s) => s.trim()).filter(Boolean));
        if (Array.isArray(res)) {
          return res.filter((p) => !deletedSet.has(p.id) && !deletedSet.has(p.slug));
        }
        if (res?.data && Array.isArray(res.data)) {
          return {
            ...res,
            data: res.data.filter((p) => !deletedSet.has(p.id) && !deletedSet.has(p.slug)),
          };
        }
      }
    } catch {}
  }

  return res;
}

export async function getProductBySlug(slug) {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("marware_deleted_products");
      if (raw) {
        const deletedSet = new Set(raw.split(",").map((s) => s.trim()).filter(Boolean));
        if (deletedSet.has(slug)) {
          return null;
        }
      }
    } catch {}
  }
  const res = await apiClient(`/products/${encodeURIComponent(slug)}`);
  if (res && typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("marware_deleted_products");
      if (raw) {
        const deletedSet = new Set(raw.split(",").map((s) => s.trim()).filter(Boolean));
        if (deletedSet.has(res.id) || deletedSet.has(res.slug)) {
          return null;
        }
      }
    } catch {}
  }
  return res;
}
