"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PRODUCTS } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/context/store-context";
import { motion } from "framer-motion";

export function RnnrView() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const { setActivePdpHandle } = useStore();

  const total = PRODUCTS.length;
  const currentProduct = PRODUCTS[selectedIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isSpinning) {
        setSelectedIndex((prev) => (prev + 1) % total);
      }
    }, 4500);
    return () => clearInterval(timer);
  }, [isSpinning, total]);

  const handleNext = () => {
    setActivePhoto(0);
    setSelectedIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setActivePhoto(0);
    setSelectedIndex((prev) => (prev - 1 + total) % total);
  };

  return (
    <section className="relative w-full h-[calc(100vh-3.5rem)] flex flex-col items-center justify-between p-6 md:p-12 overflow-hidden select-none">
      <div className="text-xs tracking-[0.24em] font-semibold sply-muted">
        {String(selectedIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>

      <div className="relative w-full max-w-xl h-96 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {PRODUCTS.map((prod, idx) => {
            const offset = (idx - selectedIndex + total) % total;
            const angle = (offset * (360 / total) * Math.PI) / 180;
            const radius = 240;
            const x = Math.sin(angle) * radius;
            const y = -Math.cos(angle) * (radius * 0.45);
            const scale = Math.max(0.4, 1 - Math.abs(offset) * 0.15);
            const opacity = Math.max(0.15, 1 - Math.abs(offset) * 0.25);

            if (Math.abs(offset) > 4) return null;

            return (
              <motion.div
                key={prod.id}
                animate={{ x, y, scale, opacity }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute w-16 h-16 rounded overflow-hidden p-1.5"
              >
                <Image
                  src={prod.images[0]}
                  alt=""
                  fill
                  className="object-contain opacity-70"
                />
              </motion.div>
            );
          })}
        </div>

        <motion.div
          key={currentProduct.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 w-64 h-64 md:w-80 md:h-80 cursor-pointer"
          onClick={() => setActivePdpHandle(currentProduct.handle)}
        >
          <Image
            src={currentProduct.images[activePhoto] || currentProduct.images[0]}
            alt={currentProduct.title}
            fill
            priority
            className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-4 text-center z-20">
        <button
          type="button"
          onClick={() => setActivePdpHandle(currentProduct.handle)}
          className="text-base md:text-lg font-bold tracking-[0.14em] uppercase hover:opacity-80 transition-opacity"
        >
          {currentProduct.title}
        </button>

        <div className="text-xs tracking-wider">
          {!currentProduct.available ? (
            <span className="sply-muted uppercase">Sold out</span>
          ) : (
            <span className="sply-muted">{formatPrice(currentProduct.price)}</span>
          )}
        </div>

        <div className="flex items-center gap-6 mt-2">
          <button
            type="button"
            onClick={handlePrev}
            className="px-4 py-2 text-xs font-bold tracking-widest uppercase border sply-border rounded hover:bg-neutral-800/10 active:scale-95 transition-all"
          >
            PREV
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 text-xs font-bold tracking-widest uppercase border sply-border rounded hover:bg-neutral-800/10 active:scale-95 transition-all"
          >
            NEXT
          </button>
        </div>
      </div>
    </section>
  );
}
