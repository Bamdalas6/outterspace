"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { StoreView, ThemeMode, CartItem, ProductItem } from "@/types";

interface StoreContextType {
  view: StoreView;
  setView: (view: StoreView) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  toggleZoom: () => void;
  cart: CartItem[];
  addToCart: (product: ProductItem, variantId: string | number, variantTitle: string) => void;
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, qty: number) => void;
  cartCount: number;
  cartTotal: number;
  activePdpHandle: string | null;
  setActivePdpHandle: (handle: string | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<StoreView>("grid");
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activePdpHandle, setActivePdpHandle] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("sply-theme") as ThemeMode | null;
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
        document.documentElement.classList.toggle("light", savedTheme === "light");
      }
    } catch {}
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.classList.toggle("light", nextTheme === "light");
    try {
      localStorage.setItem("sply-theme", nextTheme);
    } catch {}
  };

  const toggleZoom = () => {
    setZoomLevel((prev) => (prev === 0 ? 1 : 0));
  };

  const addToCart = (product: ProductItem, variantId: string | number, variantTitle: string) => {
    const itemKey = `${product.id}-${variantId}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.key === itemKey);
      if (existing) {
        return prev.map((item) =>
          item.key === itemKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          key: itemKey,
          product,
          variantId,
          variantTitle,
          quantity: 1,
          price: product.price,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const updateQuantity = (key: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(key);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity: qty } : item))
    );
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        view,
        setView,
        theme,
        toggleTheme,
        isMenuOpen,
        setIsMenuOpen,
        isCartOpen,
        setIsCartOpen,
        zoomLevel,
        setZoomLevel,
        toggleZoom,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        cartTotal,
        activePdpHandle,
        setActivePdpHandle,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
