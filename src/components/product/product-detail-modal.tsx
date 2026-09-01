"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "@/context/store-context";
import { PRODUCTS } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ProductDetailModal() {
  const { activePdpHandle, setActivePdpHandle, addToCart } = useStore();
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string>("1 (S)");
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  if (!activePdpHandle) return null;

  const productIndex = PRODUCTS.findIndex((p) => p.handle === activePdpHandle);
  const product = PRODUCTS[productIndex] || PRODUCTS[0];

  const handleNextProduct = () => {
    const nextIdx = (productIndex + 1) % PRODUCTS.length;
    setActivePdpHandle(PRODUCTS[nextIdx].handle);
    setActivePhotoIdx(0);
  };

  const handlePrevProduct = () => {
    const prevIdx = (productIndex - 1 + PRODUCTS.length) % PRODUCTS.length;
    setActivePdpHandle(PRODUCTS[prevIdx].handle);
    setActivePhotoIdx(0);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, selectedVariant);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-4xl sply-surface border sply-border rounded shadow-2xl p-6 md:p-10 my-auto"
      >
        <button
          type="button"
          onClick={() => setActivePdpHandle(null)}
          className="absolute top-4 right-4 p-2 sply-muted hover:text-current transition-colors z-30"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative w-full aspect-square bg-neutral-900/5 dark:bg-neutral-100/5 rounded flex items-center justify-center overflow-hidden">
            <Image
              src={product.images[activePhotoIdx] || product.images[0]}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-6 drop-shadow-2xl"
            />

            {product.images.length > 1 && (
              <div className="absolute inset-x-2 flex justify-between pointer-events-none">
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIdx((prev) =>
                      prev === 0 ? product.images.length - 1 : prev - 1
                    )
                  }
                  className="p-2 rounded-full bg-black/20 backdrop-blur-sm pointer-events-auto hover:bg-black/40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIdx((prev) =>
                      (prev + 1) % product.images.length
                    )
                  }
                  className="p-2 rounded-full bg-black/20 backdrop-blur-sm pointer-events-auto hover:bg-black/40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <div className="text-[10px] tracking-[0.24em] font-semibold sply-muted uppercase mb-1">
                {product.category}
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-[0.14em] uppercase">
                {product.title}
              </h1>
              <div className="mt-2 text-sm tracking-wider">
                {formatPrice(product.price)}
              </div>
            </div>

            {product.variants && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs tracking-wider">
                  <span className="sply-muted uppercase text-[10px] font-semibold">
                    SELECT SIZE
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSizeChart(true)}
                    className="flex items-center gap-1 text-[10px] uppercase sply-muted hover:text-current transition-colors"
                  >
                    <Info className="w-3 h-3" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      disabled={!v.available}
                      onClick={() => setSelectedVariant(v.title)}
                      className={`py-2.5 text-xs font-bold tracking-widest uppercase border rounded transition-all ${
                        selectedVariant === v.title
                          ? "border-current bg-neutral-500/10 font-bold"
                          : "sply-border opacity-70 hover:opacity-100"
                      } ${!v.available ? "line-through opacity-30 cursor-not-allowed" : ""}`}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={!product.available}
              onClick={handleAddToCart}
              className="w-full h-12 text-xs font-bold tracking-[0.2em] uppercase bg-current text-neutral-900 dark:text-neutral-950 dark:bg-white rounded hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {product.available ? "ADD TO BAG" : "SOLD OUT"}
            </button>

            <div className="border-t sply-border pt-4 text-xs tracking-wide">
              <button
                type="button"
                onClick={() => setShowDescription(!showDescription)}
                className="w-full flex justify-between items-center uppercase text-[10px] font-bold tracking-widest sply-muted hover:text-current"
              >
                <span>Product Information</span>
                <span>{showDescription ? "−" : "+"}</span>
              </button>
              {showDescription && (
                <p className="mt-3 text-xs leading-relaxed sply-muted">
                  {product.description}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center pt-2 text-[10px] font-bold tracking-widest uppercase sply-muted">
              <button
                type="button"
                onClick={handlePrevProduct}
                className="hover:text-current transition-colors"
              >
                &larr; PREV PRODUCT
              </button>
              <button
                type="button"
                onClick={handleNextProduct}
                className="hover:text-current transition-colors"
              >
                NEXT PRODUCT &rarr;
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showSizeChart && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSizeChart(false)}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative z-10 w-full max-w-md sply-surface border sply-border p-6 rounded shadow-2xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold tracking-[0.2em] uppercase">
                    SIZE MEASUREMENTS (INCHES)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowSizeChart(false)}
                    className="p-1 hover:opacity-70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b sply-border">
                      <th className="py-2">SIZE</th>
                      <th className="py-2">CHEST</th>
                      <th className="py-2">LENGTH</th>
                      <th className="py-2">SLEEVE</th>
                    </tr>
                  </thead>
                  <tbody className="sply-muted divide-y divide-neutral-800/20">
                    <tr>
                      <td className="py-2 font-bold text-current">1 (S)</td>
                      <td className="py-2">46"</td>
                      <td className="py-2">26.5"</td>
                      <td className="py-2">34.0"</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-current">2 (M)</td>
                      <td className="py-2">49"</td>
                      <td className="py-2">27.5"</td>
                      <td className="py-2">35.0"</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-current">3 (L)</td>
                      <td className="py-2">52"</td>
                      <td className="py-2">28.5"</td>
                      <td className="py-2">36.0"</td>
                    </tr>
                  </tbody>
                </table>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
