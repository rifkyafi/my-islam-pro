export interface DalilEntry {
  arabic: string
  translation: string
  sourceInfo: string
  type: 'hadith' | 'quran'
}

export interface LifeTheme {
  slug: string
  title: string
  arabic: string
  description: string
  hadithCount: number
  translation?: string
  sourceInfo?: string
  keywords?: string[]
  dalils?: DalilEntry[]
}

export interface FeaturedHadithData {
  arabic: string
  translation: string
  source: string
  number: string
  theme: string
  narrator: string
}
