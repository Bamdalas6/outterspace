"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { PRODUCTS } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/context/store-context";
import { motion } from "framer-motion";

export function RoamView() {
  const { setActivePdpHandle } = useStore();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <section
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`relative w-full h-[calc(100vh-3.5rem)] overflow-hidden cursor-grab active:cursor-grabbing select-none`}
    >
      <div className="absolute top-4 left-6 z-20 text-[10px] uppercase tracking-[0.2em] sply-muted pointer-events-none">
        ROAM CANVAS — DRAG TO EXPLORE
      </div>

      <motion.div
        animate={{ x: offset.x, y: offset.y }}
        transition={{ type: "spring", damping: 40, stiffness: 200 }}
        className="absolute inset-0 w-full h-full"
      >
        {PRODUCTS.map((product, i) => {
          const col = i % 5;
          const row = Math.floor(i / 5);
          const posX = 160 + col * 320 + ((row % 2) * 60);
          const posY = 100 + row * 280;

          return (
            <div
              key={product.id}
              style={{ left: `${posX}px`, top: `${posY}px` }}
              className="absolute w-52 p-3 sply-surface border sply-border rounded shadow-xl hover:scale-105 hover:z-30 transition-all duration-300 group cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setActivePdpHandle(product.handle);
              }}
            >
              <div className="relative w-full aspect-square p-2">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  sizes="200px"
                  className="object-contain drop-shadow"
                />
              </div>

              <div className="mt-2 text-center">
                <h4 className="text-[11px] font-bold tracking-wider uppercase truncate">
                  {product.title}
                </h4>
                <p className="text-[10px] sply-muted mt-0.5">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
