"use client";

import CountUp from "../../lib/CountUp";

export function StatsStrip() {
  const stats = [
    { value: 9,    suffix: '',  label: 'Kitab Hadis',    arabic: 'كتب',    desc: 'Kitab hadis sahih utama' },
    { value: 35000, suffix: '+', label: 'Total Hadis',   arabic: 'حديث',   desc: 'Hadis dalam semua kitab' },
    { value: 1400, suffix: '+',  label: 'Tahun Dijaga',  arabic: 'سنة',    desc: 'Warisan ilmu peradaban' },
  ]

  return (
    <div className="relative bg-[#0E1324] overflow-hidden">
      {/* Top & bottom border with gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,#D48C46/30,transparent)]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,#D48C46/30,transparent)]" />

      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group relative flex flex-col md:flex-row items-center md:items-start gap-4 py-8 px-6 md:py-10 md:px-8 border-b md:border-b-0 md:border-r border-[#D48C46]/10 last:border-0 hover:bg-[#12172B]/60 transition-colors duration-300"
            >
              {/* Large roman-numeral index */}
              <div className="absolute top-4 right-5 font-cormorant text-[2.5rem] font-light text-[#D48C46]/[0.06] group-hover:text-[#D48C46]/[0.12] leading-none select-none transition-colors duration-300" aria-hidden="true">
                {['I','II','III'][i]}
              </div>

              {/* Arabic watermark */}
              <span
                className="absolute bottom-3 right-5 font-neirizi text-[2rem] text-[#D48C46]/[0.05] group-hover:text-[#D48C46]/[0.1] select-none transition-colors duration-300"
                aria-hidden="true"
              >
                {stat.arabic}
              </span>

              {/* Left accent bar */}
              <div className="hidden md:block w-[2px] h-14 bg-[linear-gradient(to_bottom,transparent,#D48C46,transparent)] shrink-0 opacity-30 group-hover:opacity-80 transition-opacity duration-300" />

              {/* Number + label */}
              <div className="flex flex-col items-center md:items-start relative z-10">
                <span className="font-cormorant text-[2.5rem] md:text-[3rem] font-light text-[#D48C46] leading-none tracking-[-1px] flex items-end gap-1">
                  <CountUp from={0} to={stat.value} duration={2.5} />
                  <span className="text-[1.5rem] md:text-[1.75rem] text-[#C97A34] mb-1">{stat.suffix}</span>
                </span>
                <span className="text-[0.65rem] font-semibold tracking-[3px] uppercase text-[#8B95A6] group-hover:text-[#D48C46]/70 transition-colors duration-300 mt-1">
                  {stat.label}
                </span>
                <span className="text-[0.65rem] text-[#8B95A6]/50 mt-1 font-light hidden md:block">
                  {stat.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
