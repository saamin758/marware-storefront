"use client";

import { createContext, useContext, useState, useEffect } from "react";
import * as authApi from "@/services/api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = authApi.getStoredUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await authApi.login(email, password);
    setUser(result.user);
    return result;
  };

  const register = async (userData) => {
    const result = await authApi.register(userData);
    setUser(result.user);
    return result;
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin" || user?.role === "super_admin",
        isSuperAdmin: user?.role === "super_admin",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
