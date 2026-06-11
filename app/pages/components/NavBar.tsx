"use client";

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useThemeContext } from './ThemeProvider'
import { SunIcon, MoonIcon } from './Icons'
import { useEffect, useState } from 'react'

function ThemeToggle() {
  const { theme, toggle } = useThemeContext()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="w-9 h-9" />
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center justify-center w-9 h-9 border border-[#D48C46]/30 text-[#D48C46] hover:bg-[#D48C46]/10 transition-all"
      aria-label={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
    >
      <div className="transition-transform duration-300 hover:rotate-12">
        {theme === 'dark' ? <SunIcon size={16} /> : <MoonIcon size={16} />}
      </div>
    </button>
  )
}

function NavInner() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[var(--nav-bg)] backdrop-blur-[20px] border-b border-[#D48C46]/12">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <div className="relative">
            <span className="font-neirizi text-[1.6rem] text-[#D48C46] leading-none">ح</span>
            <div className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#D48C46]/40 group-hover:bg-[#D48C46] transition-colors duration-300" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-cormorant text-[0.95rem] font-semibold text-[var(--text-primary)] tracking-[0.5px]">
              Hadis Tematik
            </span>
            <span className="text-[0.55rem] tracking-[2.5px] uppercase text-[var(--text-muted)] mt-0.5">
              Koleksi Hadis
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <ul className="hidden md:flex items-center list-none gap-1">
          {isHome && (
            <>
              <li>
                <a
                  href="#tema"
                  className="relative px-4 py-2 text-[0.8rem] font-normal text-[var(--text-muted)] no-underline tracking-[0.5px] transition-colors hover:text-[var(--text-primary)] group flex items-center gap-1.5"
                >
                  <span className="w-1 h-1 rounded-full bg-[#D48C46]/50 group-hover:bg-[#D48C46] transition-colors duration-200" />
                  Kitab
                </a>
              </li>
              <li>
                <a
                  href="#hadis-pilihan"
                  className="relative px-4 py-2 text-[0.8rem] font-normal text-[var(--text-muted)] no-underline tracking-[0.5px] transition-colors hover:text-[var(--text-primary)] group flex items-center gap-1.5"
                >
                  <span className="w-1 h-1 rounded-full bg-[#D48C46]/50 group-hover:bg-[#D48C46] transition-colors duration-200" />
                  Hadis Pilihan
                </a>
              </li>
            </>
          )}
          <li>
            <Link
              href="/dalil"
              className="relative px-4 py-2 text-[0.8rem] font-normal text-[var(--text-muted)] no-underline tracking-[0.5px] transition-colors hover:text-[var(--text-primary)] group flex items-center gap-1.5"
            >
              <span className="w-1 h-1 rounded-full bg-[#D48C46]/50 group-hover:bg-[#D48C46] transition-colors duration-200" />
              Dalil
            </Link>
          </li>
          <li className="ml-3">
            <Link
              href="?search=true"
              scroll={false}
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#D48C46]/10 border border-[#D48C46]/30 text-[#D48C46] text-[0.8rem] no-underline tracking-[0.5px] transition-all hover:bg-[#D48C46]/20 hover:border-[#D48C46]/60 hover:shadow-[0_0_16px_rgba(212,140,70,0.12)]"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Cari Dalil
            </Link>
          </li>
          <li className="ml-1">
            <ThemeToggle />
          </li>
        </ul>

        {/* Mobile actions */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Link
            href="?search=true"
            scroll={false}
            className="flex items-center justify-center w-9 h-9 border border-[#D48C46]/30 text-[#D48C46] no-underline hover:bg-[#D48C46]/10 transition-colors"
            aria-label="Cari Hadis"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[linear-gradient(90deg,transparent,#D48C46/20,transparent)]" />
    </nav>
  );
}

export function NavBar() {
  return <NavInner />;
}
