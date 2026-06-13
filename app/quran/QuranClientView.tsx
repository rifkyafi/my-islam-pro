"use client";

import { useState, useEffect, useCallback, startTransition, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { CardList } from '../pages/components/CardList';

export interface Surah {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string;
  deskripsi: string;
  audio: string;
}

interface Verse {
  ar: string;
  id: string;
  nomor: number;
  audio?: Record<string, string>;
}

interface EQuranVerse {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export default function QuranClientView({ surahs }: { surahs: Surah[] }) {
  const searchParams = useSearchParams();
  const initialSurah = Number(searchParams.get('surah')) || surahs[0]?.nomor || 1;
  const initialAyat = typeof window !== 'undefined'
    ? Number(window.location.hash.replace('#ayat-', '')) || 0
    : 0;

  const [activeSurahNo, setActiveSurahNo] = useState<number>(initialSurah);
  const [targetAyat, setTargetAyat] = useState<number>(initialAyat);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [surahDetail, setSurahSurahDetail] = useState<Surah | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [cardListKey, setCardListKey] = useState(0);
  const scrollRafRef = useRef<number>(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const s = Number(searchParams.get('surah'));
    if (s && s !== activeSurahNo) {
      startTransition(() => {
        setTargetAyat(0);
        setCardListKey(k => k + 1);
      });
      setTimeout(() => startTransition(() => setActiveSurahNo(s)), 0);
    }
  }, [searchParams, activeSurahNo]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#ayat-')) {
      const ayatNo = Number(hash.replace('#ayat-', ''));
      if (ayatNo) {
        startTransition(() => {
          setTargetAyat(ayatNo);
        });
      }
    }
  }, [searchParams]);

  const fetchVerses = useCallback(async (no: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quran?endpoint=/surat/${no}`);
      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        
        if (data && data.ayat) {
          const mappedVerses = data.ayat.map((v: EQuranVerse) => ({
            ar: v.teksArab,
            id: v.teksIndonesia,
            nomor: v.nomorAyat,
            audio: v.audio
          }));
          setVerses(mappedVerses);
          
          const mappedDetail: Surah = {
            nomor: data.nomor,
            nama: data.nama,
            nama_latin: data.namaLatin,
            jumlah_ayat: data.jumlahAyat,
            tempat_turun: data.tempatTurun,
            arti: data.arti,
            deskripsi: data.deskripsi,
            audio: data.audioFull?.['05'] || ''
          };
          setSurahSurahDetail(mappedDetail);
        }
      }
    } catch (e) {
      console.error("Error fetching verses:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => fetchVerses(activeSurahNo), 0);
  }, [activeSurahNo, fetchVerses]);

  // Scroll ke ayat target — retry via requestAnimationFrame hingga elemen ditemukan
  useEffect(() => {
    if (loading || verses.length === 0) return;

    const targetSurah = Number(searchParams.get('surah'));
    if (targetSurah && targetSurah !== activeSurahNo) return;

    const ayatNo = searchParams.get('ayat') ||
      (window.location.hash.startsWith('#ayat-')
        ? window.location.hash.replace('#ayat-', '')
        : null);
    if (!ayatNo) return;

    let cancelled = false;
    let retries = 0;
    const MAX_RETRIES = 100;

    const doScroll = () => {
      if (cancelled) return;
      const el = document.getElementById(`ayat-${ayatNo}`);
      if (!el) {
        if (retries < MAX_RETRIES) {
          retries++;
          scrollRafRef.current = requestAnimationFrame(doScroll);
        }
        return;
      }

      const offset = 140;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });

      el.classList.remove('animate-target-pulse');
      void el.offsetWidth;
      el.classList.add('animate-target-pulse');
      setTimeout(() => el.classList.remove('animate-target-pulse'), 4000);
    };

    scrollRafRef.current = requestAnimationFrame(doScroll);

    return () => {
      cancelled = true;
      cancelAnimationFrame(scrollRafRef.current);
    };
  }, [loading, verses, searchParams, activeSurahNo]);

  const activeSurah = surahs.find(s => s.nomor === activeSurahNo);

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
      {/* Sidebar: Surah List */}
      <aside className="w-full lg:w-[280px] shrink-0 relative z-40">
        <div className="sticky top-0 lg:top-28 pt-4 lg:pt-0 -mx-5 px-5 lg:mx-0 lg:px-0 bg-[var(--bg-primary)]/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none lg:max-h-[calc(100vh-140px)] overflow-x-auto lg:overflow-y-auto lg:pr-4 scrollbar-none lg:scrollbar-thin lg:scrollbar-thumb-[var(--accent-border)] lg:scrollbar-track-transparent pb-4 border-b border-[var(--accent-border-light)] lg:border-b-0">
          
          <div className="flex flex-row lg:flex-col gap-2 w-max lg:w-auto">
            <h4 className="hidden lg:block text-[var(--text-accent)] font-semibold text-[0.65rem] tracking-[3px] uppercase mb-6">
              Daftar Surah
            </h4>
            <nav className="flex flex-row lg:flex-col gap-2 lg:gap-1.5">
              {surahs.map((surah) => {
                const isActive = activeSurahNo === surah.nomor;
                return (
                  <button 
                    key={`surah-${surah.nomor}`} 
                    onClick={() => {
                      setActiveSurahNo(surah.nomor);
                      setTargetAyat(0);
                      setCardListKey(k => k + 1);
                    }}
                    className={`text-[0.8rem] lg:text-[0.85rem] text-left px-4 py-2 lg:px-3 lg:py-2.5 rounded-full lg:rounded-md transition-all whitespace-nowrap shadow-sm lg:shadow-none border flex items-center gap-3 ${
                      isActive 
                        ? 'bg-[var(--bg-card-hover)] text-[var(--text-primary)] border-[var(--accent)]' 
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] bg-[var(--bg-card)] lg:bg-transparent border-[var(--accent-border)] lg:border-transparent'
                    }`}
                  >
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full text-[0.6rem] font-bold ${isActive ? 'bg-[var(--accent)] text-[var(--text-on-accent)]' : 'bg-[var(--bg-primary)] text-[var(--text-accent)] border border-[var(--accent-border)]'}`}>
                      {surah.nomor}
                    </span>
                    <div className="flex flex-col leading-tight">
                      <span className="font-medium">{surah.nama_latin}</span>
                      <span className="text-[0.6rem] opacity-60 uppercase tracking-wider">{surah.arti}</span>
                    </div>
                    <span className="ml-auto font-neirizi text-sm opacity-50 hidden lg:block">{surah.nama}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-8 min-h-[600px]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-[var(--accent)]/20 border-t-[var(--accent)] rounded-full animate-spin" />
              <p className="font-cormorant text-xl text-[var(--text-accent)]">Memuat Ayat...</p>
            </div>
          </div>
        ) : activeSurah && (
          <div key={cardListKey} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardList 
              collapseAll={true}
              expanded={!!searchParams.get('ayat') || (isClient && window.location.hash.startsWith('#ayat-'))}
              theme={{
                slug: `quran/${activeSurah.nomor}`,
                title: `${activeSurah.nama_latin} (${activeSurah.nama})`,
                arabic: activeSurah.nama,
                description: surahDetail?.deskripsi?.replace(/<[^>]*>?/gm, '') || `Surah ${activeSurah.nama_latin}, surah ke-${activeSurah.nomor} dalam Al-Qur'an. Terdiri dari ${activeSurah.jumlah_ayat} ayat.`,
                hadithCount: activeSurah.jumlah_ayat,
                keywords: [activeSurah.tempat_turun, `${activeSurah.jumlah_ayat} Ayat`],
                dalils: verses.map(v => ({
                  arabic: v.ar,
                  translation: v.id,
                  sourceInfo: `QS. ${activeSurah.nama_latin} : ${v.nomor}`,
                  type: 'quran' as const,
                  audioUrl: v.audio?.['05'] || v.audio?.['01'] || undefined,
                  id: `ayat-${v.nomor}`
                })),
              }} 
            />
          </div>
        )}
      </div>
    </div>
  )
}
