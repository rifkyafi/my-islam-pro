"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Montserrat } from 'next/font/google';
import { CopyButton } from '../pages/components/CopyButton';
import type { HadithBook } from './page';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500'], style: ['normal', 'italic'] });
const HADIS_PER_PAGE = 50;

interface HadithItem {
  number: number;
  arab: string;
  id: string;
}

interface BookData {
  name: string;
  available: number;
  hadiths: HadithItem[];
}

export default function HadisClientView({ books }: { books: HadithBook[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Derive book/page from URL params synchronously on every render
  const urlBook = searchParams.get('book');
  const urlPage = searchParams.get('page');
  const validBook = books.find(b => b.id === urlBook);
  const activeBookId = validBook?.id || books[0]?.id || 'bukhari';
  const activePage = Math.max(1, parseInt(urlPage || '1', 10) || 1);

  const [bookData, setBookData] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const fetchedRef = useRef<string>('');
  const requestedRef = useRef<string>('');

  // Single fetch effect: runs when URL-derived book/page changes
  useEffect(() => {
    const key = `${activeBookId}:${activePage}`;
    if (fetchedRef.current === key) return;
    requestedRef.current = key;

    setLoading(true);
    setFetchError(false);
    const limit = HADIS_PER_PAGE;
    const start = (activePage - 1) * limit + 1;
    const end = activePage * limit;
    const range = `${start}-${end}`;

    fetch(`/api/hadits?id=${activeBookId}&range=${range}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(json => {
        if (requestedRef.current !== key) return;
        if (json.data && json.data.hadiths) {
          setBookData(json.data);
          fetchedRef.current = key;
        } else {
          setFetchError(true);
        }
      })
      .catch(() => setFetchError(true))
      .finally(() => {
        if (requestedRef.current === key) setLoading(false);
      });
  }, [activeBookId, activePage]);

  // Hash scroll detection with staggered retries
  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const scrollToAnchor = () => {
      const hash = window.location.hash;
      if (!hash || !hash.startsWith('#hadith-')) return false;

      const targetNumber = parseInt(hash.replace('#hadith-', ''), 10);

      const element = document.getElementById(hash.replace('#', ''));
      if (!element) return false;

      const offset = 140;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });

      element.classList.remove('animate-target-pulse');
      void element.offsetWidth;
      element.classList.add('animate-target-pulse');
      timers.push(setTimeout(() => element.classList.remove('animate-target-pulse'), 4000));

      return true;
    };

    if (!scrollToAnchor()) {
      const delays = [100, 300, 600, 1000, 2000, 4000];
      for (const delay of delays) {
        timers.push(setTimeout(() => {
          if (!cancelled) scrollToAnchor();
        }, delay));
      }
    }

    window.addEventListener('hashchange', scrollToAnchor);
    return () => {
      cancelled = true;
      timers.forEach(t => clearTimeout(t));
      window.removeEventListener('hashchange', scrollToAnchor);
    };
  }, [activeBookId, activePage, bookData]);

  const activeBookMeta = books.find(b => b.id === activeBookId);

  const limit = HADIS_PER_PAGE;
  const start = (activePage - 1) * limit + 1;
  const end = activePage * limit;
  const totalAvailable = bookData ? bookData.available : (activeBookMeta?.available || 0);
  const totalPages = Math.ceil(totalAvailable / limit);
  const isFirstPage = activePage <= 1;
  const isLastPage = activePage >= totalPages;

  const handleBookChange = (bookId: string) => {
    router.push(`/hadis?book=${bookId}&page=1`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/hadis?book=${activeBookId}&page=${newPage}`, { scroll: false });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
      <style>{`
        @keyframes targetPulse {
          0% { box-shadow: 0 0 0 0 rgba(212, 140, 70, 0); }
          50% { box-shadow: 0 0 30px 10px rgba(212, 140, 70, 0.25); border-color: #D48C46; }
          100% { box-shadow: 0 0 0 0 rgba(212, 140, 70, 0); }
        }
        .animate-target-pulse {
          animation: targetPulse 2s ease-in-out infinite;
          z-index: 20;
          border-color: #D48C46 !important;
        }
      `}</style>
      
      {/* Sidebar */}
      <aside className="w-full lg:w-[280px] shrink-0 relative z-40">
        <div className="sticky top-0 lg:top-28 pt-4 lg:pt-0 -mx-5 px-5 lg:mx-0 lg:px-0 bg-[var(--bg-primary)]/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none lg:max-h-[calc(100vh-140px)] overflow-x-auto lg:overflow-y-auto lg:pr-4 scrollbar-none lg:scrollbar-thin lg:scrollbar-thumb-[#D48C46]/20 lg:scrollbar-track-transparent pb-4 border-b border-[var(--accent-border-light)] lg:border-b-0">
        
        <div className="flex flex-row lg:flex-col gap-2 w-max lg:w-auto">
          <h4 className="hidden lg:block text-[var(--text-accent)] font-semibold text-[0.65rem] tracking-[3px] uppercase mb-6">
            Daftar Kitab
          </h4>
          <nav className="flex flex-row lg:flex-col gap-2 lg:gap-1.5">
            {books.map((book, idx) => {
              const isActive = activeBookId === book.id;
              return (
                <button
                  key={`book-${book.id}`}
                  onClick={() => {
                    if (!isActive) {
                      handleBookChange(book.id);
                    }
                  }}
                  className={`text-[0.8rem] lg:text-[0.85rem] text-left px-4 py-2 lg:px-3 lg:py-2.5 rounded-full lg:rounded-md transition-all whitespace-nowrap shadow-sm lg:shadow-none border flex items-center gap-3 ${
                    isActive
                      ? 'bg-[var(--bg-card-hover)] text-[var(--text-primary)] border-[var(--accent-border)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] bg-[var(--bg-card)] lg:bg-transparent border-[var(--accent-border)] lg:border-transparent'
                  }`}
                >
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full text-[0.6rem] font-bold ${isActive ? 'bg-[var(--accent)] text-[var(--text-on-accent)]' : 'bg-[var(--bg-primary)] text-[var(--text-accent)] border border-[var(--accent-border)]'}`}>
                    {idx + 1}
                  </span>
                  <div className="flex flex-col leading-tight">
                    <span className="font-medium">{book.name}</span>
                    <span className="text-[0.6rem] opacity-60 uppercase tracking-wider">{book.available} Hadis</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
        </div>
      </aside>

      {/* Main Content */}
      <div ref={mainRef} className="flex-1 flex flex-col min-h-[600px]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-[var(--accent-border)] border-t-[var(--accent)] rounded-full animate-spin" />
              <p className="font-cormorant text-xl text-[var(--text-accent)]">Memuat Hadis...</p>
            </div>
          </div>
        ) : fetchError ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center max-w-md">
<p className="font-cormorant text-2xl text-[var(--text-accent)]">Data Tidak Ditemukan</p>
               <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                Hadis yang Anda cari tidak tersedia atau terjadi kesalahan saat memuat data.
              </p>
              <button
                onClick={() => {
                  const retryKey = `${activeBookId}:${activePage}`;
                  fetchedRef.current = '';
                  requestedRef.current = retryKey;
                  setLoading(true);
                  setFetchError(false);
                  const s = (activePage - 1) * 50 + 1;
                  const e = activePage * 50;
                  fetch(`/api/hadits?id=${activeBookId}&range=${s}-${e}`)
                    .then(r => r.ok ? r.json() : Promise.reject())
                    .then(j => {
                      if (requestedRef.current !== retryKey) return;
                      if (j.data?.hadiths) {
                        setBookData(j.data);
                        fetchedRef.current = retryKey;
                      } else { setFetchError(true); }
                    })
                    .catch(() => setFetchError(true))
                    .finally(() => {
                      if (requestedRef.current === retryKey) setLoading(false);
                    });
                }}
                className="mt-2 px-5 py-2 bg-[var(--accent)]/10 border border-[var(--accent-border)] text-[var(--text-accent)] rounded-md text-[0.8rem] hover:bg-[var(--accent)]/20 transition-all"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        ) : bookData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8 border-b border-[var(--accent-border-light)] pb-6">
              <h2 className="font-cormorant text-3xl md:text-4xl font-normal leading-[1.1] text-[var(--text-primary)] mb-2">
                {bookData.name}
              </h2>
              <p className="text-[var(--text-muted)] text-sm md:text-base font-light flex items-center gap-3">
                <span className="text-[var(--text-accent-light)]">{bookData.available} Hadis Tersedia</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/50"></span>
                <span>Menampilkan {start}-{Math.min(end, bookData.available)}</span>
              </p>
            </header>

            <div className="flex flex-col gap-5 mb-12">
              {bookData.hadiths.map((hadith) => (
                <div
                  key={hadith.number}
                  id={`hadith-${hadith.number}`}
                  className="group relative bg-[var(--bg-card)] p-6 md:p-8 flex flex-col rounded-md transition-all hover:bg-[var(--bg-card-hover)] scroll-mt-28 target:ring-2 target:ring-[var(--accent)]/60 target:bg-[var(--bg-card-hover)] overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div className="flex flex-col gap-1">
                      <h4 className="font-cormorant text-lg md:text-xl text-[var(--text-primary)] leading-tight">
                        Hadits Riwayat {bookData.name}
                      </h4>
                      <span className="text-[var(--text-accent)] font-medium text-[0.7rem] tracking-wider uppercase">
                        {bookData.name} No. {hadith.number}
                      </span>
                    </div>
                    <CopyButton textToCopy={`${hadith.arab}\n\n"${hadith.id}"\n\n— ${bookData.name} No. ${hadith.number}`} />
                  </div>
                  
                  <div className="mb-5 relative z-10">
                    <p className="font-neirizi text-xl md:text-2xl text-[var(--text-accent-bright)] text-right leading-[1.8] opacity-90" dir="rtl">
                      {hadith.arab}
                    </p>
                  </div>
                  
                  <div className="border-t border-[var(--accent-border-light)] pt-4 relative z-10 text-justify">
                    <blockquote className={`${montserrat.className} text-[var(--text-primary)]/90 text-[0.9rem] md:text-[0.95rem] italic text-justify leading-relaxed border-l-2 border-[var(--accent-border)] pl-3`}>
                      &quot;{hadith.id}&quot;
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 border-t border-[var(--accent-border-light)] pt-8 pb-10">
                {isFirstPage ? (
                  <button disabled className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--text-muted)]/30 text-[var(--text-muted)]/30 cursor-not-allowed">
                    &larr;
                  </button>
                ) : (
                  <button 
                    onClick={() => handlePageChange(activePage - 1)}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--accent)]/50 text-[var(--text-accent)] hover:bg-[var(--accent)]/10 transition-colors"
                  >
                    &larr;
                  </button>
                )}
                
                <span className="text-[var(--text-muted)] text-xs tracking-widest uppercase">
                  Halaman <strong className="text-[var(--text-primary)] font-medium px-1">{activePage}</strong> dari {totalPages}
                </span>

                {isLastPage ? (
                  <button disabled className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--text-muted)]/30 text-[var(--text-muted)]/30 cursor-not-allowed">
                    &rarr;
                  </button>
                ) : (
                  <button 
                    onClick={() => handlePageChange(activePage + 1)}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--accent)]/50 text-[var(--text-accent)] hover:bg-[var(--accent)]/10 transition-colors"
                  >
                    &rarr;
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
