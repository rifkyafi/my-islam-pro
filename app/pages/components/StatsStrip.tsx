"use client";

import { motion, type Variants } from 'motion/react'
import CountUp from "../../lib/CountUp";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
}

const itemAnim: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
}

export function StatsStrip() {
  const stats = [
    { value: 9,    suffix: '',  label: 'Kitab Hadits',    arabic: 'كتب',    desc: 'Kitab hadits sahih utama' },
    { value: 35000, suffix: '+', label: 'Total Hadits',   arabic: 'حديث',   desc: 'Hadits dalam semua kitab' },
    { value: 1400, suffix: '+',  label: 'Tahun Dijaga',  arabic: 'سنة',    desc: 'Warisan ilmu peradaban' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative bg-[var(--bg-secondary)] overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,var(--accent-border),transparent)]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,var(--accent-border),transparent)]" />

      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-3"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={itemAnim}
              className="group relative flex flex-col md:flex-row items-center md:items-start gap-4 py-8 px-6 md:py-10 md:px-8 border-b md:border-b-0 md:border-r border-[var(--accent-border-light)] last:border-0 hover:bg-[var(--bg-accent-5)] transition-colors duration-300"
            >
              <div className="absolute top-4 right-5 font-cormorant text-[2.5rem] font-light text-[var(--accent-border)] group-hover:text-[var(--accent)] leading-none select-none transition-colors duration-300" aria-hidden="true">
                {['I','II','III'][i]}
              </div>
              <span
                className="absolute bottom-3 right-5 font-neirizi text-[2rem] text-[var(--accent-border-light)] group-hover:text-[var(--accent-border)] select-none transition-colors duration-300"
                aria-hidden="true"
              >
                {stat.arabic}
              </span>
              <div className="hidden md:block w-[2px] h-14 bg-[linear-gradient(to_bottom,transparent,var(--accent-border),transparent)] shrink-0 opacity-30 group-hover:opacity-80 transition-opacity duration-300" />
              <div className="flex flex-col items-center md:items-start relative z-10">
                <span className="font-cormorant text-[2.5rem] md:text-[3rem] font-light text-[var(--text-accent)] leading-none tracking-[-1px] flex items-end gap-1">
                  <CountUp from={0} to={stat.value} duration={2.5} />
                  <span className="text-[1.5rem] md:text-[1.75rem] text-[var(--text-accent-light)] mb-1">{stat.suffix}</span>
                </span>
                <span className="text-[0.65rem] font-semibold tracking-[3px] uppercase text-[var(--text-muted)] group-hover:text-[var(--text-accent)] transition-colors duration-300 mt-1">
                  {stat.label}
                </span>
                <span className="text-[0.65rem] text-[var(--text-muted)] opacity-50 mt-1 font-light hidden md:block">
                  {stat.desc}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
