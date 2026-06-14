"use client";

import { motion, AnimatePresence } from 'motion/react'
import { FeaturedHadithData, FeaturedQuranData } from '../types'
import { CopyButton } from './CopyButton';
import { FeaturedQuran } from './FeaturedQuran';
import { useState, useEffect } from 'react';

export function FeaturedHadith({ hadithData, quranData }: { hadithData: FeaturedHadithData | null, quranData: FeaturedQuranData | null }) {
  if (!hadithData && !quranData) return null;

  const slides: ('hadith' | 'quran')[] = [];
  if (hadithData) slides.push('hadith');
  if (quranData) slides.push('quran');

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const scrollTo = (index: number) => {
    setActive(index);
  };

  const fullHadithText = hadithData
    ? `${hadithData.arabic}\n\n"${hadithData.translation}"\n\n— ${hadithData.source} No. ${hadithData.number}`
    : '';

  return (
    <motion.section
      id="hadis-pilihan"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="relative bg-[var(--bg-tertiary)] py-12 md:py-16"
    >
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[linear-gradient(to_bottom,transparent,var(--accent-border),transparent)]" aria-hidden="true" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 font-cormorant text-[22rem] text-[var(--accent-glow)] leading-none pointer-events-none select-none"
        aria-hidden="true"
      >
        &ldquo;
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-10">
        <AnimatePresence mode="wait">
          {slides[active] === 'hadith' && hadithData ? (
            <motion.div
              key="hadith"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px bg-[var(--accent-border)]" />
                  <span className="text-[0.65rem] font-semibold tracking-[5px] uppercase text-[var(--text-accent)]">
                    Hadits Pilihan
                  </span>
                </div>
                <div className="flex-1 h-px bg-[var(--accent-border-light)]" />
                <CopyButton textToCopy={fullHadithText} />
              </div>

              <div className="relative">
                <div className="flex gap-6 mb-10">
                  <div className="hidden md:flex flex-col items-center gap-2 pt-2 shrink-0">
                    <div className="w-px flex-1 bg-[linear-gradient(to_bottom,var(--accent),transparent)]" />
                  </div>
                  <p
                    className="font-neirizi text-[1.3rem] md:text-[1.6rem] leading-[1.8] text-right text-[var(--text-accent-bright)] flex-1"
                    dir="rtl"
                  >
                    {hadithData.arabic}
                  </p>
                </div>

                <blockquote className="relative pl-6 border-l-2 border-[var(--accent-border)] mb-4">
                  <p className="font-cormorant text-[1rem] md:text-[1.15rem] font-light italic text-[var(--text-primary)] leading-[1.8]">
                    &ldquo;{hadithData.translation}&rdquo;
                  </p>
                </blockquote>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 text-[0.72rem] text-[var(--text-muted)] italic">
                    {hadithData.narrator}
                  </span>
                  <span className="text-[var(--accent-border)]">·</span>
                  <span className="text-[0.7rem] font-medium tracking-[1.5px] px-3 py-1 border border-[var(--accent-border-light)] text-[var(--text-muted)]">
                    {hadithData.source} — No. {hadithData.number}
                  </span>
                  {hadithData.grade && (
                    <span className="text-[0.7rem] font-semibold tracking-[1.5px] px-3 py-1 rounded-full bg-green-900/20 border border-green-700/40 text-green-400">
                      {hadithData.grade}
                    </span>
                  )}
                  <span className="text-[0.7rem] font-medium tracking-[1.5px] px-3 py-1 bg-[var(--bg-accent-10)] border border-[var(--accent-border)] text-[var(--text-accent)]">
                    {hadithData.theme}
                  </span>
                </div>
              </div>
            </motion.div>
          ) : quranData ? (
            <motion.div
              key="quran"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <FeaturedQuran data={quranData} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex items-center justify-center gap-3 mt-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === active
                  ? 'bg-[var(--accent)] w-8 h-2.5'
                  : 'bg-[var(--accent-border)] w-2.5 h-2.5 hover:bg-[var(--accent)]/50'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  )
}
