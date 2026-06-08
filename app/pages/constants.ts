import { LifeTheme, FeaturedHadithData } from './types'

export const LIFE_THEMES: LifeTheme[] = [
  { slug: 'ibadah', title: 'Ibadah', arabic: 'العبادة', description: 'Shalat, puasa, zakat, dan amalan wajib lainnya', hadithCount: 124 },
  { slug: 'akhlak', title: 'Akhlak', arabic: 'الأخلاق', description: 'Budi pekerti mulia dan etika dalam pergaulan', hadithCount: 96 },
  { slug: 'ilmu', title: 'Ilmu', arabic: 'العلم', description: 'Menuntut ilmu dan keutamaannya', hadithCount: 88 },
  { slug: 'doa', title: 'Doa', arabic: 'الدعاء', description: 'Doa-doa pilihan dari Rasulullah ﷺ', hadithCount: 104 },
  { slug: 'keluarga', title: 'Keluarga', arabic: 'الأسرة', description: 'Hubungan harmonis dalam rumah tangga', hadithCount: 72 },
  { slug: 'rezeki', title: 'Rezeki', arabic: 'الرزق', description: 'Pekerjaan, harta, dan keberkahan hidup', hadithCount: 68 },
  { slug: 'sedekah', title: 'Sedekah', arabic: 'الصدقة', description: 'Infaq, sedekah, dan amal kebaikan', hadithCount: 76 },
  { slug: 'persaudaraan', title: 'Persaudaraan', arabic: 'الأخوة', description: 'Ukhuwah islamiyah dan silaturahmi', hadithCount: 64 },
  { slug: 'taubat', title: 'Taubat', arabic: 'التوبة', description: 'Bertaubat dan memohon ampunan Allah', hadithCount: 52 },
  { slug: 'kesehatan', title: 'Kesehatan', arabic: 'الصحة', description: 'Menjaga kesehatan jiwa dan raga', hadithCount: 44 },
  { slug: 'cinta', title: 'Cinta', arabic: 'الحب', description: 'Kasih sayang, kelembutan, dan cinta sesama', hadithCount: 58 },
  { slug: 'kematian', title: 'Kematian', arabic: 'الموت', description: 'Persiapan menuju kehidupan abadi', hadithCount: 56 },
]

export const FEATURED_HADITH: FeaturedHadithData = {
  arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
  translation: 'Barangsiapa yang menempuh suatu jalan dalam rangka mencari ilmu, maka Allah akan mudahkan baginya jalan menuju surga.',
  source: 'HR. Muslim',
  number: '2699',
  theme: 'Ilmu',
  narrator: 'Abu Hurairah radhiyallahu anhu',
}

// HaditsPage removed due to invalid JSX in .ts file
