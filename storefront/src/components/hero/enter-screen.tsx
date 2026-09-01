"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "@/context/store-context";
import { StoreView } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export function EnterScreen() {
  const { setView } = useStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const entered = sessionStorage.getItem("sply-entered");
      if (!entered) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleSelectView = (targetView: StoreView) => {
    try {
      sessionStorage.setItem("sply-entered", "1");
    } catch {}
    setView(targetView);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            y: "-100%",
            opacity: 0,
            transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-40 flex items-center justify-center p-6 bg-black/40 backdrop-blur-xl"
        >
          <div className="absolute inset-0 noise-overlay pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-sm flex flex-col items-center gap-5 text-center"
          >
            <div className="text-[11px] uppercase tracking-[0.24em] sply-muted mb-2 font-medium">
              COWBOY SERIES 01
            </div>

            <button
              type="button"
              onClick={() => handleSelectView("grid")}
              className="w-full py-3.5 px-6 rounded text-xs font-bold tracking-[0.2em] uppercase bg-white text-neutral-950 dark:bg-neutral-100 dark:text-black hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
            >
              GRID VIEW
            </button>

            <button
              type="button"
              onClick={() => handleSelectView("rnnr")}
              className="w-full py-3.5 px-6 rounded text-xs font-bold tracking-[0.2em] uppercase border sply-border sply-surface hover:bg-neutral-800/20 active:scale-[0.98] transition-all"
            >
              RNNR VIEW
            </button>

            <button
              type="button"
              onClick={() => handleSelectView("roam")}
              className="w-full py-3.5 px-6 rounded text-xs font-bold tracking-[0.2em] uppercase border sply-border sply-surface hover:bg-neutral-800/20 active:scale-[0.98] transition-all"
            >
              ROAM VIEW
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
