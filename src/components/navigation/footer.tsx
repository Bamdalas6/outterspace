"use client";

import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SOCIAL_LINKS = [
  { label: "IG", url: "https://instagram.com" },
  { label: "TT", url: "https://tiktok.com" },
  { label: "YT", url: "https://youtube.com" },
  { label: "X", url: "https://x.com" },
  { label: "FB", url: "https://facebook.com" },
];

export function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem("sply-newsletter-dismissed");
      if (!dismissed) {
        const timer = setTimeout(() => {
          setShowNewsletter(true);
        }, 5000);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const handleDismissNewsletter = () => {
    setShowNewsletter(false);
    try {
      sessionStorage.setItem("sply-newsletter-dismissed", "1");
    } catch {}
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        handleDismissNewsletter();
      }, 2000);
    }
  };

  return (
    <>
      <footer className="w-full border-t sply-border sply-surface py-3 px-4 md:px-8 mt-auto z-30 transition-colors duration-300">
        <div className="flex items-center justify-between text-xs tracking-wider">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
              aria-label="Toggle store links"
            >
              {isOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.nav
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-3 sply-muted"
                >
                  {SOCIAL_LINKS.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-current transition-colors text-[11px] font-bold"
                    >
                      {s.label}
                    </a>
                  ))}
                  <span className="opacity-30">/</span>
                  <button
                    type="button"
                    onClick={() => setShowNewsletter(true)}
                    className="hover:text-current transition-colors text-[11px] uppercase font-bold"
                  >
                    NEWSLETTER
                  </button>
                </motion.nav>
              )}
            </AnimatePresence>
          </div>

          <div className="text-[10px] md:text-[11px] sply-muted uppercase tracking-[0.14em]">
            &copy; {new Date().getFullYear()} OUTTERSPACE STORE
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showNewsletter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleDismissNewsletter}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-md sply-surface border sply-border p-6 md:p-8 rounded shadow-2xl"
            >
              <button
                type="button"
                onClick={handleDismissNewsletter}
                className="absolute top-4 right-4 p-1 sply-muted hover:text-current transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <h3 className="text-base font-bold tracking-[0.16em] uppercase mb-2">
                  RECEIVE WEBSITE UPDATES
                </h3>
                <p className="text-xs sply-muted tracking-wide mb-6">
                  Be the first to know about new collection drops and restocks.
                </p>

                {subscribed ? (
                  <div className="p-3 text-xs tracking-widest uppercase bg-green-500/10 text-green-400 border border-green-500/20">
                    THANK YOU FOR SUBSCRIBING
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                    <input
                      type="email"
                      required
                      placeholder="ENTER YOUR EMAIL"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 px-4 text-xs tracking-wider uppercase bg-transparent border sply-border rounded focus:outline-none focus:border-current transition-colors placeholder:text-neutral-500"
                    />
                    <button
                      type="submit"
                      className="w-full h-11 text-xs font-bold tracking-[0.18em] uppercase bg-current text-neutral-900 dark:text-neutral-950 dark:bg-white rounded hover:opacity-90 transition-opacity"
                    >
                      SUBSCRIBE
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
