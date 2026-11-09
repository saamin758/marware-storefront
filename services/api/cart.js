import { apiClient } from "./client";

export async function getCart() {
  return apiClient("/cart");
}

export async function addToCart(variantId, quantity = 1) {
  return apiClient("/cart", {
    method: "POST",
    body: JSON.stringify({ variantId, quantity }),
  });
}

export async function updateCartItem(itemId, quantity) {
  return apiClient(`/cart/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export async function removeFromCart(itemId) {
  return apiClient(`/cart/${itemId}`, {
    method: "DELETE",
  });
}
