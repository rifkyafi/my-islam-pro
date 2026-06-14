import { NextResponse } from "next/server";
import {
  BOOK_ID_TO_FAWAZ,
  FAWAZ_CDN, GADING_RAW, HADIS_PER_PAGE,
  normalizeGrade, getCurrentSection, SIDEBAR_BOOK_ORDER, BOOK_DISPLAY_NAMES,
  type UnifiedHadith, type HadithBook
} from "@/lib/hadith-config";

const BOOKS: HadithBook[] = SIDEBAR_BOOK_ORDER.map(id => ({
  id,
  name: BOOK_DISPLAY_NAMES[id],
  available: 0,
}));

interface CacheEntry {
  hadiths: UnifiedHadith[];
  name: string;
  available: number;
}

interface SectionMeta {
  sections: Record<string, string>;
  sectionDetails: Record<string, { hadithnumber_first: number; hadithnumber_last: number }>;
}

const mergedCache = new Map<string, CacheEntry>();
const fawazCache = new Map<string, CacheEntry>();
const gadingCache = new Map<string, CacheEntry>();
const metaCache = new Map<string, SectionMeta>();
const pendingFetch = new Map<string, Promise<unknown>>();

const BOOK_AVAILABLE: Record<string, number> = {
  'abu-daud': 4419, 'ahmad': 4305, 'bukhari': 6638, 'darimi': 2949,
  'ibnu-majah': 4285, 'malik': 1587, 'muslim': 4930, 'nasai': 5364,
  'tirmidzi': 3625, 'dehlawi': 40, 'nawawi': 42, 'qudsi': 40,
};

const BOOK_NAME: Record<string, string> = {
  'abu-daud': 'Abu Dawud', 'ahmad': 'Ahmad', 'bukhari': 'Bukhari',
  'darimi': 'Darimi', 'ibnu-majah': 'Ibnu Majah', 'malik': 'Malik',
  'muslim': 'Muslim', 'nasai': "Nasa'i", 'tirmidzi': 'Tirmidzi',
  'dehlawi': 'Dehlawi', 'nawawi': 'Nawawi', 'qudsi': 'Qudsi',
};

// Route: which source for which book
const GADING_MERGED_BOOKS = new Set(['bukhari', 'muslim', 'abu-daud', 'tirmidzi', 'nasai', 'ibnu-majah', 'malik']);
const GADING_ONLY_BOOKS = new Set(['ahmad', 'darimi']);
const FAWAZ_ONLY_BOOKS = new Set(['dehlawi', 'nawawi', 'qudsi']);

// ─── Fawaz Metadata (sections only) ─────────────────────────────────

