import { HeroSection } from './components/HeroSection'
import { StatsStrip } from './components/StatsStrip'
import { ThemesSection } from './components/ThemesSection'
import { FeaturedHadith } from './components/FeaturedHadith'
import { CtaBanner } from './components/CtaBanner'
import { FeaturedHadithData, FeaturedQuranData } from './types'
import { SIDEBAR_BOOK_ORDER, BOOK_ID_TO_FAWAZ, GADING_RAW, FAWAZ_CDN } from '@/lib/hadith-config'

const FEATURED_BOOK_AVAILABLE: Record<string, number> = {
  'abu-daud': 4419, 'ahmad': 4305, 'bukhari': 6638, 'darimi': 2949,
  'ibnu-majah': 4285, 'malik': 1587, 'muslim': 4930, 'nasai': 5364,
  'tirmidzi': 3625, 'dehlawi': 40, 'nawawi': 42, 'qudsi': 40,
};

const GADING_MERGED_BOOKS = new Set(['bukhari', 'muslim', 'abu-daud', 'tirmidzi', 'nasai', 'ibnu-majah', 'malik']);

async function fetchDirectFromCDN(bookId: string, hadithNumber: number): Promise<FeaturedHadithData | null> {
  try {
    if (GADING_MERGED_BOOKS.has(bookId) || bookId === 'ahmad' || bookId === 'darimi') {
      const res = await fetch(`${GADING_RAW}/${bookId}.json`, { next: { revalidate: 86400 } });
      if (!res.ok) return null;
      const data: Array<{ number: number; arab: string; id: string }> = await res.json();
      const h = data.find(d => d.number === hadithNumber);
      if (!h) return null;
      return {
        arabic: h.arab, translation: h.id, source: bookId,
        number: h.number.toString(), theme: 'Umum', narrator: 'Rasulullah ﷺ',
      };
    }
    const fawazKey = BOOK_ID_TO_FAWAZ[bookId];
    const primaryEdition = fawazKey === 'dehlawi' || fawazKey === 'nawawi' || fawazKey === 'qudsi' ? `eng-${fawazKey}` : `ind-${fawazKey}`;
    const araEdition = `ara-${fawazKey}`;
    const [primaryRes, araRes] = await Promise.allSettled([
      fetch(`${FAWAZ_CDN}/editions/${primaryEdition}.min.json`, { next: { revalidate: 86400 } }),
      fetch(`${FAWAZ_CDN}/editions/${araEdition}.min.json`, { next: { revalidate: 86400 } }),
    ]);
    const primaryData = primaryRes.status === 'fulfilled' ? await primaryRes.value.json() : null;
    const araData = araRes.status === 'fulfilled' ? await araRes.value.json() : null;
    if (!primaryData?.hadiths) return null;
    const araMap = new Map<number, string>();
    if (araData?.hadiths) for (const h of araData.hadiths) araMap.set(h.hadithnumber, h.text);
    const h = primaryData.hadiths.find((x: { hadithnumber: number }) => x.hadithnumber === hadithNumber);
    if (!h) return null;
    return {
      arabic: araMap.get(h.hadithnumber) || '', translation: h.text, source: BOOK_ID_TO_FAWAZ[bookId] || bookId,
      number: h.hadithnumber.toString(), theme: 'Umum', narrator: 'Rasulullah ﷺ',
      grade: (h.grades?.[0]) || undefined,
    };
  } catch { return null; }
}

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

    if (!response.ok) throw new Error('API not available');

    const json = await response.json();
    const data = json.data;

    if (!data || !data.hadiths || data.hadiths.length === 0) throw new Error('No data');

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
    if (error instanceof Error && error.message === 'No data') return null;
    const today = new Date();
    const daysSinceEpoch = Math.floor(today.getTime() / 86400000);
    const books = SIDEBAR_BOOK_ORDER.filter(id => FEATURED_BOOK_AVAILABLE[id]);
    if (books.length === 0) return null;
    const bookIndex = (daysSinceEpoch * 73) % books.length;
    const selectedBookId = books[bookIndex];
    const maxHadith = FEATURED_BOOK_AVAILABLE[selectedBookId];
    const hadithNumber = (daysSinceEpoch * 137) % maxHadith + 1;
    return fetchDirectFromCDN(selectedBookId, hadithNumber);
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
