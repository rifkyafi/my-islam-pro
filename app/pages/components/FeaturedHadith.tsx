"use client";

import { motion } from 'motion/react'
import { FeaturedHadithData, FeaturedQuranData } from '../types'
import { CopyButton } from './CopyButton';
import { FeaturedQuran } from './FeaturedQuran';
import { useRef, useState, useEffect } from 'react';

export function FeaturedHadith({ hadithData, quranData }: { hadithData: FeaturedHadithData | null, quranData: FeaturedQuranData | null }) {
  if (!hadithData && !quranData) return null;

  const slides: ('hadith' | 'quran')[] = [];
  if (hadithData) slides.push('hadith');
  if (quranData) slides.push('quran');

  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const extendedSlides = slides.length > 1 ? [...slides, slides[0]] : slides;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const index = Math.round(el.scrollLeft / el.clientWidth);
      setActive(Math.min(index, extendedSlides.length - 1));
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [extendedSlides.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || slides.length <= 1) return;
    const interval = setInterval(() => {
      const next = active + 1;
      el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
    }, 5000);
    return () => clearInterval(interval);
  }, [active, slides.length]);

  useEffect(() => {
    if (active !== extendedSlides.length - 1 || slides.length <= 1) return;
    const el = scrollRef.current;
    if (!el) return;
    const timer = setTimeout(() => {
      el.style.scrollBehavior = 'auto';
      el.scrollLeft = 0;
      el.style.scrollBehavior = '';
      setActive(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [active, extendedSlides.length, slides.length]);

  const scrollTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
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
      className="relative bg-[var(--bg-tertiary)] py-24"
    >
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[linear-gradient(to_bottom,transparent,var(--accent-border),transparent)]" aria-hidden="true" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 font-cormorant text-[22rem] text-[var(--accent-glow)] leading-none pointer-events-none select-none"
        aria-hidden="true"
      >
        &ldquo;
      </div>

      <div className="relative z-10">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
        >
          {extendedSlides.map((type, i) => (
            <div key={i} className="w-full shrink-0 snap-start flex justify-center">
              {type === 'hadith' ? (
                <div className="w-full max-w-[1280px] px-5 md:px-10">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="flex items-center gap-4 mb-10">
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
                          className="font-neirizi text-[1.7rem] md:text-[2.1rem] leading-[1.9] text-right text-[var(--text-accent-bright)] flex-1"
                          dir="rtl"
                        >
                          {hadithData?.arabic}
                        </p>
                      </div>

                      <blockquote className="relative pl-6 border-l-2 border-[var(--accent-border)] mb-8">
                        <p className="font-cormorant text-[1.2rem] md:text-[1.4rem] font-light italic text-[var(--text-primary)] leading-[1.9]">
                          &ldquo;{hadithData?.translation}&rdquo;
                        </p>
                      </blockquote>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-2 text-[0.72rem] text-[var(--text-muted)] italic">
                          {hadithData?.narrator}
                        </span>
                        <span className="text-[var(--accent-border)]">·</span>
                        <span className="text-[0.7rem] font-medium tracking-[1.5px] px-3 py-1 border border-[var(--accent-border-light)] text-[var(--text-muted)]">
                          {hadithData?.source} — No. {hadithData?.number}
                        </span>
                        <span className="text-[0.7rem] font-medium tracking-[1.5px] px-3 py-1 bg-[var(--bg-accent-10)] border border-[var(--accent-border)] text-[var(--text-accent)]">
                          {hadithData?.theme}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="w-full max-w-[1280px] px-5 md:px-10">
                  <FeaturedQuran data={quranData!} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mt-14">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === (active >= slides.length ? 0 : active)
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
