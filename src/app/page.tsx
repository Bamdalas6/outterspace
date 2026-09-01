"use client";

import React from "react";
import { useStore } from "@/context/store-context";
import { ScrambleLoader } from "@/components/hero/scramble-loader";
import { EnterScreen } from "@/components/hero/enter-screen";
import { Header } from "@/components/navigation/header";
import { MenuDrawer } from "@/components/navigation/menu-drawer";
import { GridView } from "@/components/views/grid-view";
import { RnnrView } from "@/components/views/rnnr-view";
import { RoamView } from "@/components/views/roam-view";
import { ProductDetailModal } from "@/components/product/product-detail-modal";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Footer } from "@/components/navigation/footer";

export default function Home() {
  const { view } = useStore();

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <ScrambleLoader />
      <EnterScreen />

      <Header />
      <MenuDrawer />

      <main className="flex-1 flex flex-col">
        {view === "grid" && <GridView />}
        {view === "rnnr" && <RnnrView />}
        {view === "roam" && <RoamView />}
      </main>

      <ProductDetailModal />
      <CartDrawer />

      <Footer />
    </div>
  );
}