export interface BookMeta {
  id: string;
  name: string;
  indonesianEdition: string;
  englishEdition: string;
  arabicEdition: string;
  totalHadiths: number;
  hasSections: boolean;
  sections: Record<string, string>;
  sectionDetails: Record<string, { hadithnumber_first: number; hadithnumber_last: number }>;
}

export interface HadithBook {
  id: string;
  name: string;
  available: number;
}

export const BOOK_ID_TO_FAWAZ: Record<string, string> = {
  'bukhari': 'bukhari',
  'muslim': 'muslim',
  'abu-daud': 'abudawud',
  'tirmidzi': 'tirmidhi',
  'nasai': 'nasai',
  'ibnu-majah': 'ibnmajah',
  'malik': 'malik',
  'ahmad': 'ahmad',
  'darimi': 'darimi',
  'dehlawi': 'dehlawi',
  'nawawi': 'nawawi',
  'qudsi': 'qudsi',
};

export const SIDEBAR_BOOK_ORDER = [
  'bukhari', 'muslim', 'abu-daud', 'tirmidzi', 'nasai', 'ibnu-majah',
  'malik', 'ahmad', 'darimi', 'nawawi', 'qudsi', 'dehlawi'
];

export const BOOK_DISPLAY_NAMES: Record<string, string> = {
  'bukhari': 'Bukhari',
  'muslim': 'Muslim',
  'abu-daud': 'Abu Dawud',
  'tirmidzi': 'Tirmidzi',
  'nasai': "Nasa'i",
  'ibnu-majah': 'Ibnu Majah',
  'malik': 'Malik',
  'ahmad': 'Ahmad',
  'darimi': 'Darimi',
  'dehlawi': 'Dehlawi',
  'nawawi': 'Nawawi',
  'qudsi': 'Qudsi',
};

export const FAWAZ_BOOKS = new Set([
  'bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah',
  'malik', 'dehlawi', 'nawawi', 'qudsi'
]);

export const GADING_FALLBACK_BOOKS = new Set(['ahmad', 'darimi']);

export function normalizeGrade(grades: string[]): string | null {
  if (!grades?.length) return null;
  const g = grades[0].toLowerCase();
  if (g.includes('sahih')) return 'Sahih';
  if (g.includes('hasan')) return 'Hasan';
  if (g.includes('daif') || g.includes("da'if")) return 'Daif';
  if (g.includes('mawdu')) return 'Maudu\'';
  return grades[0];
}

export function hadithToPage(hadithNumber: number): number {
  return Math.ceil(hadithNumber / 50);
}

export function getCurrentSection(
  hadithNumber: number,
  sectionDetails: Record<string, { hadithnumber_first: number; hadithnumber_last: number }>,
  sections: Record<string, string>
): string | undefined {
  for (const [sectionNum, detail] of Object.entries(sectionDetails)) {
    if (hadithNumber >= detail.hadithnumber_first && hadithNumber <= detail.hadithnumber_last) {
      return sections[sectionNum];
    }
  }
  return undefined;
}

export const FAWAZ_CDN = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1';
export const GADING_RAW = 'https://raw.githubusercontent.com/gadingnst/hadith-api/master/books';

export const HADIS_PER_PAGE = 50;

export interface UnifiedHadith {
  number: number;
  arab: string;
  id: string;
  grade?: string;
  section?: string;
  arabicNumber?: number;
}

export interface BookData {
  name: string;
  available: number;
  hadiths: UnifiedHadith[];
  currentSection?: string;
}