/**
 * Production Session Management:
 * In production mode, all visitors, customers, and admins share the unified live store.
 */

export function generateSessionId() {
  return "default";
}

/**
 * Client-Side: Returns unified global production store ID
 */
export function getClientSessionId() {
  return "default";
}

/**
 * Client-Side: Reset current session
 */
export function resetClientSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("ecstasy_auth_token");
  localStorage.removeItem("ecstasy_user");
  localStorage.removeItem("ecstasy_cart");
  return "default";
}

/**
 * Server-Side: Returns unified global production store ID
 */
export function getSessionIdFromRequest(request) {
  return "default";
}
