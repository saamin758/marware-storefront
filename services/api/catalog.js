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
  return apiClient(`/products${queryString ? `?${queryString}` : ""}`);
}

export async function getProductBySlug(slug) {
  return apiClient(`/products/${encodeURIComponent(slug)}`);
}
