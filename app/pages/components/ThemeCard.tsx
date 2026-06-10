"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LifeTheme } from '../types';

// Arabic calligraphy abbreviation per book slug
const BOOK_META: Record<string, { arabic: string; abbr: string; roman: string }> = {
  'bukhari':   { arabic: 'البخاري',     abbr: 'BKH', roman: 'I'   },
  'muslim':    { arabic: 'مسلم',        abbr: 'MSL', roman: 'II'  },
  'abu-daud':  { arabic: 'أبو داود',    abbr: 'ABD', roman: 'III' },
  'tirmidzi':  { arabic: 'الترمذي',     abbr: 'TMZ', roman: 'IV'  },
  'nasai':     { arabic: 'النسائي',     abbr: 'NSI', roman: 'V'   },
  'ibnu-majah':{ arabic: 'ابن ماجه',    abbr: 'IMJ', roman: 'VI'  },
  'ahmad':     { arabic: 'أحمد',        abbr: 'AHM', roman: 'VII' },
  'malik':     { arabic: 'مالك',        abbr: 'MLK', roman: 'VIII'},
  'darimi':    { arabic: 'الدارمي',     abbr: 'DRM', roman: 'IX'  },
  'quran':     { arabic: 'القرآن',     abbr: 'QRN', roman: 'X'   },
};

export function ThemeCard({ theme, size = 'md' }: { theme: LifeTheme; size?: 'sm' | 'md' | 'lg' }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const meta = BOOK_META[theme.slug] ?? { arabic: 'كتاب', abbr: '—', roman: '' };
  const formattedCount = String(theme.hadithCount).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Avoid hydration mismatch by rendering a consistent structure on server and client initial pass
  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[250px] bg-[#12172B] border border-[#D48C46]/12 rounded-sm" />
    );
  }

  return (
    <Link
      href={theme.slug === 'quran' ? '/quran' : `/hadis?book=${theme.slug}`}
      className="group relative flex flex-col h-full w-full overflow-hidden no-underline transition-all duration-300 bg-[#12172B] hover:bg-[#1A223D] border border-[#D48C46]/12 hover:border-[#D48C46]/40 hover:shadow-[0_0_40px_rgba(212,140,70,0.08)] hover:-translate-y-1"
    >
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-[linear-gradient(90deg,transparent,#D48C46,transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="absolute top-4 right-5 font-cormorant text-[0.62rem] tracking-[3px] uppercase text-[#D48C46]/25 group-hover:text-[#D48C46]/50 transition-colors duration-300">
        {meta.roman}
      </span>
      <span className={`absolute -bottom-2 -right-2 font-neirizi text-[#D48C46]/[0.04] group-hover:text-[#D48C46]/[0.09] leading-none select-none pointer-events-none transition-all duration-500 group-hover:scale-110 origin-bottom-right ${size === 'lg' ? 'text-[9rem]' : 'text-[5.5rem]'}`}>
        {meta.arabic}
      </span>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-[radial-gradient(circle,rgba(212,140,70,0.07),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 flex flex-col flex-1 p-7">
        <div className="flex items-start justify-between mb-5">
          <span className="inline-flex items-center px-2.5 py-1 border border-[#D48C46]/20 group-hover:border-[#D48C46]/50 text-[#D48C46]/60 group-hover:text-[#D48C46] text-[0.58rem] font-semibold tracking-[3px] uppercase transition-all duration-300">
            {meta.abbr}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#D48C46]/20 group-hover:bg-[#D48C46]/60 transition-colors duration-300 mt-1.5" />
        </div>
        <h3 className={`font-cormorant font-light text-[#F0F2F5] leading-[1.15] mb-1.5 tracking-[-0.2px] ${size === 'lg' ? 'text-[2.5rem]' : 'text-[1.7rem]'}`}>
          {theme.title}
        </h3>
        <p className="font-neirizi text-base text-[#D48C46]/55 group-hover:text-[#D48C46]/80 transition-colors duration-300 text-right mb-4">
          {meta.arabic}
        </p>
        <div className="w-full h-px bg-[#D48C46]/10 group-hover:bg-[#D48C46]/20 transition-colors duration-300 mb-4" />
        <div className="flex items-center justify-between mt-auto pt-6">
          <div className="flex flex-col">
            <span className={`font-cormorant font-light text-[#D48C46] leading-none ${size === 'lg' ? 'text-[2.75rem]' : 'text-[2rem]'}`}>
              {formattedCount}
            </span>
            <span className="text-[0.62rem] tracking-[2.5px] uppercase text-[#8B95A6] mt-0.5">Hadis</span>
          </div>
          <div className="w-8 h-8 flex items-center justify-center border border-[#D48C46]/20 group-hover:border-[#D48C46]/60 group-hover:bg-[#D48C46]/10 transition-all duration-300 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
            <svg className="w-3.5 h-3.5 text-[#D48C46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
