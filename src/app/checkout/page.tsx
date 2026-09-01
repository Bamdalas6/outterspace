"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/store-context";
import { formatPrice } from "@/lib/utils";
import { Lock, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const { cart, cartTotal } = useStore();

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 md:p-12 sply-surface">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-between pb-8 border-b sply-border">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-70">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to store</span>
          </Link>
          <span className="font-bold text-sm tracking-[0.2em] uppercase">OUTTERSPACE</span>
        </div>

        <div className="py-12 flex flex-col gap-8">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-emerald-500">
            <Lock className="w-4 h-4" />
            <span>Secure 256-Bit SSL Checkout</span>
          </div>

          <div className="p-6 border sply-border rounded flex flex-col gap-4">
            <h2 className="text-xs font-bold tracking-widest uppercase">Order Summary</h2>
            {cart.length === 0 ? (
              <p className="text-xs sply-muted">Your bag is empty.</p>
            ) : (
              <ul className="divide-y divide-neutral-800/20">
                {cart.map((it) => (
                  <li key={it.key} className="py-3 flex justify-between text-xs uppercase">
                    <span>{it.product.title} &times; {it.quantity}</span>
                    <span className="font-bold">{formatPrice(it.price * it.quantity)}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="pt-4 border-t sply-border flex justify-between text-sm font-bold uppercase">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-[10px] sply-muted uppercase tracking-widest">
        &copy; {new Date().getFullYear()} OUTTERSPACE STORE
      </div>
    </div>
  );
}