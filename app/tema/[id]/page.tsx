import Link from 'next/link';
import { Montserrat } from 'next/font/google';
import { CopyButton } from '../../pages/components/CopyButton';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500'], style: ['normal', 'italic'] });

interface HadithItem {
  number: number;
  arab: string;
  id: string;
}

export default async function HadithBookPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  
  const pageStr = typeof resolvedSearchParams.page === 'string' ? resolvedSearchParams.page : '1';
  const page = Math.max(1, parseInt(pageStr, 10) || 1);
  const limit = 50;
  const start = (page - 1) * limit + 1;
  const end = page * limit;
  const range = `${start}-${end}`;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  let bookData = null;
  
  try {
    const response = await fetch(`${baseUrl}/api/hadits?id=${id}&range=${range}`, {
      cache: 'no-store'
    });
    if (response.ok) {
      const json = await response.json();
      bookData = json.data;
    }
  } catch (e) {
    console.error("Error fetching hadith data:", e);
  }

  if (!bookData) {
    return (
      <div className="min-h-screen bg-[#0F2027] text-[#F2EBD9] flex items-center justify-center py-24">
        <div className="text-center">
          <h1 className="font-cormorant text-4xl mb-4 text-[#C9A84C]">Gagal memuat data</h1>
          <Link href="/#tema" className="text-[#3D9B7F] hover:text-[#C9A84C] transition-colors tracking-widest uppercase text-sm">Kembali ke Beranda</Link>
        </div>
      </div>
    )
  }

  const totalPages = Math.ceil(bookData.available / limit);
  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <div className="min-h-screen bg-[#0F2027] text-[#F2EBD9] py-24">
      <div className="max-w-[1000px] mx-auto px-5 md:px-10">
        <Link href="/#tema" className="inline-flex items-center text-[#7A8F96] hover:text-[#C9A84C] transition-colors mb-10 text-sm tracking-widest uppercase gap-2">
          <span>&larr;</span> Kembali ke Kitab
        </Link>
        
        <header className="mb-16 border-b border-[#C9A84C]/18 pb-10">
          <h1 className="font-cormorant text-[clamp(2.5rem,5vw,4rem)] font-normal leading-[1.1] text-[#F2EBD9] mb-4">
            {bookData.name}
          </h1>
          <p className="text-[#7A8F96] text-lg font-light flex items-center gap-4">
            <span className="text-[#3D9B7F]">{bookData.available} Hadis Tersedia</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/50"></span>
            <span>Menampilkan {start}-{Math.min(end, bookData.available)}</span>
          </p>
        </header>

        <div className="flex flex-col gap-8 mb-16">
          {bookData.hadiths?.map((hadith: HadithItem) => (
            <div
              key={hadith.number}
              id={`hadith-${hadith.number}`}
              className="group relative bg-[#182E38] p-8 md:p-10 flex flex-col transition-all hover:bg-[#1E3A47] scroll-mt-28 target:ring-2 target:ring-[#C9A84C]/60 target:bg-[#1E3A47] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[linear-gradient(90deg,#2A6B5A,#C9A84C,#2A6B5A)] before:scale-x-0 before:origin-left before:transition-transform before:duration-[400ms] hover:before:scale-x-100 after:content-[''] after:absolute after:-bottom-[60px] after:-right-[60px] after:w-[140px] after:h-[140px] after:bg-[radial-gradient(circle,rgba(201,168,76,0.08),transparent_70%)] after:opacity-0 after:transition-opacity after:duration-[400ms] hover:after:opacity-100">
              <div className="flex justify-between items-start mb-8 relative z-10">
                <span className="text-[#C9A84C] font-jakarta text-2xl">#{hadith.number}</span>
                <CopyButton textToCopy={`${hadith.arab}\n\n"${hadith.id}"\n\n— ${bookData.name} No. ${hadith.number}`} />
              </div>
              
              <div className="mb-6 mt-4 relative z-10">
                <p className="font-neirizi text-2xl md:text-3xl text-[#E2C07A] text-right leading-[1.8] opacity-90" dir="rtl">
                  {hadith.arab}
                </p>
              </div>
              
              <div className="border-t border-[#C9A84C]/10 pt-5 relative z-10 text-justify">
                <blockquote className={`text-[#F2EBD9]/90 text-[0.95rem] md:text-base italic text-justify leading-relaxed border-l-2 border-[#C9A84C]/40 pl-3 ${montserrat.className}`}>
                  "{hadith.id}"
                </blockquote>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-8 border-t border-[#C9A84C]/18 pt-12">
            {isFirstPage ? (
              <span className="flex items-center justify-center w-12 h-12 rounded-full border border-[#7A8F96]/30 text-[#7A8F96]/30 cursor-not-allowed">
                &larr;
              </span>
            ) : (
              <Link 
                href={`/tema/${id}?page=${page - 1}`}
                className="flex items-center justify-center w-12 h-12 rounded-full border border-[#C9A84C]/50 text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
              >
                &larr;
              </Link>
            )}
            
            <span className="text-[#7A8F96] text-sm tracking-widest uppercase">
              Halaman <strong className="text-[#F2EBD9] font-medium px-1">{page}</strong> dari {totalPages}
            </span>

            {isLastPage ? (
              <span className="flex items-center justify-center w-12 h-12 rounded-full border border-[#7A8F96]/30 text-[#7A8F96]/30 cursor-not-allowed">
                &rarr;
              </span>
            ) : (
              <Link 
                href={`/tema/${id}?page=${page + 1}`}
                className="flex items-center justify-center w-12 h-12 rounded-full border border-[#C9A84C]/50 text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
              >
                &rarr;
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
