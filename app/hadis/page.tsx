import Link from 'next/link'
import { Suspense } from 'react'
import HadisClientView from './HadisClientView'
import { SIDEBAR_BOOK_ORDER, BOOK_DISPLAY_NAMES, type HadithBook } from '@/lib/hadith-config'

const BOOK_AVAILABLE: Record<string, number> = {
  'abu-daud': 4419, 'ahmad': 4305, 'bukhari': 6638, 'darimi': 2949,
  'ibnu-majah': 4285, 'malik': 1587, 'muslim': 4930, 'nasai': 5364,
  'tirmidzi': 3625, 'dehlawi': 40, 'nawawi': 42, 'qudsi': 40,
};

const FALLBACK_BOOKS: HadithBook[] = SIDEBAR_BOOK_ORDER.map(id => ({
  id,
  name: BOOK_DISPLAY_NAMES[id],
  available: BOOK_AVAILABLE[id],
}));

export default async function HadisPage() {
  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] py-24 pt-32">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <Link href="/" className="inline-flex items-center text-[var(--text-muted)] hover:text-[var(--text-accent)] transition-colors mb-10 text-sm tracking-widest uppercase gap-2">
          <span>&larr;</span> Kembali ke Beranda
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-3 border-b border-[var(--accent-border-light)] pb-10">
          <div>
            <span className="block text-[0.68rem] font-semibold tracking-[4.5px] uppercase text-[var(--text-accent)] mb-3">Kumpulan Hadits</span>
            <h1 className="font-cormorant text-[clamp(2.5rem,5vw,4rem)] font-normal leading-[1.1] text-[var(--text-primary)]">
              Kitab
              <br />
              Hadits
            </h1>
          </div>
          <p className="text-[1rem] lg:text-xl font-light font-neirizi text-[var(--text-muted)] max-w-full md:max-w-[400px] md:text-right leading-[1.7]">
             Kumpulan hadits sahih dari 9 imam sebagai pedoman hidup beragama umat Islam
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
          <HadisClientView books={FALLBACK_BOOKS} />
        </Suspense>
      </div>
    </div>
  )
}