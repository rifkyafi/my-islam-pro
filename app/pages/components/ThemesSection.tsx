"use client";

import { useEffect, useState } from 'react'
import { motion, type Variants } from 'motion/react'
import { ThemeCard } from './ThemeCard'

interface HadithBook {
  id: string;
  name: string;
  available: number;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
}

const itemAnim: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
}

export function ThemesSection() {
  const [books, setBooks] = useState<HadithBook[]>([])

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    fetch(`${baseUrl}/api/hadits`)
      .then(r => r.ok ? r.json() : null)
      .then(j => { if (j?.data) setBooks(j.data) })
      .catch(() => {})
  }, [])

  const totalHadith = books.reduce((sum, b) => sum + b.available, 0) + 6236

  return (
    <motion.section
      id="tema"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="py-28 bg-[var(--bg-tertiary)] relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(#D48C46 1px, transparent 1px), linear-gradient(90deg, #D48C46 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
        aria-hidden="true"
      />
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(212,140,70,0.04),transparent_65%)] pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[var(--accent-border)]" />
              <span className="text-[0.65rem] font-semibold tracking-[5px] uppercase text-[var(--text-accent)]">
                Navigasi Kitab
              </span>
            </div>
            <h2 className="font-cormorant text-[clamp(2rem,3.5vw,3rem)] font-light leading-[1.1] text-[var(--text-primary)]">
              Kitab Rujukan
              <br />
              <em className="italic text-[var(--text-accent)] opacity-80">9 Kitab Hadis dan Al-Qur&apos;an</em>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <p className="text-[0.875rem] font-light text-[var(--text-muted)] max-w-full md:max-w-[280px] md:text-right leading-[1.8]">
              Menghimpun ayat suci Al-Qur&apos;an dan ribuan hadis sahih sebagai rujukan utama umat Islam
            </p>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--accent-border)] text-[var(--text-accent)] opacity-70 text-[0.65rem] tracking-[2.5px] uppercase">
              <span className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse" />
              {String(totalHadith).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} Total Dalil
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {books.map((book) => (
            <motion.div key={book.id} variants={itemAnim} className="col-span-1 flex">
              <div className="w-full h-full">
                <ThemeCard
                  theme={{ slug: book.id, title: book.name, arabic: '', description: '', hadithCount: book.available }}
                  size="md"
                />
              </div>
            </motion.div>
          ))}
          <motion.div variants={itemAnim} className="col-span-1 flex">
            <div className="w-full h-full">
              <ThemeCard
                theme={{ slug: 'quran', title: 'Al-Qur\'an', arabic: 'القرآن الكريم', description: 'Kitab suci Al-Qur\'an Al-Karim', hadithCount: 6236 }}
                size="md"
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center mt-16 gap-4"
          aria-hidden="true"
        >
          <div className="flex-1 h-px bg-[linear-gradient(to_right,transparent,var(--accent-border))]" />
          <span className="font-neirizi text-[var(--text-accent)] opacity-30 text-lg">✦</span>
          <div className="flex-1 h-px bg-[linear-gradient(to_left,transparent,var(--accent-border))]" />
        </motion.div>
      </div>
    </motion.section>
  )
}
