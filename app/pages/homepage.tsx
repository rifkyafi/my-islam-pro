import type { Metadata } from 'next'
import { jakarta, amiri, cormorant } from './fonts'
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
    // Fetching from our internal API
    // Note: In a real server environment, we might fetch directly from the source
    // but here we use the internal route for demonstration as requested.
    // We assume the API can return a specific hadith or a random one.
    // For now, let's fetch a specific well-known hadith (e.g. Bukhari #1)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/hadits?id=bukhari&range=1-1`, {
      next: { revalidate: 3600 } // Cache for 1 hour
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
    <div className={`${jakarta.variable} ${amiri.variable} ${cormorant.variable} font-sans selection:bg-[#C9A84C]/30 selection:text-[#F2EBD9]`}>
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
