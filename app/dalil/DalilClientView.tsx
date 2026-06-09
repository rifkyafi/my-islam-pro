"use client";

import { useState } from 'react';
import Link from 'next/link';
import { CardList } from '../pages/components/CardList';

export default function DalilClientView({ dalils, dalilKarakterData }: { dalils: any[], dalilKarakterData: any[] }) {
  // Set default active tab to the first item of dalils
  const [activeId, setActiveId] = useState(dalils[0]?.id);
  const [activeSubId, setActiveSubId] = useState<number | null>(null);

  const handleSetActiveId = (id: string) => {
    setActiveId(id);
    setActiveSubId(null);
  };

  const activeTema = dalils.find(d => d.id === activeId);
  const activeKarakterIndex = dalilKarakterData.findIndex((d, idx) => `target-${idx}` === activeId);
  const activeKarakter = activeKarakterIndex !== -1 ? dalilKarakterData[activeKarakterIndex] : null;

  // Initialize activeSubId if a Target tab is active and no sub tab is selected
  if (activeKarakter && activeSubId === null && activeKarakter.items.length > 0) {
    setActiveSubId(activeKarakter.items[0].no);
  }

  const activeSubItem = activeKarakter?.items.find((sub: any) => sub.no === activeSubId) || activeKarakter?.items[0];

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
      {/* Navigasi Tema (Sidebar Desktop / Scroll Horizontal Mobile) */}
      <aside className="w-full lg:w-[240px] shrink-0 relative z-40">
        <div className="sticky top-0 lg:top-28 pt-4 lg:pt-0 -mx-5 px-5 lg:mx-0 lg:px-0 bg-[#0F2027]/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none lg:max-h-[calc(100vh-140px)] overflow-x-auto lg:overflow-y-auto lg:pr-4 scrollbar-none lg:scrollbar-thin lg:scrollbar-thumb-[#C9A84C]/20 lg:scrollbar-track-transparent pb-4 border-b border-[#C9A84C]/10 lg:border-b-0">
          
          <div className="flex flex-row lg:flex-col gap-6 lg:gap-0 w-max lg:w-auto items-center lg:items-stretch">
            
            {/* Bagian Daftar Tema */}
            <div className="flex flex-col">
              <h4 className="hidden lg:block text-[#C9A84C] font-semibold text-[0.65rem] tracking-[3px] uppercase mb-6">
                Daftar Tema
              </h4>
              <nav className="flex flex-row lg:flex-col gap-2 lg:gap-1.5">
                {dalils.map((dalil) => {
                  const isActive = activeId === dalil.id;
                  return (
                    <button 
                      key={`nav-${dalil.id}`} 
                      onClick={() => handleSetActiveId(dalil.id)}
                      className={`text-[0.8rem] lg:text-[0.85rem] text-left px-4 py-1.5 lg:px-3 lg:py-2 rounded-full lg:rounded-md transition-all whitespace-nowrap lg:truncate shadow-sm lg:shadow-none border flex-shrink-0 lg:flex-shrink ${
                        isActive 
                          ? 'bg-[#1E3A47] text-[#F2EBD9] border-[#C9A84C]/40' 
                          : 'text-[#7A8F96] hover:text-[#F2EBD9] hover:bg-[#1E3A47] bg-[#182E38] lg:bg-transparent border-[#C9A84C]/20 lg:border-transparent'
                      }`}
                    >
                      {dalil.kategori}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Separator Mobile (Vertikal) / Desktop (Horizontal) */}
            <div className="w-px h-8 bg-[#C9A84C]/20 lg:hidden"></div>
            <div className="hidden lg:block w-full h-px bg-[#C9A84C]/10 my-8"></div>

            {/* Bagian Target & Karakter */}
            <div className="flex flex-col">
              <h4 className="hidden lg:block text-[#C9A84C] font-semibold text-[0.65rem] tracking-[3px] uppercase mb-6">
                Target & Karakter
              </h4>
              <nav className="flex flex-row lg:flex-col gap-2 lg:gap-1.5">
                {dalilKarakterData.map((item, idx) => {
                  const targetId = `target-${idx}`;
                  const isActive = activeId === targetId;
                  return (
                    <button 
                      key={`nav-${targetId}`} 
                      onClick={() => handleSetActiveId(targetId)}
                      className={`text-[0.8rem] lg:text-[0.85rem] text-left px-4 py-1.5 lg:px-3 lg:py-2 rounded-full lg:rounded-md transition-all whitespace-nowrap lg:truncate shadow-sm lg:shadow-none border flex-shrink-0 lg:flex-shrink ${
                        isActive 
                          ? 'bg-[#1E3A47] text-[#F2EBD9] border-[#C9A84C]/40' 
                          : 'text-[#7A8F96] hover:text-[#F2EBD9] hover:bg-[#1E3A47] bg-[#182E38] lg:bg-transparent border-[#C9A84C]/20 lg:border-transparent'
                      }`}
                    >
                      {item.kategori}
                    </button>
                  )
                })}
              </nav>
            </div>
            
          </div>

        </div>
      </aside>

      {/* Area Konten Utama */}
      <div className="flex-1 flex flex-col gap-8 min-h-[500px]">
        {activeTema && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardList 
              theme={{
                slug: `dalil/${activeTema.id}`,
                title: activeTema.kategori,
                arabic: activeTema.arabic,
                description: activeTema.keterangan,
                hadithCount: activeTema.jumlah,
                translation: activeTema.translation,
                sourceInfo: activeTema.sourceInfo,
                keywords: activeTema.keywords,
                dalils: activeTema.dalils,
              }} 
            />
          </div>
        )}

        {activeKarakter && activeSubItem && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Modern Responsive Sub-tabs */}
            <div className="mb-8 relative z-10">
              <h3 className="text-[#C9A84C] font-semibold text-[0.65rem] tracking-[3px] uppercase mb-4 pl-1">
                Pilih Karakter Utama:
              </h3>
              <div className="flex overflow-x-auto scrollbar-none md:flex-wrap gap-3 pb-4 -mx-5 px-5 md:mx-0 md:px-0 md:pb-0">
                {activeKarakter.items.map((sub: any) => {
                  const isActive = activeSubId === sub.no;
                  return (
                    <button
                      key={sub.no}
                      onClick={() => setActiveSubId(sub.no)}
                      className={`group relative flex items-center gap-3 px-4 py-2.5 md:px-5 md:py-3 rounded-2xl text-[0.85rem] md:text-[0.9rem] transition-all duration-300 border overflow-hidden flex-shrink-0 ${
                        isActive
                          ? 'border-[#C9A84C]/50 shadow-[0_0_20px_rgba(201,168,76,0.15)] text-[#F2EBD9] transform -translate-y-0.5'
                          : 'border-[#C9A84C]/10 bg-[#182E38]/50 text-[#7A8F96] hover:border-[#C9A84C]/30 hover:bg-[#1E3A47]/80 hover:text-[#F2EBD9] hover:-translate-y-0.5'
                      }`}
                    >
                      {/* Active Glow/Gradient */}
                      {isActive && (
                        <>
                          <div className="absolute inset-0 bg-[#1E3A47] z-0"></div>
                          <div className="absolute top-0 left-0 w-1 h-full bg-[#C9A84C] z-0"></div>
                        </>
                      )}
                      
                      {/* Number Circle */}
                      <div className={`relative z-10 flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full text-[0.65rem] md:text-[0.7rem] font-bold transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#C9A84C] text-[#0F2027] shadow-[0_0_10px_rgba(201,168,76,0.5)]' 
                          : 'bg-[#0F2027]/80 text-[#C9A84C] group-hover:bg-[#C9A84C]/20'
                      }`}>
                        {sub.no}
                      </div>
                      
                      {/* Text */}
                      <span className="relative z-10 font-medium tracking-wide">{sub.karakter}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <CardList 
              theme={{
                slug: `target/${activeKarakterIndex}/sub/${activeSubItem.no}`,
                title: activeSubItem.karakter,
                description: activeKarakter.keterangan || `Dalil pembinaan untuk karakter: ${activeSubItem.karakter}`,
                hadithCount: activeSubItem.fetchedDalils?.length || 0,
                keywords: [activeKarakter.kategori],
                dalils: activeSubItem.fetchedDalils || [],
              }} 
            />
          </div>
        )}
      </div>
    </div>
  )
}
