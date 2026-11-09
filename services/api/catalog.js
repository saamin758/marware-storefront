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
  if (typeof window === "undefined") {
    try {
      const store = await getServerStore();
      if (store) {
        const all = store().getCategories();
        const found = all.find(
          (c) => c.slug?.toLowerCase() === slug?.toLowerCase()
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
      const store = await getServerStore();
      if (store) {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const rawCookie = cookieStore.get("marware_deleted_products")?.value;
        const deletedSet = new Set(
          rawCookie ? rawCookie.split(",").map((s) => s.trim()).filter(Boolean) : []
        );
        const res = store().getProducts(params);
        if (Array.isArray(res)) {
          return res.filter((p) => !deletedSet.has(p.id) && !deletedSet.has(p.slug));
        }
        if (res?.data && Array.isArray(res.data)) {
          return {
            ...res,
            data: res.data.filter((p) => !deletedSet.has(p.id) && !deletedSet.has(p.slug)),
          };
        }
        return res;
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
  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const rawCookie = cookieStore.get("marware_deleted_products")?.value;
      const deletedSet = new Set(
        rawCookie ? rawCookie.split(",").map((s) => s.trim()).filter(Boolean) : []
      );
      if (deletedSet.has(slug)) return null;
      const store = await getServerStore();
      if (store) {
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
