"use client";

import React from "react";
import Image from "next/image";
import { useStore } from "@/context/store-context";
import { formatPrice } from "@/lib/utils";
import { PRODUCTS } from "@/data/products";
import { X, Plus, Minus, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    addToCart,
  } = useStore();

  const upsellProducts = PRODUCTS.slice(0, 4).filter(
    (p) => !cart.some((c) => c.product.id === p.id)
  );

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-md h-full sply-surface border-l sply-border flex flex-col justify-between shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b sply-border flex items-center justify-between">
              <span className="text-xs font-bold tracking-[0.2em] uppercase">
                YOUR BAG ({cart.reduce((a, b) => a + b.quantity, 0)})
              </span>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1 hover:opacity-70 transition-opacity"
                aria-label="Close cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                  <p className="text-xs tracking-widest uppercase sply-muted mb-4">
                    Your bag is empty
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2.5 text-xs font-bold tracking-widest uppercase border sply-border rounded hover:bg-neutral-800/10 active:scale-95 transition-all"
                  >
                    Keep Shopping
                  </button>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {cart.map((item) => (
                    <li
                      key={item.key}
                      className="flex gap-4 p-3 border sply-border rounded sply-surface"
                    >
                      <div className="relative w-16 h-16 bg-neutral-900/5 dark:bg-neutral-100/5 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.title}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-[11px] font-bold tracking-wider uppercase">
                              {item.product.title}
                            </h4>
                            <p className="text-[10px] sply-muted mt-0.5">
                              Size: {item.variantTitle}
                            </p>
                          </div>
                          <span className="text-xs font-medium tracking-wide">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border sply-border rounded">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.key, item.quantity - 1)
                              }
                              className="w-6 h-6 flex items-center justify-center hover:opacity-70"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-medium">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.key, item.quantity + 1)
                              }
                              className="w-6 h-6 flex items-center justify-center hover:opacity-70"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.key)}
                            className="text-[10px] tracking-widest uppercase sply-muted hover:text-red-500 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {upsellProducts.length > 0 && cart.length > 0 && (
                <div className="mt-4 pt-6 border-t sply-border">
                  <div className="text-[10px] font-bold tracking-[0.16em] uppercase sply-muted mb-3">
                    YOU MAY ALSO LIKE
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {upsellProducts.slice(0, 2).map((up) => (
                      <div
                        key={up.id}
                        className="p-2 border sply-border rounded flex flex-col items-center text-center"
                      >
                        <div className="relative w-14 h-14">
                          <Image
                            src={up.images[0]}
                            alt={up.title}
                            fill
                            sizes="56px"
                            className="object-contain"
                          />
                        </div>
                        <p className="text-[10px] font-semibold uppercase mt-1 truncate w-full">
                          {up.title}
                        </p>
                        <button
                          type="button"
                          onClick={() => addToCart(up, "default", "1 (S)")}
                          className="mt-2 w-full py-1 text-[9px] font-bold tracking-widest uppercase border sply-border rounded hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black transition-colors"
                        >
                          + ADD {formatPrice(up.price)}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t sply-border flex flex-col gap-3">
                <div className="flex justify-between text-xs font-bold tracking-[0.18em] uppercase">
                  <span>TOTAL</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => alert("Checkout initiated!")}
                  className="w-full h-12 text-xs font-bold tracking-[0.2em] uppercase bg-current text-neutral-900 dark:text-neutral-950 dark:bg-white rounded hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  CHECKOUT
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[9px] sply-muted uppercase tracking-widest mt-1">
                  <Lock className="w-3 h-3" />
                  <span>256-Bit SSL Encrypted Checkout</span>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
