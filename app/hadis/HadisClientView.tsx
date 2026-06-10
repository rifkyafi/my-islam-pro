"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Montserrat } from 'next/font/google';
import { CopyButton } from '../pages/components/CopyButton';
import type { HadithBook } from './page';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500'], style: ['normal', 'italic'] });
const HADIS_PER_BAB = 10;
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

interface BabGroup {
  bab: number;
  start: number;
  end: number;
  hadiths: HadithItem[];
}

export default function HadisClientView({ books }: { books: HadithBook[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialBook = searchParams.get('book') || books[0]?.id || 'bukhari';
  const pageStr = searchParams.get('page') || '1';
  const initialPage = Math.max(1, parseInt(pageStr, 10) || 1);
  
  const [activeBookId, setActiveBookId] = useState<string>(initialBook);
  const [activePage, setActivePage] = useState<number>(initialPage);
  const [expandedBabs, setExpandedBabs] = useState<Set<number>>(new Set());
  
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const b = searchParams.get('book');
    const p = parseInt(searchParams.get('page') || '1', 10);
    
    if (b && b !== activeBookId) {
      setTimeout(() => setActiveBookId(b), 0);
    }
    if (p && p !== activePage) {
      setTimeout(() => setActivePage(p), 0);
    }
  }, [searchParams, activeBookId, activePage]);

  const fetchHadiths = useCallback(async (bookId: string, pageNum: number) => {
    setLoading(true);
    const limit = HADIS_PER_PAGE;
    const start = (pageNum - 1) * limit + 1;
    const end = pageNum * limit;
    const range = `${start}-${end}`;
    
    try {
      const res = await fetch(`/api/hadits?id=${bookId}&range=${range}`);
      if (res.ok) {
        const json = await res.json();
        setBookData(json.data);
        setExpandedBabs(new Set());
      }
    } catch (e) {
      console.error("Error fetching hadiths:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => fetchHadiths(activeBookId, activePage), 0);
  }, [activeBookId, activePage, fetchHadiths]);

  const babGroups = useMemo<BabGroup[]>(() => {
    if (!bookData?.hadiths) return [];
    const groups: BabGroup[] = [];
    let currentGroup: BabGroup | null = null;

    bookData.hadiths.forEach((h) => {
      const bab = Math.ceil(h.number / HADIS_PER_BAB);
      if (!currentGroup || currentGroup.bab !== bab) {
        const start = (bab - 1) * HADIS_PER_BAB + 1;
        const end = bab * HADIS_PER_BAB;
        currentGroup = { bab, start, end, hadiths: [] };
        groups.push(currentGroup);
      }
      currentGroup.hadiths.push(h);
    });

    return groups;
  }, [bookData]);

  const scrollToBab = useCallback((bab: number) => {
    const el = document.getElementById(`bab-${bab}`);
    if (el) {
      const offset = 140;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  const toggleBab = useCallback((bab: number) => {
    setExpandedBabs((prev) => {
      const next = new Set(prev);
      if (next.has(bab)) {
        next.delete(bab);
      } else {
        next.add(bab);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (loading || !bookData?.hadiths?.length) return;

    const scrollToAnchor = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#hadith-')) {
        const targetId = hash.replace('#', '');
        const element = document.getElementById(targetId);
        
        if (element) {
          const offset = 140;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
          
          element.classList.add('animate-target-pulse');
          setTimeout(() => {
            element.classList.remove('animate-target-pulse');
          }, 4000);
          
          return true;
        }
      }
      return false;
    };

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const success = scrollToAnchor();
      if (success || attempts > 15) {
        clearInterval(interval);
      }
    }, 200);

    window.addEventListener('hashchange', scrollToAnchor);
    return () => {
      clearInterval(interval);
      window.removeEventListener('hashchange', scrollToAnchor);
    };
  }, [loading, bookData]);

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
        <div className="sticky top-0 lg:top-28 pt-4 lg:pt-0 -mx-5 px-5 lg:mx-0 lg:px-0 bg-[#12172B]/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none lg:max-h-[calc(100vh-140px)] overflow-x-auto lg:overflow-y-auto lg:pr-4 scrollbar-none lg:scrollbar-thin lg:scrollbar-thumb-[#D48C46]/20 lg:scrollbar-track-transparent pb-4 border-b border-[#D48C46]/10 lg:border-b-0">
          
          <div className="flex flex-col gap-1 w-max lg:w-auto">
            {/* Header */}
            <h4 className="hidden lg:block text-[#D48C46] font-semibold text-[0.65rem] tracking-[3px] uppercase mb-4">
              Nama Hadits
            </h4>

            {/* Daftar Kitab (9 hadits) */}
            <nav className="flex flex-row lg:flex-col gap-2 lg:gap-0">
              {books.map((book) => {
                const isActive = activeBookId === book.id;
                return (
                  <div key={`book-${book.id}`} className="flex flex-col">
                    <button
                      onClick={() => {
                        if (!isActive) {
                          handleBookChange(book.id);
                        }
                      }}
                      className={`text-[0.8rem] lg:text-[0.85rem] text-left px-4 py-2.5 rounded-full lg:rounded-md transition-all whitespace-nowrap shadow-sm lg:shadow-none border flex items-center gap-3 ${
                        isActive
                          ? 'bg-[#25304C] text-[#F0F2F5] border-[#D48C46]/40'
                          : 'text-[#8B95A6] hover:text-[#F0F2F5] hover:bg-[#25304C] bg-[#1A223D] lg:bg-transparent border-[#D48C46]/20 lg:border-transparent'
                      }`}
                    >
                      <div className="flex flex-col leading-tight">
                        <span className="font-medium">{book.name}</span>
                        <span className="text-[0.6rem] opacity-60 uppercase tracking-wider">{book.available} Hadis</span>
                      </div>
                    </button>

                    {/* Subbab — muncul saat kitab aktif */}
                    {isActive && bookData && !loading && (
                      <div className="flex flex-col gap-0.5 ml-2 mt-1.5 lg:ml-4 lg:mt-1 border-l border-[#D48C46]/20 pl-2 lg:pl-3">
                        {babGroups.length === 0 && (
                          <span className="text-[0.65rem] text-[#8B95A6] italic px-2 py-1">Tidak ada data</span>
                        )}
                        {babGroups.map((group) => {
                          const isBabExpanded = expandedBabs.has(group.bab);
                          return (
                            <div key={`sidebar-bab-${group.bab}`} className="flex flex-col">
                              <button
                                onClick={() => toggleBab(group.bab)}
                                className={`flex items-center gap-2 text-left text-[0.7rem] font-semibold tracking-wider uppercase px-2 py-1.5 rounded transition-colors ${
                                  isBabExpanded
                                    ? 'text-[#D48C46]'
                                    : 'text-[#8B95A6] hover:text-[#F0F2F5]'
                                }`}
                              >
                                <span className={`transition-transform duration-200 ${isBabExpanded ? 'rotate-90' : ''}`}>▸</span>
                                <span>Bab {group.bab}</span>
                                <span className="text-[0.55rem] text-[#8B95A6] normal-case font-normal">
                                  ({group.start}-{Math.min(group.end, totalAvailable)})
                                </span>
                              </button>

                              {/* Hadits dalam subbab */}
                              {isBabExpanded && (
                                <div className="flex flex-col gap-0.5 ml-5">
                                  {group.hadiths.map((h) => (
                                    <button
                                      key={`nav-${h.number}`}
                                      onClick={() => {
                                        scrollToBab(group.bab);
                                        setTimeout(() => {
                                          const el = document.getElementById(`hadith-${h.number}`);
                                          if (el) {
                                            const offset = 140;
                                            const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                                            window.scrollTo({ top, behavior: "smooth" });
                                          }
                                        }, 100);
                                      }}
                                      className="text-left text-[0.68rem] text-[#8B95A6] hover:text-[#D48C46] px-2 py-0.5 rounded transition-colors whitespace-nowrap truncate"
                                    >
                                      Hadits No. {h.number}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Pagination mini di sidebar */}
            {bookData && !loading && totalPages > 1 && (
              <div className="hidden lg:flex items-center gap-2 mt-4 pt-3 border-t border-[#D48C46]/10">
                <button
                  onClick={() => handlePageChange(activePage - 1)}
                  disabled={isFirstPage}
                  className={`text-[0.65rem] px-2 py-1 rounded transition-colors ${
                    isFirstPage
                      ? 'text-[#8B95A6]/30 cursor-not-allowed'
                      : 'text-[#D48C46] hover:bg-[#D48C46]/10'
                  }`}
                >
                  &larr;
                </button>
                <span className="text-[0.6rem] text-[#8B95A6] tracking-wider uppercase flex-1 text-center">
                  Hal. {activePage}/{totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(activePage + 1)}
                  disabled={isLastPage}
                  className={`text-[0.65rem] px-2 py-1 rounded transition-colors ${
                    isLastPage
                      ? 'text-[#8B95A6]/30 cursor-not-allowed'
                      : 'text-[#D48C46] hover:bg-[#D48C46]/10'
                  }`}
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div ref={mainRef} className="flex-1 flex flex-col min-h-[600px]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-[#D48C46]/20 border-t-[#D48C46] rounded-full animate-spin" />
              <p className="font-cormorant text-xl text-[#D48C46]">Memuat Hadis...</p>
            </div>
          </div>
        ) : bookData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8 border-b border-[#D48C46]/10 pb-6">
              <h2 className="font-cormorant text-3xl md:text-4xl font-normal leading-[1.1] text-[#F0F2F5] mb-2">
                {bookData.name}
              </h2>
              <p className="text-[#8B95A6] text-sm md:text-base font-light flex items-center gap-3">
                <span className="text-[#C97A34]">{bookData.available} Hadis Tersedia</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D48C46]/50"></span>
                <span>Menampilkan {start}-{Math.min(end, bookData.available)}</span>
              </p>
            </header>

            <div className="flex flex-col gap-8 mb-12">
              {babGroups.map((group) => (
                <div key={`bab-section-${group.bab}`} id={`bab-${group.bab}`} className="scroll-mt-32">
                  {/* Header Subbab */}
                  <div className="flex items-center gap-4 mb-5 pb-3 border-b border-[#D48C46]/20">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[0.75rem] font-bold bg-[#D48C46] text-[#090C15]">
                      {group.bab}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-cormorant text-xl text-[#F0F2F5] font-medium">
                        Subbab {group.bab}
                      </h3>
                      <span className="text-[0.65rem] tracking-wider uppercase text-[#8B95A6]">
                        Hadis ke-{group.start} – {Math.min(group.end, totalAvailable)}
                      </span>
                    </div>
                  </div>

                  {/* Hadits dalam subbab */}
                  <div className="flex flex-col gap-5">
                    {group.hadiths.map((hadith) => (
                      <div
                        key={hadith.number}
                        id={`hadith-${hadith.number}`}
                        className="group relative bg-[#1A223D] p-6 md:p-8 flex flex-col rounded-md transition-all hover:bg-[#25304C] scroll-mt-28 target:ring-2 target:ring-[#D48C46]/60 target:bg-[#25304C] overflow-hidden"
                      >
                        <div className="flex justify-between items-start mb-2 relative z-10">
                          <div className="flex flex-col gap-1">
                            <h4 className="font-cormorant text-lg md:text-xl text-[#F0F2F5] leading-tight">
                              Hadits Riwayat {bookData.name}
                            </h4>
                            <span className="text-[#D48C46] font-medium text-[0.7rem] tracking-wider uppercase">
                              {bookData.name} No. {hadith.number}
                            </span>
                          </div>
                          <CopyButton textToCopy={`${hadith.arab}\n\n"${hadith.id}"\n\n— ${bookData.name} No. ${hadith.number}`} />
                        </div>
                        
                        <div className="mb-5 relative z-10">
                          <p className="font-neirizi text-xl md:text-2xl text-[#E8B07D] text-right leading-[1.8] opacity-90" dir="rtl">
                            {hadith.arab}
                          </p>
                        </div>
                        
                        <div className="border-t border-[#D48C46]/10 pt-4 relative z-10 text-justify">
                          <blockquote className={`text-[#F0F2F5]/90 text-[0.9rem] md:text-[0.95rem] italic text-justify leading-relaxed border-l-2 border-[#D48C46]/40 pl-3 ${montserrat.className}`}>
                            &quot;{hadith.id}&quot;
                          </blockquote>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 border-t border-[#D48C46]/18 pt-8 pb-10">
                {isFirstPage ? (
                  <button disabled className="flex items-center justify-center w-10 h-10 rounded-full border border-[#8B95A6]/30 text-[#8B95A6]/30 cursor-not-allowed">
                    &larr;
                  </button>
                ) : (
                  <button 
                    onClick={() => handlePageChange(activePage - 1)}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-[#D48C46]/50 text-[#D48C46] hover:bg-[#D48C46]/10 transition-colors"
                  >
                    &larr;
                  </button>
                )}
                
                <span className="text-[#8B95A6] text-xs tracking-widest uppercase">
                  Halaman <strong className="text-[#F0F2F5] font-medium px-1">{activePage}</strong> dari {totalPages}
                </span>

                {isLastPage ? (
                  <button disabled className="flex items-center justify-center w-10 h-10 rounded-full border border-[#8B95A6]/30 text-[#8B95A6]/30 cursor-not-allowed">
                    &rarr;
                  </button>
                ) : (
                  <button 
                    onClick={() => handlePageChange(activePage + 1)}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-[#D48C46]/50 text-[#D48C46] hover:bg-[#D48C46]/10 transition-colors"
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
