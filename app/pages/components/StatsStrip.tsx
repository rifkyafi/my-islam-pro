"use client";

import CountUp from "../../lib/CountUp";

export function StatsStrip() {
  const stats = [
    { value: 12, suffix: '', label: 'Tema Kehidupan' },
    { value: 800, suffix: '+', label: 'Hadis Tersedia' },
    { value: 9, suffix: '', label: 'Kitab Hadis' },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 bg-[#132830] border-y border-[#C9A84C]/18">
      {stats.map((stat, i) => (
        <div key={i} className="flex flex-col items-center py-11 px-8 border-b md:border-b-0 md:border-r border-[#C9A84C]/18 gap-2 last:border-0">
          <span className="font-cormorant text-[3.25rem] font-light text-[#C9A84C] leading-none flex items-center justify-center">
            <CountUp from={0} to={stat.value} duration={2} />
            {stat.suffix}
          </span>
          <span className="text-[0.72rem] font-medium tracking-[3px] uppercase text-[#7A8F96]">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
