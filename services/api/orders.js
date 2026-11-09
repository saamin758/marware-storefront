import { apiClient } from "./client";

export async function createOrder(orderPayload) {
  return apiClient("/orders", {
    method: "POST",
    body: JSON.stringify(orderPayload),
  });
}

export async function getOrders() {
  return apiClient("/orders");
}

export async function getOrderById(id) {
  return apiClient(`/orders/${encodeURIComponent(id)}`);
}
