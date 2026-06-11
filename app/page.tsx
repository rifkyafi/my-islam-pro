import { Suspense } from "react";
import HomePage from "./pages/homepage";


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
