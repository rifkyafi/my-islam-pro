import Link from 'next/link'
import { Suspense } from 'react'
import HadisClientView from './HadisClientView'

export interface HadithBook {
  id: string;
  name: string;
  available: number;
}

export default async function HadisPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  let books: HadithBook[] = [];
  
  try {
    const response = await fetch(`${baseUrl}/api/hadits`, {
      next: { revalidate: 3600 }
    });
    if (response.ok) {
      const json = await response.json();
      books = json.data || [];
    }
  } catch (e) {
    console.error("Error fetching hadith books:", e);
  }

  return (
    <div className="min-h-screen bg-[#12172B] text-[#F0F2F5] py-24">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <Link href="/" className="inline-flex items-center text-[#8B95A6] hover:text-[#D48C46] transition-colors mb-10 text-sm tracking-widest uppercase gap-2">
          <span>&larr;</span> Kembali ke Beranda
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-3 border-b border-[#D48C46]/18 pb-10">
          <div>
            <span className="block text-[0.68rem] font-semibold tracking-[4.5px] uppercase text-[#D48C46] mb-3">Kumpulan Hadis</span>
            <h1 className="font-cormorant text-[clamp(2.5rem,5vw,4rem)] font-normal leading-[1.1] text-[#F0F2F5]">
              Kitab
              <br />
              Hadis
            </h1>
          </div>
          <p className="text-[1rem] lg:text-xl font-light font-neirizi text-[#8B95A6] max-w-full md:max-w-[400px] md:text-right leading-[1.7]">
            Kumpulan hadis sahih dari 9 imam sebagai pedoman hidup beragama umat Islam
          </p>
        </div>

        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-[#D48C46]/20 border-t-[#D48C46] rounded-full animate-spin" />
              <p className="font-cormorant text-xl text-[#D48C46]">Memuat Halaman...</p>
            </div>
          </div>
        }>
          <HadisClientView books={books} />
        </Suspense>
      </div>
    </div>
  )
}
