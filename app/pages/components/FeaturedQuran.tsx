"use client";

import { motion } from 'motion/react'
import { FeaturedQuranData } from '../types'
import { CopyButton } from './CopyButton';

export function FeaturedQuran({ data }: { data: FeaturedQuranData | null }) {
  if (!data) return null;

  const fullAyahText = `${data.arabic}\n\n"${data.translation}"\n\n— QS. ${data.surahName} : ${data.verseNumber}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex items-center gap-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-[var(--accent-border)]" />
          <span className="text-[0.65rem] font-semibold tracking-[5px] uppercase text-[var(--text-accent)]">
            Quran Pilihan
          </span>
        </div>
        <div className="flex-1 h-px bg-[var(--accent-border-light)]" />
        <CopyButton textToCopy={fullAyahText} />
      </div>

      <div className="relative">
        <div className="flex gap-6 mb-10">
          <div className="hidden md:flex flex-col items-center gap-2 pt-2 shrink-0">
            <div className="w-px flex-1 bg-[linear-gradient(to_bottom,var(--accent),transparent)]" />
          </div>
          <p
            className="font-neirizi text-[1.7rem] md:text-[2.1rem] leading-[1.9] text-right text-[var(--text-accent-bright)] flex-1"
            dir="rtl"
          >
            {data.arabic}
          </p>
        </div>

        <blockquote className="relative pl-6 border-l-2 border-[var(--accent-border)] mb-8">
          <p className="font-cormorant text-[1.2rem] md:text-[1.4rem] font-light italic text-[var(--text-primary)] leading-[1.9]">
            &ldquo;{data.translation}&rdquo;
          </p>
        </blockquote>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[0.7rem] font-medium tracking-[1.5px] px-3 py-1 border border-[var(--accent-border-light)] text-[var(--text-muted)]">
            QS. {data.surahName} : {data.verseNumber}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
