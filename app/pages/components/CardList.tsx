"use client";

import { useState } from 'react'
import { LifeTheme } from '../types'
import { CopyButton } from './CopyButton'

function DalilItem({ arabic, translation, sourceInfo, type, textToCopy }: {
  arabic: string
  translation: string
  sourceInfo: string
  type: 'hadith' | 'quran'
  textToCopy: string
}) {
  return (
    <div className="py-6 border-b border-[#C9A84C]/10 last:border-0">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[0.65rem] font-medium px-2 py-0.5 rounded-full tracking-wider uppercase ${
            type === 'quran'
              ? 'bg-[#2A6B5A]/20 text-[#3D9B7F] border border-[#3D9B7F]/30'
              : 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30'
          }`}>
            {type === 'quran' ? 'Al-Qur\'an' : 'Hadits'}
          </span>
          <span className="text-[0.7rem] text-[#7A8F96] tracking-wide">{sourceInfo}</span>
        </div>
        <div className="shrink-0">
          <CopyButton textToCopy={textToCopy} />
        </div>
      </div>
      
      {arabic && (
        <p className="font-neirizi text-2xl md:text-3xl text-[#E2C07A] text-right leading-[1.8] mb-6 mt-2">{arabic}</p>
      )}
      
      <blockquote
        className="text-[0.95rem] md:text-base text-[#F2EBD9]/90 italic text-justify leading-relaxed border-l-2 border-[#C9A84C]/40 pl-4 mb-2"
        style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
      >
        "{translation}"
      </blockquote>
    </div>
  )
}

export function CardList({ theme }: { theme: LifeTheme }) {
  const [expanded, setExpanded] = useState(false)

  const firstDalil = theme.dalils?.[0]
  const restDalils = theme.dalils?.slice(1) ?? []

  return (
    <div className="group relative bg-[#182E38] transition-all hover:bg-[#1E3A47] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[linear-gradient(90deg,#2A6B5A,#C9A84C,#2A6B5A)] before:scale-x-0 before:origin-left before:transition-transform before:duration-[400ms] hover:before:scale-x-100">
      {/* Header tema */}
      <div className="p-[1.875rem] md:px-[1.625rem] md:py-[1.875rem]">

        {/* 1. Judul */}
        <h3 className="font-cormorant text-3xl font-medium text-[#F2EBD9] mb-3 relative z-10">{theme.title}</h3>
        
        {/* 2. Keterangan */}
        <p className="text-[0.85rem] font-light text-[#7A8F96] leading-[1.7] mb-5 relative z-10">{theme.description}</p>
        
        {/* 3. Tiga Kata Kunci */}
        <div className="flex flex-wrap gap-2 mb-8 relative z-10">
          {theme.keywords?.map((kw) => (
            <span key={kw} className="px-3 py-1 bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] rounded-full text-[0.65rem] font-medium tracking-wide whitespace-nowrap"
              style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              {kw}
            </span>
          ))}
        </div>

        {/* Dalil pertama (selalu tampil) */}
        {firstDalil && (
          <DalilItem
            arabic={firstDalil.arabic}
            translation={firstDalil.translation}
            sourceInfo={firstDalil.sourceInfo}
            type={firstDalil.type}
            textToCopy={`${firstDalil.arabic}\n\n"${firstDalil.translation}"\n\n— ${firstDalil.sourceInfo}`}
          />
        )}

        {/* Dalil lain — tampil saat expanded */}
        {expanded && restDalils.map((d, i) => (
          <DalilItem
            key={i}
            arabic={d.arabic}
            translation={d.translation}
            sourceInfo={d.sourceInfo}
            type={d.type}
            textToCopy={`${d.arabic}\n\n"${d.translation}"\n\n— ${d.sourceInfo}`}
          />
        ))}

        {/* Footer: jumlah & tombol expand */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#C9A84C]/10">
          <span className="text-[0.72rem] font-medium text-[#3D9B7F] tracking-[0.5px]">
            {theme.hadithCount} dalil tersedia
          </span>
          {restDalils.length > 0 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[0.72rem] text-[#C9A84C] hover:text-[#F2EBD9] transition-colors font-medium tracking-wide flex items-center gap-1"
            >
              {expanded ? 'Sembunyikan' : `Lihat ${restDalils.length} dalil lainnya`}
              <span className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>↓</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
