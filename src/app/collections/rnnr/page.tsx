"use client";

import React, { useEffect } from "react";
import { useStore } from "@/context/store-context";
import { Header } from "@/components/navigation/header";
import { MenuDrawer } from "@/components/navigation/menu-drawer";
import { RnnrView } from "@/components/views/rnnr-view";
import { ProductDetailModal } from "@/components/product/product-detail-modal";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Footer } from "@/components/navigation/footer";

export default function RnnrPage() {
  const { setView } = useStore();
  useEffect(() => {
    setView("rnnr");
  }, [setView]);

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <Header />
      <MenuDrawer />
      <main className="flex-1 flex flex-col">
        <RnnrView />
      </main>
      <ProductDetailModal />
      <CartDrawer />
      <Footer />
    </div>
  );
}