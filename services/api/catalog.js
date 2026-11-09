import { apiClient } from "./client";

async function getServerStore() {
  if (typeof window !== "undefined") return null;
  try {
    const { mockStore } = await import("@/mocks/store");
    return mockStore;
  } catch {
    return null;
  }
}

export async function getCategories() {
  if (typeof window === "undefined") {
    try {
      const store = await getServerStore();
      if (store) return store().getCategories();
    } catch (err) {
      console.warn("Direct categories fetch error:", err);
    }
  }
  return apiClient("/categories");
}

export async function getCategoryBySlug(slug) {
  if (!slug) return null;
  if (typeof window === "undefined") {
    try {
      const store = await getServerStore();
      if (store) {
        const all = store().getCategories();
        const found = all.find(
          (c) => c.slug && c.slug.toLowerCase() === slug.toLowerCase()
        );
        if (found) return found;
        return store().getCategoryBySlug(slug);
      }
    } catch (err) {
      console.warn("Direct category fetch error:", err);
    }
  }
  return apiClient(`/categories/${encodeURIComponent(slug)}`);
}

export async function getProducts(params = {}) {
  if (typeof window === "undefined") {
    try {
      const { getPersistentProducts } = await import("@/lib/catalog-storage");
      const persistentList = await getPersistentProducts();
      const store = await getServerStore();
      if (store) {
        if (Array.isArray(persistentList)) {
          store().syncProducts(persistentList);
        }
        let deletedSet = new Set();
        try {
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          const rawCookie = cookieStore.get("marware_deleted_products")?.value;
          if (rawCookie) {
            deletedSet = new Set(rawCookie.split(",").map((s) => s.trim()).filter(Boolean));
          }
        } catch {}

        const res = store().getProducts(params);
        const list = Array.isArray(res) ? res : res?.products || res?.data || [];
        const filtered = list.filter((p) => !deletedSet.has(p.id) && !deletedSet.has(p.slug));
        return {
          success: true,
          data: filtered,
          products: filtered,
          meta: {
            ...(res?.meta || {}),
            total: filtered.length,
          },
        };
      }
    } catch (err) {
      console.warn("Direct products fetch error:", err);
    }
  }

  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      query.append(key, val);
    }
  });
  const queryString = query.toString();
  const res = await apiClient(`/products${queryString ? `?${queryString}` : ""}`);

  let list = Array.isArray(res) ? res : res?.data || res?.products || [];

  // Client-side instant filter against persistent deleted products
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("marware_deleted_products");
      if (raw) {
        const deletedSet = new Set(raw.split(",").map((s) => s.trim()).filter(Boolean));
        list = list.filter((p) => !deletedSet.has(p.id) && !deletedSet.has(p.slug));
      }
      // Merge custom locally created products if not already included
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

  return {
    success: true,
    data: list,
    products: list,
    meta: res?.meta || { total: list.length },
  };
}

export async function getProductBySlug(slug) {
  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const rawCookie = cookieStore.get("marware_deleted_products")?.value;
      const deletedSet = new Set(
        rawCookie ? rawCookie.split(",").map((s) => s.trim()).filter(Boolean) : []
      );
      if (deletedSet.has(slug)) return null;
      const { getPersistentProducts } = await import("@/lib/catalog-storage");
      const persistentList = await getPersistentProducts();
      const store = await getServerStore();
      if (store) {
        if (Array.isArray(persistentList)) {
          store().syncProducts(persistentList);
        }
        const prod = store().getProductBySlug(slug);
        if (prod && (deletedSet.has(prod.id) || deletedSet.has(prod.slug))) {
          return null;
        }
        return prod;
      }
    } catch (err) {
      console.warn("Direct product fetch error:", err);
    }
  }

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
  let res = null;
  try {
    res = await apiClient(`/products/${encodeURIComponent(slug)}`);
  } catch {}

  if (!res && typeof window !== "undefined") {
    try {
      const rawCustom = localStorage.getItem("marware_custom_products");
      if (rawCustom) {
        const customList = JSON.parse(rawCustom);
        const found = customList.find((p) => p.slug === slug || p.id === slug);
        if (found) return found;
      }
    } catch {}
  }

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
