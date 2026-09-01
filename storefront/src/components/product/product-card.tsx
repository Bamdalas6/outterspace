"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/context/store-context";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: ProductItem;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { setActivePdpHandle } = useStore();

  const primaryImg = product.images[0] || "/cowboy seriess/1.png";
  const secondaryImg = product.images[1] || primaryImg;

  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.035,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group list-none flex flex-col items-center text-center cursor-pointer ${
        !product.available ? "opacity-60" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setActivePdpHandle(product.handle)}
    >
      <div className="relative w-full aspect-square overflow-hidden bg-neutral-900/5 dark:bg-neutral-100/5 rounded">
        <div
          className={`absolute inset-0 p-4 transition-all duration-500 ease-studio ${
            isHovered && product.images.length > 1
              ? "opacity-0 scale-95"
              : "opacity-100 scale-100 group-hover:scale-105"
          }`}
        >
          <Image
            src={primaryImg}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 16vw"
            priority={index < 6}
            className="object-contain drop-shadow-md"
          />
        </div>

        {product.images.length > 1 && (
          <div
            className={`absolute inset-0 p-4 transition-all duration-500 ease-studio ${
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-95"
            }`}
          >
            <Image
              src={secondaryImg}
              alt=""
              fill
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 16vw"
              loading="lazy"
              className="object-contain drop-shadow-md"
            />
          </div>
        )}
      </div>

      <div className="mt-3 w-full flex flex-col items-center">
        <h3 className="text-[10px] md:text-xs font-semibold tracking-[0.08em] uppercase truncate max-w-full">
          {product.title}
        </h3>

        <div className="mt-1 text-[10px] md:text-xs tracking-wider">
          {!product.available ? (
            <span className="sply-muted uppercase tracking-[0.1em]">Sold out</span>
          ) : product.compareAtPrice && product.compareAtPrice > product.price ? (
            <span className="flex items-center gap-1.5 justify-center">
              <span className="sply-sale font-medium">{formatPrice(product.price)}</span>
              <s className="sply-muted opacity-50 line-through">
                {formatPrice(product.compareAtPrice)}
              </s>
            </span>
          ) : (
            <span className="sply-muted">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </motion.li>
  );
}
