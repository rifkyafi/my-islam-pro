import { NextResponse } from "next/server";
import https from "https";

const BOOKS = [
  { id: "abu-daud", name: "Abu Dawud", max: 4419 },
  { id: "ahmad", name: "Ahmad", max: 4305 },
  { id: "bukhari", name: "Bukhari", max: 6638 },
  { id: "darimi", name: "Darimi", max: 2949 },
  { id: "ibnu-majah", name: "Ibnu Majah", max: 4285 },
  { id: "malik", name: "Malik", max: 1587 },
  { id: "muslim", name: "Muslim", max: 4930 },
  { id: "nasai", name: "Nasa'i", max: 5364 },
  { id: "tirmidzi", name: "Tirmidzi", max: 3625 },
];

// Module-level in-memory index (shared across requests, built once)
type IndexedHadith = {
  number: number;
  arab: string;
  id: string;
  bookId: string;
};

const hadithIndex: IndexedHadith[] = [];
let indexBuilt = false;
let indexBuilding = false;

function fetchWithHttps(url: string, timeoutMs = 10000): Promise<{ status: number | undefined; data: any }> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch (e) { reject(e); }
      });
    });
    req.setTimeout(timeoutMs, () => { req.destroy(); reject(new Error("timeout")); });
    req.on("error", reject);
  });
}

async function fetchRange(baseUrl: string, bookId: string, start: number, end: number): Promise<IndexedHadith[]> {
  try {
    const res = await fetchWithHttps(`${baseUrl}/books/${bookId}?range=${start}-${end}`);
    if (res.status !== 200) return [];
    const hadiths: any[] = res.data?.data?.hadiths ?? res.data?.hadiths ?? [];
    return hadiths.map((h) => ({
      number: h.number,
      arab: h.arab ?? "",
      id: h.id ?? "",
      bookId,
    }));
  } catch {
    return [];
  }
}

// Build the index: sample ~200 hadiths per book from 8 evenly-spaced positions
async function buildIndex(baseUrl: string) {
  if (indexBuilt || indexBuilding) return;
  indexBuilding = true;

  const CHUNK = 25;   // hadiths per fetch
  const POSITIONS = 8; // positions per book

  const tasks = BOOKS.map((book) => {
    const step = Math.floor(book.max / (POSITIONS + 1));
    return Array.from({ length: POSITIONS }, (_, i) => {
      const start = Math.max(1, step * (i + 1));
      const end = Math.min(book.max, start + CHUNK - 1);
      return fetchRange(baseUrl, book.id, start, end);
    });
  }).flat();

  const chunks = await Promise.all(tasks);
  hadithIndex.push(...chunks.flat());
  indexBuilt = true;
  indexBuilding = false;
}

// Score a single hadith against the query
function score(h: IndexedHadith, words: string[], rawQuery: string): number {
  const text = h.id.toLowerCase();
  const arab = h.arab.toLowerCase();
  let s = 0;

  // Exact phrase
  if (text.includes(rawQuery)) s += 40;

  // Individual words
  for (const w of words) {
    if (w.length < 2) continue;
    if (text.includes(w)) s += 12;
    if (arab.includes(w)) s += 4;
  }

  // Multi-word bonus
  const hits = words.filter(w => w.length >= 2 && text.includes(w)).length;
  if (hits >= 2) s += hits * 6;

  return s;
}

export async function GET(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_HADITS_API_URL;
  if (!baseUrl) {
    return NextResponse.json({ message: "Hadith API URL is not defined" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase().trim() ?? "";

  if (query.length < 2) return NextResponse.json({ results: [] });

  // Build index in background — first request triggers the build
  // Subsequent requests use cached index
  if (!indexBuilt && !indexBuilding) {
    buildIndex(baseUrl); // fire-and-forget: build async
  }

  const queryWords = query.split(/\s+/);

  // While index is still building, do a quick targeted fetch
  let corpusToSearch: IndexedHadith[];
  if (indexBuilt) {
    corpusToSearch = hadithIndex;
  } else {
    // Fallback: quick fetch from 3 positions in 4 books
    const quickTasks = BOOKS.slice(0, 4).map((book) =>
      [0.2, 0.5, 0.8].map((frac) => {
        const start = Math.max(1, Math.floor(book.max * frac));
        return fetchRange(baseUrl, book.id, start, start + 24);
      })
    ).flat();
    const chunks = await Promise.all(quickTasks);
    corpusToSearch = chunks.flat();
  }

  const scored = corpusToSearch
    .map(h => ({ h, s: score(h, queryWords, query) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 8);

  const results = scored.map(({ h }) => ({
    number: h.number,
    arab: h.arab,
    id: h.id,
    bookId: h.bookId,
    bookName: BOOKS.find(b => b.id === h.bookId)?.name ?? h.bookId,
  }));

  return NextResponse.json({ results, indexed: indexBuilt });
}
