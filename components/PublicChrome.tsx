"use client";

import dynamic from "next/dynamic";
import { Toaster } from "sonner";

const Navbar = dynamic(() => import("@/components/Navbar"), {
  ssr: false,
  loading: () => (
    <header className="sticky top-0 z-50 bg-ink border-b border-smoke">
      <div className="bg-ember text-ink text-center py-2 text-[11px] font-bold tracking-[0.18em] uppercase min-h-[36px]" />
      <div className="h-[4.25rem] max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8" />
    </header>
  ),
});

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
  loading: () => <footer className="bg-charcoal min-h-[280px]" aria-hidden />,
});

export default function PublicChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-center" richColors closeButton duration={3000} />
      <Navbar />
      <main className="flex-1 bg-ink">{children}</main>
      <Footer />
    </>
  );
}
