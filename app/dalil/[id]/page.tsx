import Link from 'next/link'

export default function DalilDetailPage() {
  return (
    <div className="min-h-screen bg-[#0F2027] text-[#F2EBD9] py-24">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <Link href="/dalil" className="inline-flex items-center text-[#7A8F96] hover:text-[#C9A84C] transition-colors mb-10 text-sm tracking-widest uppercase gap-2">
          <span>&larr;</span> Kembali ke Dalil
        </Link>

        <div className="mb-12">
          <h1 className="font-cormorant text-[clamp(2.5rem,5vw,4rem)] font-normal leading-[1.1] text-[#F2EBD9] mb-4">
            Dalil
          </h1>
        </div>
        
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-3">
            <div className="sticky top-24">
              <h3 className="font-cormorant text-xl font-medium text-[#F2EBD9] mb-6">Sub- Tema</h3>
              <div className="flex flex-col gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <button key={i} className={`w-full text-left p-4 border rounded-lg transition-all ${i === 0 ? 'border-[#C9A84C] bg-[#C9A84C]/12 text-[#C9A84C]' : 'border-[#3D565F] hover:border-[#C9A84C]/50 text-[#7A8F96]'}`}>
                    <div className="flex items-center justify-between">
                      <span>Sub Tema {i + 1}</span>
                      {i === 0 && <span className="text-xs">4 Hadis</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-9">
            <div className="bg-[#182E38] border border-[#C9A84C]/18 p-7.5 md:p-14 relative overflow-hidden mb-8">
              <div className="absolute -top-8 left-10 font-cormorant text-[14rem] text-[#C9A84C]/5 leading-none pointer-events-none select-none" aria-hidden="true">&ldquo;</div>
              <p className="font-neirizi text-2xl md:text-[2rem] md:leading-[2.1] text-right direction-rtl text-[#E2C07A] mb-8 relative z-10">لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ</p>
              <blockquote className="font-montserrat text-[1rem] font-light italic text-[#F2EBD9] leading-[1.85] pl-6 border-l-2 border-[#C9A84C] mb-8 relative z-10">
                &ldquo;Tidak sempurna iman salah seorang di antara kalian sampai ia mencintai untuk saudaranya apa yang ia cintai untuk dirinya sendiri.&rdquo;
              </blockquote>
              <footer className="flex items-center justify-between flex-wrap gap-4 relative z-10">
                <span className="text-[0.8rem] text-[#7A8F96] italic">
                  HR. Bukhari & Muslim
                </span>
                <button className="px-4 py-1.5 border border-[#C9A84C]/50 text-[#C9A84C]/70 hover:text-[#C9A84C] transition-colors rounded-md text-xs font-medium whitespace-nowrap cursor-pointer">
                  Teks Hadis
                </button>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
