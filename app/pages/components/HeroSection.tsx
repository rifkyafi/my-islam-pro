"use client";

import Link from 'next/link'
import { motion, type Variants } from 'motion/react'
import { ArrowRight } from './Icons'

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const fadeUpFast: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg-hero)] before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:bg-[var(--ring-gradient)] bg-[var(--glow-blob)]">

      {/* Animated ornamental rings */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[680px] h-[680px] border border-[var(--hero-ring)]"
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 1, rotate: 45 }}
        transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute top-1/2 left-1/2 pointer-events-none w-[520px] h-[520px] border border-[var(--hero-ring)]"
        style={{ transform: 'translate(-50%, -50%) rotate(45deg)' }}
        aria-hidden="true"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          className="w-full h-full"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 1, rotate: -22.5 }}
        transition={{ duration: 2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute top-1/2 left-1/2 pointer-events-none w-[360px] h-[360px] border border-[var(--hero-ring-light)]"
        style={{ transform: 'translate(-50%, -50%) rotate(22.5deg)' }}
        aria-hidden="true"
      >
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="w-full h-full"
        />
      </motion.div>

      {/* Decorative star */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] text-[var(--hero-ring)] pointer-events-none"
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,5 61.8,38.2 95,50 61.8,61.8 50,95 38.2,61.8 5,50 38.2,38.2" stroke="currentColor" strokeWidth="1" fill="none" />
          <polygon points="50,15 59.5,40.5 85,50 59.5,59.5 50,85 40.5,59.5 15,50 40.5,40.5" stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.5" />
        </svg>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center max-w-[700px] px-8 pt-32 pb-16 flex flex-col items-center"
      >
        <motion.p variants={fadeUp} className="text-[0.7rem] font-semibold tracking-[5px] uppercase text-[var(--text-accent)] mb-5">
          Koleksi Hadits Pilihan
        </motion.p>

        <motion.h1 variants={fadeUp} className="font-cormorant text-[clamp(2.75rem,6.5vw,5rem)] font-light leading-[1.12] text-[var(--text-hero)] mb-6 tracking-[-0.5px]">
          Hadits Berdasarkan
          <br />
          <em className="italic text-[var(--text-accent-bright)]">Tema Kehidupan</em>
        </motion.h1>

        <motion.div variants={fadeUp} className="w-[72px] h-[1px] bg-[linear-gradient(90deg,transparent,var(--accent),transparent)] mb-7" aria-hidden="true" />
        
        <motion.div variants={fadeUp} className="flex flex-col items-center">
          <p className="font-neirizi text-xl text-[var(--text-accent)] mb-4" aria-label="Dalil tentang menuntut ilmu">
            مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ
          </p>
          <p className="text-xs font-light text-[var(--text-hero-secondary)] max-w-[500px] leading-[1.85]">
            (Barangsiapa menempuh jalan untuk mencari ilmu, maka Allah memudahkan baginya jalan menuju surga) - HR. Muslim
          </p>
        </motion.div>

        <motion.p variants={fadeUp} className="text-base font-light text-[var(--text-hero-secondary)] max-w-[500px] leading-[1.85] mb-12">
          Temukan petunjuk Rasulullah ﷺ yang relevan dengan kehidupan sehari-hari, tersusun dalam tema-tema yang mudah dipahami dan diamalkan.
        </motion.p>

        <motion.div variants={fadeUp} className="flex gap-4 justify-center flex-wrap mb-16">
          <a href="#tema" className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[var(--accent)] text-[var(--text-on-accent)] text-[0.85rem] font-semibold tracking-[0.5px] no-underline transition-all hover:bg-[var(--accent-light)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(201,168,76,0.28)]">
            Jelajahi Hadits
            <ArrowRight size={16} />
          </a>
          <Link href="/dalil" className="inline-flex items-center gap-2.5 px-8 py-3.5 border border-[var(--accent-border)] text-[var(--text-hero-secondary)] text-[0.85rem] font-normal tracking-[0.5px] no-underline transition-all hover:border-[var(--accent)] hover:text-[var(--text-accent)] hover:-translate-y-0.5">
            Cari Dalil
          </Link>
        </motion.div>

        <motion.div
          variants={fadeUpFast}
          className="flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[1px] h-12 bg-[linear-gradient(to_bottom,var(--accent),transparent)]"
          />
          <span className="text-[0.65rem] tracking-[3px] uppercase text-[var(--text-muted)]">Gulir ke bawah</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
