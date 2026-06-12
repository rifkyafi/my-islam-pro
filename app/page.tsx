import type { Metadata } from "next";
import { Suspense } from "react";
import HomePage from "./pages/homepage";

export const metadata: Metadata = {
  title: "Hadis Berdasarkan Tema Kehidupan",
  description:
    "Temukan petunjuk Rasulullah ﷺ berdasarkan tema kehidupan sehari-hari — tersusun sistematis, mudah dipahami dan diamalkan.",
  openGraph: {
  title: "Hadits Berdasarkan Tema Kehidupan",
    description: "Koleksi hadits pilihan berdasarkan tema kehidupan.",
    type: "website",
  },
};

export default async function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[var(--accent)]/20 border-t-[var(--accent)] rounded-full animate-spin" />
          <p className="font-cormorant text-xl text-[var(--text-accent)]">Memuat Beranda...</p>
        </div>
      </div>
    }>
      <HomePage />
    </Suspense>
  );
}
