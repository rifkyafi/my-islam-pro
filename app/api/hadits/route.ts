import { NextResponse } from "next/server";

const GITHUB_RAW = "https://raw.githubusercontent.com/gadingnst/hadith-api/master/books";

const BOOKS = [
  { id: "abu-daud", name: "Abu Dawud", available: 4419 },
  { id: "ahmad", name: "Ahmad", available: 4305 },
  { id: "bukhari", name: "Bukhari", available: 6638 },
  { id: "darimi", name: "Darimi", available: 2949 },
  { id: "ibnu-majah", name: "Ibnu Majah", available: 4285 },
  { id: "malik", name: "Malik", available: 1587 },
  { id: "muslim", name: "Muslim", available: 4930 },
  { id: "nasai", name: "Nasa'i", available: 5364 },
  { id: "tirmidzi", name: "Tirmidzi", available: 3625 },
];

interface HadithItem {
  number: number;
  arab: string;
  id: string;
}

const bookCache = new Map<string, HadithItem[]>();
const pendingFetch = new Map<string, Promise<HadithItem[]>>();

async function fetchBook(bookId: string): Promise<HadithItem[]> {
  const cached = bookCache.get(bookId);
  if (cached) return cached;

  const inFlight = pendingFetch.get(bookId);
  if (inFlight) return inFlight;

  const promise = (async () => {
    const url = `${GITHUB_RAW}/${bookId}.json`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Failed to fetch ${bookId}: ${res.status}`);
    const data: HadithItem[] = await res.json();
    bookCache.set(bookId, data);
    pendingFetch.delete(bookId);
    return data;
  })();

  pendingFetch.set(bookId, promise);
  return promise;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ data: BOOKS });
  }

  const book = BOOKS.find((b) => b.id === id);
  if (!book) {
    return NextResponse.json({ message: `Book "${id}" not found` }, { status: 404 });
  }

  const range = searchParams.get("range");
  const hadithLookup = searchParams.get("hadith");

  try {
    const allHadiths = await fetchBook(id);

    const totalAvailable = allHadiths.length;

    if (hadithLookup) {
      const hadithNumber = parseInt(hadithLookup, 10);
      const idx = allHadiths.findIndex((h) => h.number === hadithNumber);
      if (idx === -1) {
        return NextResponse.json({ page: null, error: "not found" });
      }
      const page = Math.floor(idx / 50) + 1;
      return NextResponse.json({ page, index: idx });
    }

    if (!range) {
      return NextResponse.json({
        data: {
          name: book.name,
          available: totalAvailable,
          hadiths: allHadiths,
        },
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
      data: {
        name: book.name,
        available: totalAvailable,
        hadiths,
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching hadith data:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
