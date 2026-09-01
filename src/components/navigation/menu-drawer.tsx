"use client";

import React from "react";
import { useStore } from "@/context/store-context";
import { StoreView } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

const MENU_LINKS: { label: string; view: StoreView }[] = [
  { label: "GRID VIEW", view: "grid" },
  { label: "RNNR VIEW", view: "rnnr" },
  { label: "ROAM VIEW", view: "roam" },
];

export function MenuDrawer() {
  const { isMenuOpen, setIsMenuOpen, view, setView, setActivePdpHandle } = useStore();

  const handleSelectView = (targetView: StoreView) => {
    setView(targetView);
    setActivePdpHandle(null);
    setIsMenuOpen(false);
  };

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-sm h-full sply-surface border-r sply-border p-8 flex flex-col justify-between shadow-2xl"
          >
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] sply-muted mb-12">
                SELECT EXPERIENCE
              </div>

              <nav className="flex flex-col gap-6">
                {MENU_LINKS.map((item, index) => {
                  const isActive = view === item.view;
                  return (
                    <motion.button
                      key={item.view}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                      onClick={() => handleSelectView(item.view)}
                      className={`text-left text-xl md:text-2xl font-bold tracking-[0.14em] uppercase transition-all duration-200 flex items-center justify-between group ${
                        isActive ? "text-current" : "sply-muted hover:text-current"
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-current" />
                      )}
                    </motion.button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-8 border-t sply-border text-[11px] sply-muted uppercase tracking-[0.1em] flex flex-col gap-2">
              <p>OUTTERSPACE &copy; {new Date().getFullYear()}</p>
              <p className="opacity-60">SPLY STUDIO ENGINE — V2.4</p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
