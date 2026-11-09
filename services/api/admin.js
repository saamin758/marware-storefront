import { apiClient } from "./client";

export async function getDashboardMetrics() {
  return apiClient("/admin/dashboard");
}

export async function createProduct(productPayload) {
  const res = await apiClient("/admin/products", {
    method: "POST",
    body: JSON.stringify(productPayload),
  });

  // Client-side instant persistence backup
  if (typeof window !== "undefined") {
    try {
      const created = res?.data || res;
      if (created && created.id) {
        const raw = localStorage.getItem("marware_custom_products");
        const list = raw ? JSON.parse(raw) : [];
        const filtered = list.filter((p) => p.id !== created.id && p.slug !== created.slug);
        filtered.unshift(created);
        localStorage.setItem("marware_custom_products", JSON.stringify(filtered));

        // Make sure it is removed from any deleted set
        const rawDel = localStorage.getItem("marware_deleted_products");
        if (rawDel) {
          const delList = rawDel.split(",").map((s) => s.trim()).filter(Boolean);
          const updatedDel = delList.filter((id) => id !== created.id && id !== created.slug);
          localStorage.setItem("marware_deleted_products", updatedDel.join(","));
        }
      }
    } catch {}
  }

  return res;
}

export async function deleteProduct(productId) {
  const res = await apiClient(`/admin/products/${encodeURIComponent(productId)}`, {
    method: "DELETE",
  });

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("marware_custom_products");
      if (raw) {
        const list = JSON.parse(raw);
        const filtered = list.filter((p) => p.id !== productId && p.slug !== productId);
        localStorage.setItem("marware_custom_products", JSON.stringify(filtered));
      }
    } catch {}
  }

  return res;
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
