import { apiClient } from "./client";

export function getStoredToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("ecstasy_auth_token");
  }
  return null;
}

export function setStoredToken(token) {
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("ecstasy_auth_token", token);
    } else {
      localStorage.removeItem("ecstasy_auth_token");
    }
  }
}

export function getStoredUser() {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("ecstasy_user");
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  return null;
}

export function setStoredUser(user) {
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem("ecstasy_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("ecstasy_user");
    }
  }
}

export async function login(email, password) {
  const result = await apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (result.token) {
    setStoredToken(result.token);
    setStoredUser(result.user);
  }
  return result;
}

export async function register(userData) {
  const result = await apiClient("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
  if (result.token) {
    setStoredToken(result.token);
    setStoredUser(result.user);
  }
  return result;
}

export function logout() {
  setStoredToken(null);
  setStoredUser(null);
}

export async function getProfile() {
  return apiClient("/auth/me");
}
