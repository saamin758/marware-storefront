/**
 * Centralized API Client
 * Configured via environment variable NEXT_PUBLIC_API_BASE_URL.
 * When switching from temporary mock to Express.js backend, only the base URL changes!
 */

import { getClientSessionId } from "@/lib/session";

async function getBaseUrl() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";
  if (base.startsWith("http://") || base.startsWith("https://")) {
    return base;
  }
  if (typeof window !== "undefined") {
    return base;
  }
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    try {
      const { headers } = await import("next/headers");
      const h = await headers();
      const host = h.get("x-forwarded-host") || h.get("host");
      const proto = h.get("x-forwarded-proto") || "https";
      if (host) {
        siteUrl = `${proto}://${host}`;
      }
    } catch {}
  }
  if (!siteUrl) {
    siteUrl = process.env.NODE_ENV === "production" ? "https://marware.netlify.app" : "http://localhost:3000";
  }
  return `${siteUrl.replace(/\/$/, "")}${base.startsWith("/") ? "" : "/"}${base}`;
}

function getAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("ecstasy_auth_token");
  }
  return null;
}

export async function apiClient(endpoint, options = {}) {
  const baseUrl = await getBaseUrl();
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Inject Client Session for Multi-User Sandbox Isolation & Deleted Products Sync
  if (typeof window !== "undefined") {
    headers["x-session-id"] = getClientSessionId();
    const deleted = localStorage.getItem("marware_deleted_products");
    if (deleted) {
      headers["x-deleted-product-ids"] = deleted;
    }
  } else {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const sid = cookieStore.get("ecstasy_session_id")?.value;
      if (sid) {
        headers["x-session-id"] = sid;
      }
      const deletedCookie = cookieStore.get("marware_deleted_products")?.value;
      if (deletedCookie) {
        headers["x-deleted-product-ids"] = deletedCookie;
      }
    } catch {
      // Ignore if called outside of request scope
    }
  }

  const token = getAuthToken();
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg =
        result?.error?.message ||
        `Request failed with status ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.code = result?.error?.code || "HTTP_ERROR";
      error.details = result?.error?.details || [];
      throw error;
    }

    return result?.data ?? result;
  } catch (error) {
    // Avoid triggering Next.js dev overlay for standard 401/400 validation messages
    if (error.status && error.status >= 500) {
      console.error(`[API Server Error] ${endpoint}:`, error.message);
    } else {
      console.warn(`[API Client Notice] ${endpoint}:`, error.message);
    }
    throw error;
  }
}
