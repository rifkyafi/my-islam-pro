"use client";

import { motion } from 'motion/react'
import Link from 'next/link';
import { LifeTheme } from '../types';

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
  const meta = BOOK_META[theme.slug] ?? { arabic: 'كتاب', abbr: '—', roman: '' };
  const formattedCount = String(theme.hadithCount).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Size-specific styles mapping
  const cardStyles = {
    lg: {
      padding: 'p-8 lg:p-9',
      title: 'text-[1.8rem] lg:text-[2.2rem] md:text-[2rem]',
      arabicBg: 'text-[6.5rem] lg:text-[8rem] -bottom-3 -right-3',
      arabicSub: 'text-lg',
      count: 'text-[2.2rem] lg:text-[2.6rem]',
      spacing: 'mb-5',
      innerSpacing: 'mb-4',
      pt: 'pt-6'
    },
    md: {
      padding: 'p-7',
      title: 'text-[1.6rem] lg:text-[1.7rem]',
      arabicBg: 'text-[5.5rem] -bottom-2 -right-2',
      arabicSub: 'text-base',
      count: 'text-[1.8rem] lg:text-[2rem]',
      spacing: 'mb-5',
      innerSpacing: 'mb-4',
      pt: 'pt-6'
    },
    sm: {
      padding: 'p-5 lg:p-6',
      title: 'text-[1.25rem] lg:text-[1.35rem] leading-[1.2]',
      arabicBg: 'text-[4.5rem] lg:text-[4.8rem] -bottom-1 -right-1',
      arabicSub: 'text-sm',
      count: 'text-[1.5rem] lg:text-[1.7rem]',
      spacing: 'mb-3',
      innerSpacing: 'mb-2.5',
      pt: 'pt-4'
    }
  }[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full"
    >
      <Link
        href={theme.slug === 'quran' ? '/quran' : `/hadis?book=${theme.slug}`}
        className="group relative flex flex-col h-full w-full overflow-hidden no-underline transition-all duration-300 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border)] hover:border-[var(--accent-border)] hover:shadow-[0_0_40px_rgba(212,140,70,0.08)] hover:-translate-y-1"
      >
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-[linear-gradient(90deg,transparent,var(--accent),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="absolute top-4 right-5 font-cormorant text-[0.62rem] tracking-[3px] uppercase text-[var(--accent-border)] group-hover:text-[var(--accent)] transition-colors duration-300">
          {meta.roman}
        </span>
        <span className={`absolute font-neirizi text-[var(--accent-glow)] group-hover:text-[var(--accent)] leading-none select-none pointer-events-none transition-all duration-500 group-hover:scale-110 origin-bottom-right ${cardStyles.arabicBg}`}>
          {meta.arabic}
        </span>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-[radial-gradient(circle,rgba(212,140,70,0.07),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className={`relative z-10 flex flex-col flex-1 ${cardStyles.padding}`}>
          <div className={`flex items-start justify-between ${cardStyles.spacing}`}>
            <span className="inline-flex items-center px-2.5 py-1 border border-[var(--accent-border)] group-hover:border-[var(--accent)] text-[var(--text-accent)] group-hover:text-[var(--text-accent)] text-[0.58rem] font-semibold tracking-[3px] uppercase transition-all duration-300">
              {meta.abbr}
            </span>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="w-1.5 h-1.5 rounded-full bg-[var(--accent-border)] group-hover:bg-[var(--accent)] transition-colors duration-300 mt-1.5"
            />
          </div>
          <h3 className={`font-cormorant font-light text-[var(--text-primary)] leading-[1.15] tracking-[-0.2px] ${cardStyles.title} ${cardStyles.innerSpacing}`}>
            {theme.title}
          </h3>
          <p className={`font-neirizi text-[var(--text-accent)] group-hover:text-[var(--text-accent)] transition-colors duration-300 text-right ${cardStyles.arabicSub} ${cardStyles.innerSpacing}`}>
            {meta.arabic}
          </p>
          <div className={`w-full h-px bg-[var(--accent-border-light)] group-hover:bg-[var(--accent-border)] transition-colors duration-300 ${cardStyles.innerSpacing}`} />
          <div className={`flex items-center justify-between mt-auto ${cardStyles.pt}`}>
            <div className="flex flex-col">
              <span className={`font-cormorant font-light text-[var(--text-accent)] leading-none ${cardStyles.count}`}>
                {formattedCount}
              </span>
              <span className="text-[0.62rem] tracking-[2.5px] uppercase text-[var(--text-muted)] mt-0.5">Hadits</span>
            </div>
            <motion.div
              initial={{ x: -8, opacity: 0 }}
              whileHover={{ x: 0, opacity: 1 }}
              className="w-8 h-8 flex items-center justify-center border border-[var(--accent-border)] group-hover:border-[var(--accent)] group-hover:bg-[var(--bg-accent-10)] transition-all duration-300"
            >
              <svg className="w-3.5 h-3.5 text-[var(--text-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
