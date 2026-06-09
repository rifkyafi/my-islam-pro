"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useCallback, useRef } from 'react';

interface SearchResult {
  number: number;
  arab: string;
  id: string;
  bookId: string;
  bookName: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="bg-[#C9A84C]/30 text-[#E2C07A] rounded-sm px-0.5 not-italic">{part}</mark>
      : part
  );
}

export function SearchModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isOpen = searchParams.get('search') === 'true';

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [indexed, setIndexed] = useState(false);  // whether server index is ready
  const inputRef = useRef<HTMLInputElement>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedQuery = useDebounce(query, 450);

  const closeModal = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('search');
    router.push(pathname + (newParams.toString() ? `?${newParams.toString()}` : ''), { scroll: false });
  };

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
      setSearched(false);
      if (retryRef.current) clearTimeout(retryRef.current);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchParams]);

  // Fetch results from /api/search
  const fetchResults = useCallback(async (q: string, isRetry = false) => {
    if (q.length < 2) { setResults([]); setSearched(false); return; }
    if (!isRetry) { setLoading(true); setSearched(false); }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      setResults(json.results ?? []);
      setIndexed(json.indexed === true);

      // If index isn't ready yet, retry in 3s to get better results
      if (!json.indexed && q.length >= 2) {
        retryRef.current = setTimeout(() => fetchResults(q, true), 3000);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, []);

  useEffect(() => {
    if (retryRef.current) clearTimeout(retryRef.current);
    fetchResults(debouncedQuery);
  }, [debouncedQuery, fetchResults]);

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
            className="absolute inset-0 bg-[#0C1A1F]/70 backdrop-blur-md"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.2 }}
            className="relative w-full max-w-2xl bg-[#182E38] border border-[#C9A84C]/25 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden z-[201]"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#C9A84C]/10">
              {loading ? (
                <svg className="w-4 h-4 text-[#C9A84C] shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-[#7A8F96] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari hadis berdasarkan kata kunci atau tema…"
                className="flex-1 bg-transparent text-[#F2EBD9] placeholder-[#7A8F96] focus:outline-none text-[0.95rem]"
              />
              {query && (
                <button onClick={() => { setQuery(''); setResults([]); setSearched(false); }}
                  className="text-[#7A8F96] hover:text-[#F2EBD9] transition-colors p-1 text-sm">
                  ✕
                </button>
              )}
              <button onClick={closeModal}
                className="text-[0.7rem] tracking-widest uppercase text-[#7A8F96] hover:text-[#C9A84C] border border-[#C9A84C]/20 px-2.5 py-1 rounded-md transition-colors ml-1">
                ESC
              </button>
            </div>

            {/* Index status bar */}
            {searched && !indexed && results.length > 0 && (
              <div className="flex items-center gap-2 px-5 py-2 bg-[#C9A84C]/5 border-b border-[#C9A84C]/10">
                <svg className="w-3 h-3 text-[#C9A84C] animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <p className="text-[0.68rem] text-[#C9A84C]/80">Mengindeks lebih banyak hadis… hasil akan diperbarui otomatis</p>
              </div>
            )}

            {/* Results Area */}
            <div className="max-h-[58vh] overflow-y-auto">

              {/* Results */}
              {results.length > 0 && (
                <ul className="divide-y divide-[#C9A84C]/8">
                  {results.map((r, i) => (
                    <motion.li
                      key={`${r.bookId}-${r.number}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <button
                        onClick={() => {
                          const page = Math.ceil(r.number / 50);
                          window.location.href = `/tema/${r.bookId}?page=${page}#hadith-${r.number}`;
                        }}
                        className="w-full text-left px-5 py-4 hover:bg-[#1E3A47] transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[0.6rem] font-medium px-2 py-0.5 rounded-full tracking-wider uppercase bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/25">
                            Hadits
                          </span>
                          <span className="text-[0.68rem] text-[#7A8F96]">
                            HR. {r.bookName} No. {r.number}
                          </span>
                          <span className="ml-auto text-[0.6rem] text-[#3D9B7F]/70 flex items-center gap-1">
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Buka
                          </span>
                        </div>
                        {r.arab && (
                          <p className="font-neirizi text-lg text-[#E2C07A] text-right leading-relaxed mb-2 opacity-80">
                            {r.arab.length > 110 ? r.arab.slice(0, 110) + '…' : r.arab}
                          </p>
                        )}
                        <p className="text-[0.83rem] text-[#F2EBD9]/80 italic leading-relaxed line-clamp-2">
                          "{highlightMatch(r.id, query)}"
                        </p>
                      </button>
                    </motion.li>
                  ))}
                </ul>
              )}

              {/* No Results */}
              {!loading && searched && results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                  <span className="font-neirizi text-4xl text-[#C9A84C]/30">بحث</span>
                  <p className="text-[#7A8F96] text-sm">Tidak ditemukan hasil untuk <span className="text-[#F2EBD9]">"{query}"</span></p>
                  <p className="text-[#7A8F96]/60 text-xs">Coba kata kunci yang lebih umum, misal: shalat, zakat, jujur</p>
                </div>
              )}

              {/* Idle State */}
              {!loading && !searched && query.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <span className="font-neirizi text-5xl text-[#C9A84C]/20">حديث</span>
                  <p className="text-[#7A8F96] text-sm">Ketik untuk mulai mencari hadis</p>
                  <p className="text-[#7A8F96]/40 text-xs">Contoh: shalat, jujur, sabar, puasa, bukhari</p>
                </div>
              )}

              {/* Still loading (debounce waiting) */}
              {loading && (
                <div className="flex items-center justify-center gap-2 py-10 text-[#7A8F96] text-sm">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Mencari hadis…
                </div>
              )}
            </div>

            {/* Footer */}
            {results.length > 0 && !loading && (
              <div className="px-5 py-2.5 border-t border-[#C9A84C]/10 flex items-center justify-between">
                <span className="text-[0.68rem] text-[#7A8F96]">
                  {results.length} hasil
                  {indexed && <span className="ml-1 text-[#3D9B7F]/70">· index penuh</span>}
                </span>
                <span className="text-[0.65rem] text-[#7A8F96]/40">Klik untuk buka halaman kitab</span>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
