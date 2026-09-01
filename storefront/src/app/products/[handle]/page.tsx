"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { StoreProvider, useStore } from "@/context/store-context";
import { Header } from "@/components/navigation/header";
import { MenuDrawer } from "@/components/navigation/menu-drawer";
import { GridView } from "@/components/views/grid-view";
import { ProductDetailModal } from "@/components/product/product-detail-modal";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Footer } from "@/components/navigation/footer";

function ProductContent() {
  const params = useParams();
  const { setActivePdpHandle } = useStore();

  useEffect(() => {
    if (params && params.handle) {
      setActivePdpHandle(params.handle as string);
    }
  }, [params, setActivePdpHandle]);

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <Header />
      <MenuDrawer />
      <main className="flex-1 flex flex-col">
        <GridView />
      </main>
      <ProductDetailModal />
      <CartDrawer />
      <Footer />
    </div>
  );
}

export default function ProductRoute() {
  return (
    <StoreProvider>
      <ProductContent />
    </StoreProvider>
  );
}