import Link from 'next/link'
import { ArrowRight } from './Icons'

export function CtaBanner() {
  return (
    <div className="relative bg-[#090C15] overflow-hidden py-20">
      {/* Diagonal stripe texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #D48C46 0px, #D48C46 1px, transparent 1px, transparent 60px)',
        }}
        aria-hidden="true"
      />

      {/* Warm glow blob */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_60%_80%_at_100%_50%,rgba(138,74,28,0.18),transparent)] pointer-events-none" aria-hidden="true" />

      {/* Left vertical border */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[linear-gradient(to_bottom,transparent,#D48C46/40,transparent)]" aria-hidden="true" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">

          {/* Left: text */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#D48C46]/50" />
              <p className="text-[0.65rem] font-semibold tracking-[5px] uppercase text-[#D48C46]">
                Mulai Menjelajahi
              </p>
            </div>
            <h2 className="font-cormorant text-[clamp(2rem,4vw,3rem)] font-light text-[#F0F2F5] leading-[1.15] mb-3">
              Temukan Hadis yang
              <br />
              <em className="italic text-[#E8B07D]">Kamu Butuhkan</em>
            </h2>
            <p className="text-[0.875rem] font-light text-[#8B95A6] max-w-[400px] leading-[1.8]">
              Ribuan hadis sahih tersusun rapi, siap memandu setiap langkah kehidupanmu.
            </p>
          </div>

          {/* Right: actions */}
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href="?search=true"
              scroll={false}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#D48C46] text-[#090C15] text-[0.85rem] font-semibold tracking-[0.5px] no-underline transition-all hover:bg-[#E8B07D] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(212,140,70,0.3)]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Cari Hadis
            </Link>
            <a
              href="#tema"
              className="inline-flex items-center gap-3 px-8 py-4 border border-[#D48C46]/30 text-[#D48C46] text-[0.85rem] font-normal tracking-[0.5px] no-underline transition-all hover:bg-[#D48C46]/10 hover:border-[#D48C46]/60 hover:-translate-y-1"
            >
              Lihat Semua Kitab
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Bottom stats hint */}
        <div className="flex items-center gap-8 mt-14 pt-8 border-t border-[#D48C46]/10">
          {[
            ['9', 'Kitab Hadis'],
            ['35,000+', 'Total Hadis'],
            ['Gratis', 'Selamanya'],
          ].map(([val, lbl]) => (
            <div key={lbl} className="flex flex-col">
              <span className="font-cormorant text-[1.4rem] font-light text-[#D48C46] leading-none">{val}</span>
              <span className="text-[0.62rem] tracking-[2px] uppercase text-[#8B95A6]/60 mt-1">{lbl}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
