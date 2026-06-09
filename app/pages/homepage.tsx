import type { Metadata } from 'next'
import { NavBar } from './components/NavBar'
import { HeroSection } from './components/HeroSection'
import { StatsStrip } from './components/StatsStrip'
import { ThemesSection } from './components/ThemesSection'
import { FeaturedHadith } from './components/FeaturedHadith'
import { CtaBanner } from './components/CtaBanner'
import { Footer } from './components/Footer'
import { FeaturedHadithData } from './types'

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Hadis Berdasarkan Tema Kehidupan',
  description:
    'Temukan petunjuk Rasulullah ﷺ berdasarkan tema kehidupan sehari-hari — tersusun sistematis, mudah dipahami dan diamalkan.',
  openGraph: {
    title: 'Hadis Berdasarkan Tema Kehidupan',
    description: 'Koleksi hadis pilihan berdasarkan tema kehidupan.',
    type: 'website',
  },
}

async function getFeaturedHadith(): Promise<FeaturedHadithData | null> {
  try {
    // Menghitung hari saat ini sejak epoch agar konsisten berubah tiap 24 jam
    const today = new Date();
    // Menggunakan offset waktu Asia/Jakarta (WIB) atau biarkan local/UTC
    // Menggunakan Math.floor untuk pembulatan hari
    const daysSinceEpoch = Math.floor(today.getTime() / 86400000);
    
    // Daftar semua kitab hadits dan batas jumlah maksimalnya sesuai API
    const books = [
      { id: "abu-daud", max: 4419 },
      { id: "ahmad", max: 4305 },
      { id: "bukhari", max: 6638 },
      { id: "darimi", max: 2949 },
      { id: "ibnu-majah", max: 4285 },
      { id: "malik", max: 1587 },
      { id: "muslim", max: 4930 },
      { id: "nasai", max: 5364 },
      { id: "tirmidzi", max: 3625 }
    ];

    // Pilih kitab secara pseudorandom berdasarkan hari
    const bookIndex = (daysSinceEpoch * 73) % books.length;
    const selectedBook = books[bookIndex];

    // Pilih nomor hadits secara pseudorandom dalam batas kitab yang terpilih
    const hadithNumber = (daysSinceEpoch * 137) % selectedBook.max + 1;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/hadits?id=${selectedBook.id}&range=${hadithNumber}-${hadithNumber}`, {
      next: { revalidate: 86400 } // Cache selama 24 jam
    });
    
    if (!response.ok) return null;
    
    const json = await response.json();
    const data = json.data;
    
    if (!data || !data.hadiths || data.hadiths.length === 0) return null;
    
    const hadith = data.hadiths[0]; // Get the first one for example
    
    return {
      arabic: hadith.arab,
      translation: hadith.id, // Usually the 'id' field in this specific API is the Indonesian translation
      source: data.name,
      number: hadith.number.toString(),
      theme: 'Umum',
      narrator: 'Rasulullah ﷺ'
    };
  } catch (error) {
    console.error("Error fetching featured hadith:", error);
    return null;
  }
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const featuredHadith = await getFeaturedHadith();

  return (
    <div className="font-sans selection:bg-[#C9A84C]/30 selection:text-[#F2EBD9]">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollPulse {
          0%, 100% { transform: scaleY(1); opacity: 1; }
          50%       { transform: scaleY(0.5); opacity: 0.4; }
        }
      `}</style>
      <NavBar />
      <HeroSection />
      <StatsStrip />
      <ThemesSection />
      <FeaturedHadith data={featuredHadith} />
      <CtaBanner />
      <Footer />
    </div>
  )
}
