"use client";

import React from "react";
import { StoreProvider } from "@/context/store-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}