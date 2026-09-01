"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/navigation/header";
import { Footer } from "@/components/navigation/footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold tracking-widest uppercase mb-2">404 — PAGE NOT FOUND</h2>
        <p className="text-xs sply-muted tracking-wider mb-6">The page you requested could not be found.</p>
        <Link
          href="/"
          className="px-6 py-2.5 text-xs font-bold tracking-widest uppercase border sply-border rounded hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black transition-colors"
        >
          RETURN TO STORE
        </Link>
      </main>
      <Footer />
    </div>
  );
}