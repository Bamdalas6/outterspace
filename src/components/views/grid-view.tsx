"use client";

import React, { useState } from "react";
import { PRODUCTS } from "@/data/products";
import { CategoryBar, CategoryFilter } from "@/components/hero/category-bar";
import { ProductCard } from "@/components/product/product-card";
import { useStore } from "@/context/store-context";

export function GridView() {
  const { zoomLevel } = useStore();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("ALL");

  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeCategory === "ALL") return true;
    return p.category.toUpperCase() === activeCategory;
  });

  return (
    <section className="w-full flex flex-col">
      <CategoryBar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <div className="w-full py-8 px-4 md:px-8 max-w-[1800px] mx-auto">
        <ul
          className={`grid gap-4 md:gap-6 transition-all duration-500 ease-studio ${
            zoomLevel === 0
              ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
          }`}
        >
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </ul>

        {filteredProducts.length === 0 && (
          <div className="py-24 text-center text-xs tracking-widest uppercase sply-muted">
            No products found in this category.
          </div>
        )}
      </div>
    </section>
  );
}
