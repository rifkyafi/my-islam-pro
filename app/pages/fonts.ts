import { Cormorant_Garamond, Scheherazade_New, Plus_Jakarta_Sans } from 'next/font/google'

export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const neirizi = Scheherazade_New({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-neirizi',
  display: 'swap',
})

export const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jakarta',
  display: 'swap',
})

