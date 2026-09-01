"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export function ScrambleLoader({ onComplete }: { onComplete?: () => void }) {
  const [headingText, setHeadingText] = useState("");
  const [subText, setSubText] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("sply-loaded")) {
        setIsDone(true);
        if (onComplete) onComplete();
        return;
      }
    } catch {}

    const targetHeading = "OUTTERSPACE";
    const targetSub = "COWBOY SERIES 01";

    let frame = 0;
    const maxFrames = 36;

    const interval = setInterval(() => {
      let currentH = "";
      for (let i = 0; i < targetHeading.length; i++) {
        if (frame >= i * 2 + 8) {
          currentH += targetHeading[i];
        } else {
          currentH += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setHeadingText(currentH);

      let currentS = "";
      for (let j = 0; j < targetSub.length; j++) {
        const char = targetSub[j];
        if (char === " " || frame >= j * 1.5 + 14) {
          currentS += char;
        } else {
          currentS += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setSubText(currentS);

      frame++;

      if (frame > maxFrames) {
        clearInterval(interval);
        setHeadingText(targetHeading);
        setSubText(targetSub);

        setTimeout(() => {
          setIsDone(true);
          try {
            sessionStorage.setItem("sply-loaded", "1");
          } catch {}
          if (onComplete) onComplete();
        }, 600);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0F0F0F] text-[#FAFAFA] p-6 text-center select-none"
        >
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-[0.06em] uppercase">
              {headingText || "OUTTERSPACE"}
            </h1>
            <p className="mt-4 text-xs tracking-[0.24em] uppercase text-neutral-500 font-medium">
              {subText || "COWBOY SERIES 01"}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
