import Link from 'next/link'
import { ArrowRight, StarSvg } from './Icons'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#090C15] 
      before:content-[''] before:absolute before:inset-0 before:pointer-events-none
      before:bg-[repeating-linear-gradient(45deg,transparent,transparent_36px,rgba(201,168,76,0.022)_36px,rgba(201,168,76,0.022)_37px),repeating-linear-gradient(-45deg,transparent,transparent_36px,rgba(201,168,76,0.022)_36px,rgba(201,168,76,0.022)_37px)]
      bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(42,107,90,0.09)_0%,transparent_60%),radial-gradient(ellipse_60%_40%_at_20%_80%,rgba(201,168,76,0.05)_0%,transparent_50%)]">
      
      {/* Ornament rings */}
      <div className="absolute rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[680px] h-[680px] border border-[#D48C46]/7" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 pointer-events-none w-[520px] h-[520px] border border-[#D48C46]/6 animate-[spin_80s_linear_infinite]" 
           style={{ transform: 'translate(-50%, -50%) rotate(45deg)' }} aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 pointer-events-none w-[360px] h-[360px] border border-[#D48C46]/5 animate-[spin_60s_linear_infinite_reverse]" 
           style={{ transform: 'translate(-50%, -50%) rotate(22.5deg)' }} aria-hidden="true" />

      {/* Decorative star */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] text-[#D48C46]/6 pointer-events-none" aria-hidden="true">
        <StarSvg />
      </div>

      <div className="relative z-10 text-center max-w-[700px] px-8 pt-32 pb-16 flex flex-col items-center">
        {/* <p className="font-neirizi text-3xl text-[#D48C46] mb-8 animate-[fadeUp_1s_ease_0.1s_forwards,pulse_4s_ease-in-out_infinite] opacity-0" aria-label="Bismillahirrahmanirrahim">
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p> */}

        <p className="text-[0.7rem] font-semibold tracking-[5px] uppercase text-[#D48C46] mb-5 animate-[fadeUp_0.9s_ease_0.25s_forwards] opacity-0">Koleksi Hadis Pilihan</p>

        <h1 className="font-cormorant text-[clamp(2.75rem,6.5vw,5rem)] font-light leading-[1.12] text-[#F0F2F5] mb-6 tracking-[-0.5px] animate-[fadeUp_0.9s_ease_0.4s_forwards] opacity-0">
          Hadis Berdasarkan
          <br />
          <em className="italic text-[#E8B07D]">Tema Kehidupan</em>
        </h1>

        <div className="w-[72px] h-[1px] bg-[linear-gradient(90deg,transparent,#D48C46,transparent)] mb-7 animate-[fadeUp_0.9s_ease_0.5s_forwards] opacity-0" aria-hidden="true" />
        
        <p className="font-neirizi text-xl text-[#D48C46] mb-4 " aria-label="Dalil tentang menuntut ilmu">
          مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ
        </p>
        <p className="text-xs font-light text-[#D1A582] max-w-[500px] leading-[1.85] animate-[fadeUp_0.9s_ease_0.6s_forwards] opacity-0">
          (Barangsiapa menempuh jalan untuk mencari ilmu, maka Allah memudahkan baginya jalan menuju surga) - HR. Muslim
        </p>
        <p className="text-base font-light text-[#D1A582] max-w-[500px] leading-[1.85] mb-12 animate-[fadeUp_0.9s_ease_0.6s_forwards] opacity-0">
          Temukan petunjuk Rasulullah ﷺ yang relevan dengan kehidupan sehari-hari, tersusun dalam tema-tema yang mudah dipahami dan diamalkan.
        </p>

        <div className="flex gap-4 justify-center flex-wrap animate-[fadeUp_0.9s_ease_0.75s_forwards] opacity-0 mb-16">
          <a href="#tema" className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#D48C46] text-[#090C15] text-[0.85rem] font-semibold tracking-[0.5px] no-underline transition-all hover:bg-[#E8B07D] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(201,168,76,0.28)]">
            Jelajahi Hadits
            <ArrowRight size={16} />
          </a>
          <Link href="/dalil" className="inline-flex items-center gap-2.5 px-8 py-3.5 border border-[#D48C46]/42 text-[#D1A582] text-[0.85rem] font-normal tracking-[0.5px] no-underline transition-all hover:border-[#D48C46] hover:text-[#D48C46] hover:-translate-y-0.5">
            Cari Dalil
          </Link>
        </div>

        <div className="flex flex-col items-center gap-2 animate-[fadeUp_1s_ease_1s_forwards] opacity-0" aria-hidden="true">
          <div className="w-[1px] h-12 bg-[linear-gradient(to_bottom,#D48C46,transparent)] animate-[scrollPulse_2s_ease-in-out_infinite]" />
          <span className="text-[0.65rem] tracking-[3px] uppercase text-[#8B95A6]">Gulir ke bawah</span>
        </div>
      </div>
    </section>
  )
}
