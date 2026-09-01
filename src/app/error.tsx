"use client";

import React from "react";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center sply-surface">
      <h2 className="text-lg font-bold tracking-widest uppercase mb-2">SOMETHING WENT WRONG</h2>
      <p className="text-xs sply-muted tracking-wider mb-6">An unexpected error occurred.</p>
      <button
        type="button"
        onClick={() => reset()}
        className="px-6 py-2.5 text-xs font-bold tracking-widest uppercase border sply-border rounded hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black transition-colors"
      >
        RETRY
      </button>
    </div>
  );
}