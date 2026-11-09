"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import * as cartApi from "@/services/api/cart";

const CartContext = createContext(null);

const DEFAULT_CART = {
  items: [],
  itemCount: 0,
  subtotal: "0.00",
  shippingTotal: "0.00",
  grandTotal: "0.00",
};

export function CartProvider({ children }) {
  // Read local cache immediately if available
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("ecstasy_cart");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && Array.isArray(parsed.items)) {
            return parsed;
          }
        }
      } catch {}
    }
    return DEFAULT_CART;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const channelRef = useRef(null);

  const saveCartState = (data, broadcast = true) => {
    if (!data) return;
    setCart(data);
    setIsInitialized(true);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("ecstasy_cart", JSON.stringify(data));
      } catch {}

      if (broadcast && channelRef.current) {
        try {
          channelRef.current.postMessage({ type: "CART_SYNC", cart: data });
        } catch {}
      }
    }
  };

  const refreshCart = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const data = await cartApi.getCart();
      if (data) {
        saveCartState(data, false);
      }
    } catch (err) {
      console.warn("Cart synchronization notice:", err);
    } finally {
      setIsInitialized(true);
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Immediate client cache check on mount
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("ecstasy_cart");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
            setCart(parsed);
            setIsInitialized(true);
          }
        }
      } catch {}
    }

    // 2. Setup Cross-Tab Real-Time Sync Channel
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        const channel = new BroadcastChannel("ecstasy_cart_sync");
        channelRef.current = channel;
        channel.onmessage = (event) => {
          if (event.data?.type === "CART_SYNC" && event.data.cart) {
            setCart(event.data.cart);
            setIsInitialized(true);
          }
        };
      } catch {}
    }

    // 3. Multi-window storage event fallback
    const handleStorage = (e) => {
      if (e.key === "ecstasy_cart" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && Array.isArray(parsed.items)) {
            setCart(parsed);
            setIsInitialized(true);
          }
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);

    // 4. Initial server sync
    refreshCart(true);

    return () => {
      if (channelRef.current) {
        try {
          channelRef.current.close();
        } catch {}
      }
      window.removeEventListener("storage", handleStorage);
    };
  }, [refreshCart]);

  const addToCart = async (variantId, quantity = 1) => {
    try {
      setLoading(true);
      const updated = await cartApi.addToCart(variantId, quantity);
      saveCartState(updated, true);
      setIsCartOpen(true);
      setFeedbackMessage("Item added to shopping bag");
      setTimeout(() => setFeedbackMessage(null), 3000);
      return { success: true, data: updated };
    } catch (err) {
      setFeedbackMessage(err.message || "Failed to add item");
      setTimeout(() => setFeedbackMessage(null), 4000);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      setLoading(true);
      const updated = await cartApi.updateCartItem(itemId, quantity);
      saveCartState(updated, true);
    } catch (err) {
      console.warn("Failed to update cart item:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setLoading(true);
      const updated = await cartApi.removeFromCart(itemId);
      saveCartState(updated, true);
    } catch (err) {
      console.warn("Failed to remove cart item:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        loading,
        isInitialized,
        feedbackMessage,
        addToCart,
        updateQuantity,
        removeItem,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
