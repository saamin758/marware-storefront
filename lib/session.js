/**
 * Client & Server Session Management
 * Provides isolated sandbox environments for each browser visitor.
 */

const SESSION_STORAGE_KEY = "ecstasy_session_id";
const SESSION_COOKIE_NAME = "ecstasy_session_id";

/**
 * Generate a random unique session token
 */
export function generateSessionId() {
  const rand = Math.random().toString(36).substring(2, 10);
  const time = Date.now().toString(36);
  return `sess_${time}_${rand}`;
}

/**
 * Client-Side: Get or create persistent session ID in localStorage and Cookies
 */
export function getClientSessionId() {
  if (typeof window === "undefined") {
    return "default";
  }

  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }

  // Ensure cookie is synced for SSR and Next.js server requests
  if (typeof document !== "undefined") {
    const isHttps = window.location.protocol === "https:";
    document.cookie = `${SESSION_COOKIE_NAME}=${encodeURIComponent(
      sessionId
    )}; path=/; max-age=31536000; SameSite=Lax${isHttps ? "; Secure" : ""}`;
  }

  return sessionId;
}

/**
 * Client-Side: Reset current session (for fresh demo walkthroughs)
 */
export function resetClientSession() {
  if (typeof window === "undefined") return;

  const newSessionId = generateSessionId();
  localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
  localStorage.removeItem("ecstasy_auth_token");
  localStorage.removeItem("ecstasy_user");
  localStorage.removeItem("ecstasy_cart");

  if (typeof document !== "undefined") {
    const isHttps = window.location.protocol === "https:";
    document.cookie = `${SESSION_COOKIE_NAME}=${encodeURIComponent(
      newSessionId
    )}; path=/; max-age=31536000; SameSite=Lax${isHttps ? "; Secure" : ""}`;
  }

  return newSessionId;
}

/**
 * Server-Side: Extract session ID from incoming HTTP request headers or cookies
 */
export function getSessionIdFromRequest(request) {
  if (!request) return "default";

  // 1. Explicit Header
  const headerSession = request.headers.get("x-session-id");
  if (headerSession && headerSession.trim()) {
    return headerSession.trim();
  }

  // 2. Cookie Header
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const match = cookieHeader.match(
      new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]+)`)
    );
    if (match && match[1]) {
      try {
        return decodeURIComponent(match[1].trim());
      } catch {
        return match[1].trim();
      }
    }
  }

  return "default";
}
