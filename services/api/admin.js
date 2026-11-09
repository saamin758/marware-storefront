import { apiClient } from "./client";

export async function getDashboardMetrics() {
  return apiClient("/admin/dashboard");
}

export async function createProduct(productPayload) {
  return apiClient("/admin/products", {
    method: "POST",
    body: JSON.stringify(productPayload),
  });
}

export async function deleteProduct(productId) {
  return apiClient(`/admin/products/${encodeURIComponent(productId)}`, {
    method: "DELETE",
  });
}

export async function updateOrderStatus(orderId, status) {
  return apiClient(`/admin/orders/${encodeURIComponent(orderId)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// Staff & Roles Management
export async function getStaffUsers() {
  return apiClient("/admin/staff");
}

export async function createStaffUser(staffPayload) {
  return apiClient("/admin/staff", {
    method: "POST",
    body: JSON.stringify(staffPayload),
  });
}

export async function updateStaffUser(id, updates) {
  return apiClient(`/admin/staff/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function deleteStaffUser(id) {
  return apiClient(`/admin/staff/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// Store Settings
export async function getStoreSettings() {
  return apiClient("/admin/settings");
}

export async function updateStoreSettings(settingsPayload) {
  return apiClient("/admin/settings", {
    method: "PATCH",
    body: JSON.stringify(settingsPayload),
  });
}

// Roles & Permissions Matrix
export async function getRolePermissionsMatrix() {
  return apiClient("/admin/roles");
}
