"use client";

import { motion } from 'motion/react'
import { FeaturedHadithData } from '../types'
import { CopyButton } from './CopyButton';

export function FeaturedHadith({ data }: { data: FeaturedHadithData | null }) {
  if (!data) return null;

  const fullHadithText = `${data.arabic}\n\n"${data.translation}"\n\n— ${data.source} No. ${data.number}`;

  return (
    <motion.section
      id="hadis-pilihan"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="relative bg-[var(--bg-tertiary)] py-24 overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[linear-gradient(to_bottom,transparent,var(--accent-border),transparent)]" aria-hidden="true" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 font-cormorant text-[22rem] text-[var(--accent-glow)] leading-none pointer-events-none select-none"
        aria-hidden="true"
      >
        &ldquo;
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-[var(--accent-border)]" />
            <span className="text-[0.65rem] font-semibold tracking-[5px] uppercase text-[var(--text-accent)]">
              Hadis Pilihan
            </span>
          </div>
          <div className="flex-1 h-px bg-[var(--accent-border-light)]" />
          <CopyButton textToCopy={fullHadithText} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-0 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
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
              <span className="inline-flex items-center gap-2 text-[0.72rem] text-[var(--text-muted)] italic">
                {data.narrator}
              </span>
              <span className="text-[var(--accent-border)]">·</span>
              <span className="text-[0.7rem] font-medium tracking-[1.5px] px-3 py-1 border border-[var(--accent-border-light)] text-[var(--text-muted)]">
                {data.source} — No. {data.number}
              </span>
              <span className="text-[0.7rem] font-medium tracking-[1.5px] px-3 py-1 bg-[var(--bg-accent-10)] border border-[var(--accent-border)] text-[var(--text-accent)]">
                {data.theme}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hidden lg:flex flex-col items-center justify-center w-48 self-stretch"
          >
            <div className="w-full flex-1 flex flex-col items-center justify-center gap-6 border border-[var(--accent-border-light)] p-6">
              <div className="w-px h-10 bg-[linear-gradient(to_bottom,transparent,var(--accent-border))]" />
              <span className="font-neirizi text-5xl text-[var(--accent-border)] leading-none" aria-hidden="true">
                الحديث
              </span>
              <span className="font-neirizi text-3xl text-[var(--accent-glow)] leading-none" aria-hidden="true">
                ✦
              </span>
              <span className="font-neirizi text-4xl text-[var(--accent-glow)] leading-none" aria-hidden="true">
                النبوي
              </span>
              <div className="w-px h-10 bg-[linear-gradient(to_bottom,var(--accent-border),transparent)]" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
