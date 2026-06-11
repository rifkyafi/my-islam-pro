import Link from 'next/link'
import { Suspense } from 'react'
import QuranClientView, { Surah } from './QuranClientView'

interface EQuranSurah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
}

export default async function QuranPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  let surahs: Surah[] = [];
  
  try {
    const response = await fetch(`${baseUrl}/api/quran?endpoint=/surat`, {
      next: { revalidate: 3600 }
    });
    if (response.ok) {
      const json = await response.json();
      // Map equran.id fields to the expected Surah interface
      surahs = (json.data || []).map((s: EQuranSurah) => ({
        nomor: s.nomor,
        nama: s.nama,
        nama_latin: s.namaLatin,
        jumlah_ayat: s.jumlahAyat,
        tempat_turun: s.tempatTurun,
        arti: s.arti,
        deskripsi: s.deskripsi,
        audio: s.audioFull?.['05'] || '' // Using Misyari Rasyid Al-Afasi
      }));
    }
  } catch (e) {
    console.error("Error fetching surahs:", e);
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] py-24 pt-32">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <Link href="/" className="inline-flex items-center text-[var(--text-muted)] hover:text-[var(--text-accent)] transition-colors mb-10 text-sm tracking-widest uppercase gap-2">
          <span>&larr;</span> Kembali ke Beranda
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-3 border-b border-[var(--accent-border-light)] pb-10">
          <div>
            <span className="block text-[0.68rem] font-semibold tracking-[4.5px] uppercase text-[var(--text-accent)] mb-3">Kitab Suci</span>
            <h1 className="font-cormorant text-[clamp(2.5rem,5vw,4rem)] font-normal leading-[1.1] text-[var(--text-primary)]">
              Al-Qur&apos;an
              <br />
              Al-Karim
            </h1>
          </div>
          <p className="text-[1rem] lg:text-xl font-light font-neirizi text-[var(--text-muted)] max-w-full md:max-w-[400px] md:text-right leading-[1.7]">
            Kalam Allah yang diturunkan kepada Nabi Muhammad ﷺ sebagai petunjuk bagi seluruh umat manusia
          </p>
        </div>

        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-[var(--accent)]/20 border-t-[var(--accent)] rounded-full animate-spin" />
              <p className="font-cormorant text-xl text-[var(--text-accent)]">Memuat Halaman...</p>
            </div>
          </div>
        }>
          <QuranClientView surahs={surahs} />
        </Suspense>
      </div>
    </div>
  )
}
