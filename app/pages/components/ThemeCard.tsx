"use client";

import Link from 'next/link'
import { LifeTheme } from '../types'
import { ArrowRight } from './Icons'

export function ThemeCard({ theme }: { theme: LifeTheme }) {
  return (
    <Link href={`/tema/${theme.slug}`} className="group relative bg-[#182E38] p-[1.875rem] md:px-[1.625rem] md:py-[1.875rem] no-underline flex flex-col overflow-hidden transition-all hover:bg-[#1E3A47] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[linear-gradient(90deg,#2A6B5A,#C9A84C,#2A6B5A)] before:scale-x-0 before:origin-left before:transition-transform before:duration-[400ms] hover:before:scale-x-100 after:content-[''] after:absolute after:-bottom-[60px] after:-right-[60px] after:w-[140px] after:h-[140px] after:bg-[radial-gradient(circle,rgba(201,168,76,0.08),transparent_70%)] after:opacity-0 after:transition-opacity after:duration-[400ms] hover:after:opacity-100">
      <span className="font-neirizi text-3xl text-[#C9A84C] opacity-50 text-right block mb-3.5 transition-opacity group-hover:opacity-85 leading-[1.4]" aria-label={theme.title}>
        {theme.arabic}
      </span>
      <h3 className="font-cormorant text-2xl font-medium text-[#F2EBD9] mb-2">{theme.title}</h3>
      <p className="text-[0.8rem] font-light text-[#7A8F96] leading-[1.7] mb-4 flex-1">{theme.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-[0.72rem] font-medium text-[#3D9B7F] tracking-[0.5px]">{theme.hadithCount} hadis</span>
        <span className="text-[#C9A84C] opacity-0 -translate-x-1.5 transition-all group-hover:opacity-100 group-hover:translate-x-0 flex items-center" aria-hidden="true">
          <ArrowRight size={18} />
        </span>
      </div>
    </Link>
  )
}