async function fetchFawazMetadata(fawazKey: string): Promise<SectionMeta> {
  const cached = metaCache.get(fawazKey);
  if (cached) return cached;

  const inFlight = pendingFetch.get(`meta:${fawazKey}`);
  if (inFlight) {
    const result = await inFlight;
    return result as SectionMeta;
  }

  const promise = (async () => {
    const edition = `ind-${fawazKey}`;
    const res = await fetch(`${FAWAZ_CDN}/editions/${edition}.min.json`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return { sections: {}, sectionDetails: {} };
    const data = await res.json();
    const result: SectionMeta = {
      sections: data.metadata?.sections || {},
      sectionDetails: data.metadata?.section_details || data.metadata?.section_detail || {},
    };
    metaCache.set(fawazKey, result);
    pendingFetch.delete(`meta:${fawazKey}`);
    return result;
  })();

  pendingFetch.set(`meta:${fawazKey}`, promise);
  const result = await promise;
  return result;
}

// ─── Gading.dev (primary source for 7+2 books) ─────────────────────

const INDONESIAN_EDITION_KEYS = new Set(['bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah', 'malik']);

async function fetchGadingBook(bookId: string): Promise<CacheEntry> {
  const cached = gadingCache.get(bookId);
  if (cached) return cached;

  const inFlight = pendingFetch.get(`gading:${bookId}`);
  if (inFlight) {
    const result = await inFlight;
    return result as CacheEntry;
  }

  const promise = (async () => {
    const url = `${GADING_RAW}/${bookId}.json`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Failed to fetch ${bookId}: ${res.status}`);
    const data: Array<{ number: number; arab: string; id: string }> = await res.json();
    const hadiths: UnifiedHadith[] = data.map(h => ({
      number: h.number,
      arab: h.arab,
      id: h.id,
    }));
    const entry: CacheEntry = {
      hadiths,
      name: BOOK_NAME[bookId] || bookId,
      available: hadiths.length,
    };
    gadingCache.set(bookId, entry);
    pendingFetch.delete(`gading:${bookId}`);
    return entry;
  })();

  pendingFetch.set(`gading:${bookId}`, promise);
  const result = await promise;
  return result;
}

// ─── Gading + Fawaz Sections (merged for 7 books) ──────────────────

async function fetchGadingBookWithSections(bookId: string): Promise<CacheEntry> {
  const cached = mergedCache.get(bookId);
  if (cached) return cached;

  const inFlight = pendingFetch.get(`merged:${bookId}`);
  if (inFlight) {
    const result = await inFlight;
    return result as CacheEntry;
  }

  const promise = (async () => {
    const [gadingEntry, fawazMeta] = await Promise.all([
      fetchGadingBook(bookId),
      fetchFawazMetadata(BOOK_ID_TO_FAWAZ[bookId]),
    ]);

    const hadiths: UnifiedHadith[] = gadingEntry.hadiths.map(h => ({
      ...h,
      section: getCurrentSection(h.number, fawazMeta.sectionDetails, fawazMeta.sections),
    }));

    const entry: CacheEntry = {
      hadiths,
      name: gadingEntry.name,
      available: gadingEntry.available,
    };
    mergedCache.set(bookId, entry);
    pendingFetch.delete(`merged:${bookId}`);
    return entry;
  })();

  pendingFetch.set(`merged:${bookId}`, promise);
  const result = await promise;
  return result;
}

// ─── Fawazahmed0 (for bonus books: dehlawi, nawawi, qudsi) ─────────

async function fetchFawazBook(bookId: string): Promise<CacheEntry> {
  const cached = fawazCache.get(bookId);
  if (cached) return cached;

  const fawazKey = BOOK_ID_TO_FAWAZ[bookId];
  const hasIndonesian = INDONESIAN_EDITION_KEYS.has(fawazKey);
  const primaryEdition = hasIndonesian ? `ind-${fawazKey}` : `eng-${fawazKey}`;
  const araEdition = `ara-${fawazKey}`;

  const inFlight = pendingFetch.get(`fawaz:${bookId}`);
  if (inFlight) {
    const result = await inFlight;
    return result as CacheEntry;
  }

  const promise = (async () => {
    const [primaryRes, araRes] = await Promise.allSettled([
      fetch(`${FAWAZ_CDN}/editions/${primaryEdition}.min.json`, { next: { revalidate: 3600 } }),
      fetch(`${FAWAZ_CDN}/editions/${araEdition}.min.json`, { next: { revalidate: 3600 } }),
    ]);

    const primaryData = primaryRes.status === 'fulfilled'
      ? await primaryRes.value.json()
      : null;
    const araData = araRes.status === 'fulfilled'
      ? await araRes.value.json()
      : null;

    if (!primaryData?.hadiths) {
      throw new Error(`Failed to fetch ${bookId} (${primaryEdition})`);
    }

    const araMap = new Map<number, string>();
    if (araData?.hadiths) {
      for (const h of araData.hadiths) {
        araMap.set(h.hadithnumber, h.text);
      }
    }

    const sections = primaryData.metadata?.sections || {};
    const sectionDetails = primaryData.metadata?.section_details || primaryData.metadata?.section_detail || {};

    const name = BOOK_NAME[bookId] || primaryData.metadata?.name || fawazKey;
    const available = BOOK_AVAILABLE[bookId] || primaryData.metadata?.last_hadithnumber || primaryData.hadiths.length;

    const hadiths: UnifiedHadith[] = primaryData.hadiths.map((h: { hadithnumber: number; arabicnumber?: number; text: string; grades?: string[] }) => ({
      number: h.hadithnumber,
      arab: araMap.get(h.hadithnumber) || '',
      id: h.text,
      grade: normalizeGrade(h.grades || []),
      arabicNumber: h.arabicnumber || h.hadithnumber,
      section: getCurrentSection(h.hadithnumber, sectionDetails, sections),
    }));

    const entry: CacheEntry = { hadiths, name, available };
    fawazCache.set(bookId, entry);
    pendingFetch.delete(`fawaz:${bookId}`);
    return entry;
  })();

  pendingFetch.set(`fawaz:${bookId}`, promise);
  const result = await promise;
  return result;
}

// ─── Router ────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    const data = BOOKS.map(b => ({
      ...b,
      available: BOOK_AVAILABLE[b.id] || 0,
    }));
    return NextResponse.json({ data });
  }

  if (!GADING_MERGED_BOOKS.has(id) && !GADING_ONLY_BOOKS.has(id) && !FAWAZ_ONLY_BOOKS.has(id)) {
    return NextResponse.json({ message: `Book "${id}" not found` }, { status: 404 });
  }

  const range = searchParams.get("range");
  const hadithLookup = searchParams.get("hadith");

  try {
    let entry: CacheEntry;

    if (GADING_MERGED_BOOKS.has(id)) {
      entry = await fetchGadingBookWithSections(id);
    } else if (GADING_ONLY_BOOKS.has(id)) {
      entry = await fetchGadingBook(id);
    } else {
      entry = await fetchFawazBook(id);
    }

    const { hadiths: allHadiths, name, available } = entry;

    if (hadithLookup) {
      const hadithNumber = parseInt(hadithLookup, 10);
      const idx = allHadiths.findIndex((h) => h.number === hadithNumber);
      if (idx === -1) {
        return NextResponse.json({ page: null, error: "not found" });
      }
      const page = Math.floor(idx / HADIS_PER_PAGE) + 1;
      return NextResponse.json({ page, index: idx });
    }

    if (!range) {
      return NextResponse.json({
        data: { name, available, hadiths: allHadiths },
      });
    }

    let start: number;
    let end: number;

    if (/^\d+$/.test(range)) {
      const idx = parseInt(range, 10) - 1;
      start = idx;
      end = idx + 1;
    } else {
      const parts = range.split("-");
      start = parseInt(parts[0], 10) - 1;
      end = parseInt(parts[1], 10);
    }

    const hadiths = allHadiths.slice(start, end);

    return NextResponse.json({
      data: { name, available, hadiths },
    });
  } catch (error: unknown) {
    console.error("Error fetching hadith data:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}