"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useCallback, useRef } from 'react';

interface HadithResult {
  type: 'hadith';
  number: number;
  arab: string;
  id: string;
  bookId: string;
  bookName: string;
  rangeStart?: number;
}

interface QuranResult {
  type: 'quran';
  nomor: number;
  nama: string;
  namaLatin: string;
  arti: string;
  jumlahAyat: number;
  tempatTurun: string;
  ayatNomor?: number;
  ayatTeks?: string;
  ayatTerjemahan?: string;
}

type SearchResult = HadithResult | QuranResult;
type FilterTab = 'all' | 'quran' | 'hadith';

function useWordAwareDebounce(value: string, slowDelay = 700): string {
  const [debounced, setDebounced] = useState(value.trim());
  useEffect(() => {
    const trimmed = value.trim();
    const endsWithSpace = value.endsWith(' ');
    const delay = endsWithSpace ? 100 : slowDelay;
    const timer = setTimeout(() => setDebounced(trimmed), delay);
    return () => clearTimeout(timer);
  }, [value, slowDelay]);
  return debounced;
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="bg-[#D48C46]/30 text-[#E8B07D] rounded-sm px-0.5 not-italic">{part}</mark>
      : part
  );
}

export function SearchModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const isOpen = mounted && searchParams.get('search') === 'true';

  const [query, setQuery] = useState('');
  const [hadithResults, setHadithResults] = useState<HadithResult[]>([]);
  const [quranResults, setQuranResults] = useState<QuranResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [indexed, setIndexed] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedQuery = useWordAwareDebounce(query);

  const closeModal = useCallback(() => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('search');
    router.push(pathname + (newParams.toString() ? `?${newParams.toString()}` : ''), { scroll: false });
  }, [router, pathname, searchParams]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      if (retryRef.current) clearTimeout(retryRef.current);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setQuery('');
        setHadithResults([]);
        setQuranResults([]);
        setSearched(false);
        setIsIndexing(false);
        setActiveTab('all');
      }, 0);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeModal]);

  const fetchResults = useCallback(async function performFetch(q: string, isRetry = false) {
    if (q.length < 2) {
      setHadithResults([]);
      setQuranResults([]);
      setSearched(false);
      setIsIndexing(false);
      return;
    }
    if (!isRetry) { setLoading(true); setSearched(false); }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      setHadithResults(json.results ?? []);
      setQuranResults(json.quranResults ?? []);
      const serverIndexed = json.indexed === true;
      setIndexed(serverIndexed);

      if (!serverIndexed) {
        setIsIndexing(true);
        retryRef.current = setTimeout(() => {
          performFetch(q, true);
        }, 3000);
      } else {
        setIsIndexing(false);
      }
    } catch {
      setHadithResults([]);
      setQuranResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, []);

  useEffect(() => {
    if (retryRef.current) clearTimeout(retryRef.current);
    fetchResults(debouncedQuery);
  }, [debouncedQuery, fetchResults]);

  // Combine + filter results for display
  const allResults: SearchResult[] = [
    ...quranResults,
    ...hadithResults,
  ];

  const filteredResults = activeTab === 'all'
    ? allResults
    : allResults.filter(r => r.type === activeTab);

  const totalCount = allResults.length;
  const hasQuran = quranResults.length > 0;
  const hasHadith = hadithResults.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[8vh] px-4 pb-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-[#090C15]/70 backdrop-blur-md"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.2 }}
            className="relative w-full max-w-2xl bg-[#1A223D] border border-[#D48C46]/25 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden z-[201]"
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-5 pt-4 pb-1">
              <span className="text-[0.6rem] tracking-[3px] uppercase text-[#D48C46]/60 font-semibold">Cari Qur&apos;an &amp; Hadits</span>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-[#D48C46]/10">
              {loading ? (
                <svg className="w-4 h-4 text-[#D48C46] shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-[#8B95A6] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari surah, ayat, atau kata kunci hadis…"
                className="flex-1 bg-transparent text-[#F0F2F5] placeholder-[#8B95A6] focus:outline-none text-[0.95rem]"
              />
              {query && (
                <button onClick={() => { setQuery(''); setHadithResults([]); setQuranResults([]); setSearched(false); }}
                  className="text-[#8B95A6] hover:text-[#F0F2F5] transition-colors p-1 text-sm">
                  ✕
                </button>
              )}
              <button onClick={closeModal}
                className="text-[0.7rem] tracking-widest uppercase text-[#8B95A6] hover:text-[#D48C46] border border-[#D48C46]/20 px-2.5 py-1 rounded-md transition-colors ml-1">
                ESC
              </button>
            </div>

            {/* Filter Tabs — show when there are results */}
            {searched && totalCount > 0 && (
              <div className="flex items-center gap-1 px-5 py-2 border-b border-[#D48C46]/10 bg-[#12172B]/40">
                {([
                  { key: 'all', label: `Semua (${totalCount})` },
                  ...(hasQuran ? [{ key: 'quran', label: `Al-Qur'an (${quranResults.length})` }] : []),
                  ...(hasHadith ? [{ key: 'hadith', label: `Hadits (${hadithResults.length})` }] : []),
                ] as { key: FilterTab; label: string }[]).map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`text-[0.65rem] tracking-wider uppercase px-3 py-1 rounded-full transition-all font-medium ${
                      activeTab === tab.key
                        ? 'bg-[#D48C46] text-[#090C15]'
                        : 'text-[#8B95A6] hover:text-[#D48C46] border border-[#D48C46]/20 hover:border-[#D48C46]/40'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Index status bar */}
            {isIndexing && (
              <div className="flex items-center gap-2 px-5 py-2 bg-[#D48C46]/5 border-b border-[#D48C46]/10">
                <svg className="w-3 h-3 text-[#D48C46] animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <p className="text-[0.68rem] text-[#D48C46]/80">Mengindeks hadis… hasil akan muncul otomatis, mohon tunggu</p>
              </div>
            )}

            {/* Results Area */}
            <div className="max-h-[55vh] overflow-y-auto">

              {/* Results list */}
              {filteredResults.length > 0 && (
                <ul className="divide-y divide-[#D48C46]/8">
                  {filteredResults.map((r, i) => (
                    <motion.li
                      key={r.type === 'quran' ? `quran-${r.nomor}` : `hadith-${r.bookId}-${r.number}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      {r.type === 'quran' ? (
                        /* ── Quran Result ── */
                        <button
                          onClick={() => {
                            closeModal();
                            router.push(`/quran?surah=${r.nomor}${r.ayatNomor ? `#ayat-${r.ayatNomor}` : ''}`);
                          }}
                          className="w-full text-left px-5 py-4 hover:bg-[#25304C] transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[0.6rem] font-medium px-2 py-0.5 rounded-full tracking-wider uppercase bg-[#8A4A1C]/20 text-[#C97A34] border border-[#C97A34]/30">
                              {r.ayatNomor ? 'Ayat Qur\'an' : 'Surah Qur\'an'}
                            </span>
                            <span className="text-[0.68rem] text-[#8B95A6]">
                              {r.ayatNomor 
                                ? `QS. ${r.namaLatin} : ${r.ayatNomor}` 
                                : `Surah ke-{r.nomor} · {r.jumlahAyat} Ayat · {r.tempatTurun}`
                              }
                            </span>
                            <span className="ml-auto text-[0.6rem] text-[#C97A34]/70 flex items-center gap-1">
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              {r.ayatNomor ? 'Buka Ayat' : 'Buka Surah'}
                            </span>
                          </div>
                          
                          {r.ayatNomor ? (
                            <div className="flex flex-col">
                              <p className="font-neirizi text-xl text-[#E8B07D] text-right leading-relaxed mb-2 opacity-80">
                                {r.ayatTeks}
                              </p>
                              <p className="text-[0.83rem] text-[#F0F2F5]/80 italic leading-relaxed">
                              &quot;{highlightMatch(r.ayatTerjemahan || '', query)}&quot;
                              </p>
                              <span className="text-[0.65rem] text-[#8B95A6] mt-1.5 font-medium">
                                Surah {r.namaLatin}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <p className="text-[0.9rem] font-medium text-[#F0F2F5]">
                                  {highlightMatch(r.namaLatin, query)}
                                </p>
                                <p className="text-[0.75rem] text-[#8B95A6] italic mt-0.5">
                                  {highlightMatch(r.arti, query)}
                                </p>
                              </div>
                              <span className="font-neirizi text-2xl text-[#E8B07D]/60 shrink-0">{r.nama}</span>
                            </div>
                          )}
                        </button>
                      ) : (
                        /* ── Hadith Result ── */
                        <button
                          onClick={() => {
                            const position = r.rangeStart ?? r.number;
                            const page = Math.ceil(position / 50);
                            window.location.href = `/hadis?book=${r.bookId}&page=${page}#hadith-${r.number}`;
                          }}
                          className="w-full text-left px-5 py-4 hover:bg-[#25304C] transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[0.6rem] font-medium px-2 py-0.5 rounded-full tracking-wider uppercase bg-[#D48C46]/10 text-[#D48C46] border border-[#D48C46]/25">
                              Hadits
                            </span>
                            <span className="text-[0.68rem] text-[#8B95A6]">
                              HR. {r.bookName} No. {r.number}
                            </span>
                            <span className="ml-auto text-[0.6rem] text-[#C97A34]/70 flex items-center gap-1">
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Buka
                            </span>
                          </div>
                          {r.arab && (
                            <p className="font-neirizi text-lg text-[#E8B07D] text-right leading-relaxed mb-2 opacity-80">
                              {r.arab.length > 110 ? r.arab.slice(0, 110) + '…' : r.arab}
                            </p>
                          )}
                          <p className="text-[0.83rem] text-[#F0F2F5]/80 italic leading-relaxed line-clamp-2">
                            &quot;{highlightMatch(r.id, query)}&quot;
                          </p>
                        </button>
                      )}
                    </motion.li>
                  ))}
                </ul>
              )}

              {/* Indexing, no results yet */}
              {!loading && searched && filteredResults.length === 0 && isIndexing && (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                  <svg className="w-8 h-8 text-[#D48C46]/40 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <p className="text-[#8B95A6] text-sm">Sedang menyiapkan indeks hadis…</p>
                  <p className="text-[#8B95A6]/50 text-xs">Hasil akan muncul otomatis dalam beberapa detik</p>
                </div>
              )}

              {/* No results */}
              {!loading && searched && filteredResults.length === 0 && !isIndexing && (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                  <span className="font-neirizi text-4xl text-[#D48C46]/30">بحث</span>
                  <p className="text-[#8B95A6] text-sm">Tidak ditemukan hasil untuk <span className="text-[#F0F2F5]">&quot;{query}&quot;</span></p>
                  <p className="text-[#8B95A6]/60 text-xs">Coba nama surah (al-baqarah), nomor surah (2), atau kata kunci hadis</p>
                </div>
              )}

              {/* Idle State */}
              {!loading && !searched && query.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="flex items-center gap-4">
                    <span className="font-neirizi text-4xl text-[#D48C46]/20">القرآن</span>
                    <span className="text-[#D48C46]/15 text-2xl">·</span>
                    <span className="font-neirizi text-4xl text-[#D48C46]/20">حديث</span>
                  </div>
                  <p className="text-[#8B95A6] text-sm">Ketik untuk mulai mencari</p>
                  <p className="text-[#8B95A6]/40 text-xs">Contoh: al-baqarah, shalat, jujur, sabar, nomor surah (2, 36…)</p>
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="flex items-center justify-center gap-2 py-10 text-[#8B95A6] text-sm">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Mencari…
                </div>
              )}
            </div>

            {/* Footer */}
            {filteredResults.length > 0 && !loading && (
              <div className="px-5 py-2.5 border-t border-[#D48C46]/10 flex items-center justify-between">
                <span className="text-[0.68rem] text-[#8B95A6]">
                  {filteredResults.length} hasil
                  {indexed && <span className="ml-1 text-[#C97A34]/70">· index penuh</span>}
                </span>
                <span className="text-[0.65rem] text-[#8B95A6]/40">Klik untuk buka halaman</span>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
