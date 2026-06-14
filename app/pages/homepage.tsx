import { HeroSection } from './components/HeroSection'
import { StatsStrip } from './components/StatsStrip'
import { ThemesSection } from './components/ThemesSection'
import { FeaturedHadith } from './components/FeaturedHadith'
import { CtaBanner } from './components/CtaBanner'
import { FeaturedHadithData, FeaturedQuranData } from './types'
import { SIDEBAR_BOOK_ORDER } from '@/lib/hadith-config'

const FEATURED_BOOK_AVAILABLE: Record<string, number> = {
  'abu-daud': 4419, 'ahmad': 4305, 'bukhari': 6638, 'darimi': 2949,
  'ibnu-majah': 4285, 'malik': 1587, 'muslim': 4930, 'nasai': 5364,
  'tirmidzi': 3625, 'dehlawi': 40, 'nawawi': 42, 'qudsi': 40,
};

async function getFeaturedHadith(): Promise<FeaturedHadithData | null> {
  try {
    const today = new Date();
    const daysSinceEpoch = Math.floor(today.getTime() / 86400000);

    const books = SIDEBAR_BOOK_ORDER.filter(id => FEATURED_BOOK_AVAILABLE[id]);
    if (books.length === 0) return null;

    const bookIndex = (daysSinceEpoch * 73) % books.length;
    const selectedBookId = books[bookIndex];
    const maxHadith = FEATURED_BOOK_AVAILABLE[selectedBookId];

    const hadithNumber = (daysSinceEpoch * 137) % maxHadith + 1;

    const origin = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const response = await fetch(`${origin}/api/hadits?id=${selectedBookId}&range=${hadithNumber}-${hadithNumber}`, {
      next: { revalidate: 86400 }
    });

    if (!response.ok) return null;

    const json = await response.json();
    const data = json.data;

    if (!data || !data.hadiths || data.hadiths.length === 0) return null;

    const hadith = data.hadiths[0];

    return {
      arabic: hadith.arab,
      translation: hadith.id,
      source: data.name,
      number: hadith.number.toString(),
      theme: 'Umum',
      narrator: 'Rasulullah ﷺ',
      grade: hadith.grade || undefined,
    };
  } catch (error) {
    console.error("Error fetching featured hadith:", error);
    return null;
  }
}

async function getFeaturedQuran(): Promise<FeaturedQuranData | null> {
  try {
    const today = new Date();
    const daysSinceEpoch = Math.floor(today.getTime() / 86400000);

    // Pilih surah secara pseudorandom (1-114)
    const surahNumber = (daysSinceEpoch * 47) % 114 + 1;

    const apiUrl = process.env.NEXT_PUBLIC_QURAN_API_URL || 'https://equran.id/api/v2';
    const response = await fetch(`${apiUrl}/surat/${surahNumber}`, {
      next: { revalidate: 86400 }
    });

    if (!response.ok) return null;

    const json = await response.json();
    const data = json.data;

    if (!data || !data.ayat || data.ayat.length === 0) return null;

    const verseIndex = (daysSinceEpoch * 137) % data.ayat.length;
    const verse = data.ayat[verseIndex];

    return {
      arabic: verse.teksArab,
      translation: verse.teksIndonesia,
      surahName: data.namaLatin,
      surahNumber: data.nomor,
      verseNumber: verse.nomorAyat,
    };
  } catch (error) {
    console.error("Error fetching featured quran:", error);
    return null;
  }
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const featuredHadith = await getFeaturedHadith();
  const featuredQuran = await getFeaturedQuran();

  return (
    <div className="font-sans">
      <HeroSection />
      <StatsStrip />
      <ThemesSection />
      <FeaturedHadith hadithData={featuredHadith} quranData={featuredQuran} />
      <CtaBanner />
    </div>
  )
}
