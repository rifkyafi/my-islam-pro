import { HeroSection } from './components/HeroSection'
import { StatsStrip } from './components/StatsStrip'
import { ThemesSection } from './components/ThemesSection'
import { FeaturedHadith } from './components/FeaturedHadith'
import { CtaBanner } from './components/CtaBanner'
import { FeaturedHadithData } from './types'

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

    const apiUrl = process.env.NEXT_PUBLIC_HADITS_API_URL || 'https://api.hadith.gading.dev';
    const response = await fetch(`${apiUrl}/books/${selectedBook.id}?range=${hadithNumber}-${hadithNumber}`, {
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
    <div className="font-sans">
      <HeroSection />
      <StatsStrip />
      <ThemesSection />
      <FeaturedHadith data={featuredHadith} />
      <CtaBanner />
    </div>
  )
}
