"use client";

import React from "react";
import { useStore } from "@/context/store-context";
import { Sun, Moon, Plus, ChevronLeft, Minus } from "lucide-react";
import { motion } from "framer-motion";

export function Header() {
  const {
    theme,
    toggleTheme,
    isMenuOpen,
    setIsMenuOpen,
    isCartOpen,
    setIsCartOpen,
    cartCount,
    activePdpHandle,
    setActivePdpHandle,
    view,
    zoomLevel,
    toggleZoom,
  } = useStore();

  const handleBack = () => {
    if (activePdpHandle) {
      setActivePdpHandle(null);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-14 flex items-center justify-between px-4 md:px-8 border-b sply-border sply-surface backdrop-blur-md bg-opacity-80 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="relative w-8 h-8 flex items-center justify-center rounded hover:opacity-70 transition-opacity focus:outline-none"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <div className="w-4 h-3 flex flex-col justify-between items-center">
            <motion.span
              animate={isMenuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-[1.2px] bg-current block"
            />
            <motion.span
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="w-full h-[1.2px] bg-current block"
            />
            <motion.span
              animate={isMenuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-[1.2px] bg-current block"
            />
          </div>
        </button>

        {activePdpHandle ? (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1 text-xs tracking-widest uppercase hover:opacity-70 transition-opacity"
            aria-label="Back to collection"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">BACK</span>
          </button>
        ) : view === "grid" ? (
          <button
            type="button"
            onClick={toggleZoom}
            className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity"
            aria-label={zoomLevel === 0 ? "Zoom In" : "Zoom Out"}
          >
            {zoomLevel === 0 ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
          </button>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setActivePdpHandle(null)}
        className="font-bold text-sm md:text-base tracking-[0.18em] uppercase hover:opacity-80 transition-opacity"
      >
        OUTTERSPACE
      </button>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded hover:opacity-70 transition-opacity"
          aria-label="Toggle theme mode"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-neutral-200" />
          ) : (
            <Moon className="w-4 h-4 text-neutral-800" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="relative flex items-center gap-1.5 py-1 px-2 hover:opacity-70 transition-opacity text-xs tracking-widest uppercase"
          aria-label="Open cart"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="5" y="8" width="14" height="12" rx="2" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
          <span className="text-[11px] font-medium">{cartCount}</span>
        </button>
      </div>
    </header>
  );
}
