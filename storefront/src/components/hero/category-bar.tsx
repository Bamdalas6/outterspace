"use client";

import React from "react";
import { motion } from "framer-motion";

export const CATEGORIES = [
  "ALL",
  "HOODIES",
  "TOPS",
  "BOTTOMS",
  "OUTERWEAR",
  "ACCESSORIES",
  "FOOTWEAR",
] as const;

export type CategoryFilter = (typeof CATEGORIES)[number];

interface CategoryBarProps {
  activeCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
}

export function CategoryBar({ activeCategory, onSelectCategory }: CategoryBarProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-3 px-4 md:px-8 border-b sply-border flex items-center justify-start md:justify-center gap-1.5 text-xs font-semibold tracking-[0.14em] uppercase select-none">
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            className={`relative px-3.5 py-1.5 rounded transition-colors duration-200 whitespace-nowrap ${
              isActive ? "text-current" : "sply-muted hover:text-current"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="activeCategoryIndicator"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="absolute inset-0 bg-neutral-500/10 dark:bg-neutral-200/10 rounded"
              />
            )}
            <span className="relative z-10">{category}</span>
          </button>
        );
      })}
    </div>
  );
}
