import Link from 'next/link'
import { ArrowRight } from './Icons'

export function CtaBanner() {
  return (
    <div className="bg-[#2A6B5A] bg-[radial-gradient(ellipse_70%_100%_at_100%_50%,rgba(201,168,76,0.12),transparent),repeating-linear-gradient(45deg,transparent,transparent_40px,rgba(255,255,255,0.02)_40px,rgba(255,255,255,0.02)_41px),repeating-linear-gradient(-45deg,transparent,transparent_40px,rgba(255,255,255,0.02)_40px,rgba(255,255,255,0.02)_41px)] py-18">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
        <div>
          <p className="text-[0.7rem] font-semibold tracking-[4px] uppercase text-[#F2EBD9]/65 mb-3">Mulai Menjelajahi</p>
          <h2 className="font-cormorant text-[clamp(1.75rem,3vw,2.375rem)] font-normal text-[#F2EBD9] leading-[1.2]">
            Temukan Hadis yang
            <br />
            Kamu Butuhkan
          </h2>
        </div>
        <div className="flex gap-4 flex-wrap shrink-0">
          <Link href="?search=true" scroll={false} className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#C9A84C] text-[#0C1A1F] text-[0.85rem] font-semibold tracking-[0.5px] no-underline transition-all hover:bg-[#E2C07A] hover:-translate-y-0.5">
            Cari Hadis
            <ArrowRight size={16} />
          </Link>
          <a href="#tema" className="inline-flex items-center px-8 py-3.5 border border-[#F2EBD9]/25 text-[#F2EBD9]/80 text-[0.85rem] font-normal tracking-[0.5px] no-underline transition-all hover:border-[#F2EBD9]/50 hover:text-[#F2EBD9] hover:-translate-y-0.5">
            Lihat Semua Tema
          </a>
        </div>
      </div>
    </div>
  )
}
