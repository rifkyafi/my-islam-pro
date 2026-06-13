"use client";
import { useState, useRef, useCallback, useEffect } from 'react'
import { LifeTheme } from '../types'
import { CopyButton } from './CopyButton'

function AudioPlayer({ url }: { url: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    setProgress((audio.currentTime / audio.duration) * 100)
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setProgress(0)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audio.currentTime = ratio * audio.duration
  }

  return (
    <div className="flex items-center gap-3 mt-4 p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--accent-border-light)]">
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="none"
      />
      {/* Play / Pause button */}
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className="shrink-0 w-9 h-9 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-light)] transition-colors flex items-center justify-center shadow-md"
      >
        {isPlaying ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--text-on-accent)">
            <rect x="2" y="1" width="4" height="12" rx="1"/>
            <rect x="8" y="1" width="4" height="12" rx="1"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--text-on-accent)">
            <path d="M3 1.5l9 5.5-9 5.5V1.5z"/>
          </svg>
        )}
      </button>
      {/* Progress bar */}
      <div
        className="flex-1 h-1.5 bg-[var(--accent-border-light)] rounded-full cursor-pointer relative overflow-hidden"
        onClick={handleSeek}
      >
        <div
          className="absolute left-0 top-0 h-full bg-[var(--accent)] rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-[0.6rem] text-[var(--text-muted)] tracking-wider shrink-0">AUDIO</span>
    </div>
  )
}

function DalilItem({ arabic, translation, sourceInfo, type, textToCopy, audioUrl, id }: {
  arabic: string
  translation: string
  sourceInfo: string
  type: 'hadith' | 'quran'
  textToCopy: string
  audioUrl?: string
  id?: string
}) {
  return (
    <div id={id} className="py-6 border-b border-[var(--accent-border-light)] last:border-0 scroll-mt-28 target:ring-2 target:ring-[var(--accent-border)] target:bg-[var(--bg-card-hover)] px-4 rounded-xl transition-all duration-300">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[0.65rem] font-medium px-2 py-0.5 rounded-full tracking-wider uppercase ${
            type === 'quran'
              ? 'bg-[var(--accent-dim)]/20 text-[var(--text-accent-dim)] border border-[var(--accent-border)]'
              : 'bg-[var(--accent)]/10 text-[var(--text-accent)] border border-[var(--accent-border)]'
          }`}>
            {type === 'quran' ? 'Al-Qur\'an' : 'Hadits'}
          </span>
          <span className="text-[0.7rem] text-[var(--text-muted)] tracking-wide">{sourceInfo}</span>
        </div>
        <div className="shrink-0">
          <CopyButton textToCopy={textToCopy} />
        </div>
      </div>
      
      {arabic && (
        <p className="font-neirizi text-2xl md:text-3xl text-[var(--text-accent-bright)] text-right leading-[1.8] mb-6 mt-2">{arabic}</p>
      )}
      
      <blockquote
        className="text-[0.95rem] md:text-base text-[var(--text-primary)]/90 italic text-justify leading-relaxed border-l-2 border-[var(--accent-border)] pl-4 mb-2"
        style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
      >
        &quot;{translation}&quot;
      </blockquote>
      {audioUrl && <AudioPlayer url={audioUrl} />}
    </div>
  )
}

export function CardList({ theme, collapseAll = false, expanded: controlledExpanded }: { theme: LifeTheme, collapseAll?: boolean, expanded?: boolean }) {
  const [expanded, setExpanded] = useState(false)

  // Auto-expand if URL has hash, or if expanded prop is passed
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash) {
        setExpanded(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Controlled expansion from parent
  useEffect(() => {
    if (controlledExpanded) setExpanded(true);
  }, [controlledExpanded]);

  const firstDalil = theme.dalils?.[0]
  const restDalils = theme.dalils?.slice(1) ?? []
  
  const itemsToShow = collapseAll ? (theme.dalils || []) : restDalils
  const hasItemsToShow = itemsToShow.length > 0

  return (
    <div className="group relative bg-[var(--bg-card)] transition-all hover:bg-[var(--bg-card-hover)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[linear-gradient(90deg,var(--accent-dim),var(--accent),var(--accent-dim))] before:scale-x-0 before:origin-left before:transition-transform before:duration-[400ms] hover:before:scale-x-100">
      {/* Header tema */}
      <div className="p-[1.875rem] md:px-[1.625rem] md:py-[1.875rem]">

        {/* 1. Judul */}
        <h3 className="font-cormorant text-3xl font-medium text-[var(--text-primary)] mb-3 relative z-10">{theme.title}</h3>
        
        {/* 2. Keterangan */}
        <p className="text-[0.85rem] font-light text-[var(--text-muted)] leading-[1.7] mb-5 relative z-10">{theme.description}</p>
        
        {/* 3. Tiga Kata Kunci */}
        <div className="flex flex-wrap gap-2 mb-8 relative z-10">
          {theme.keywords?.map((kw) => (
            <span key={kw} className="px-3 py-1 bg-[var(--accent)]/10 border border-[var(--accent-border)] text-[var(--text-accent)] rounded-full text-[0.65rem] font-medium tracking-wide whitespace-nowrap"
              style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              {kw}
            </span>
          ))}
        </div>

        {/* Dalil pertama (selalu tampil kecuali collapseAll true) */}
        {firstDalil && !collapseAll && (
          <DalilItem
            arabic={firstDalil.arabic}
            translation={firstDalil.translation}
            sourceInfo={firstDalil.sourceInfo}
            type={firstDalil.type}
            audioUrl={firstDalil.audioUrl}
            textToCopy={`${firstDalil.arabic}\n\n"${firstDalil.translation}"\n\n— ${firstDalil.sourceInfo}`}
            id={firstDalil.id}
          />
        )}

        {/* Dalil lain — tampil saat expanded atau controlledExpanded */}
        {(expanded || controlledExpanded) && itemsToShow.map((d, i) => (
          <DalilItem
            key={i}
            arabic={d.arabic}
            translation={d.translation}
            sourceInfo={d.sourceInfo}
            type={d.type}
            audioUrl={d.audioUrl}
            textToCopy={`${d.arabic}\n\n"${d.translation}"\n\n— ${d.sourceInfo}`}
            id={d.id || (d.sourceInfo ? d.sourceInfo.replace(/\s+/g, '-').toLowerCase() : undefined)}
          />
        ))}

        {/* Footer: jumlah & tombol expand */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--accent-border-light)]">
          <span className="text-[0.72rem] font-medium text-[var(--text-accent-dim)] tracking-[0.5px]">
            {theme.hadithCount} {collapseAll ? 'ayat' : 'dalil'} tersedia
          </span>
          {hasItemsToShow && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[0.72rem] text-[var(--text-accent)] hover:text-[var(--text-primary)] transition-colors font-medium tracking-wide flex items-center gap-1"
            >
              {expanded ? 'Sembunyikan' : `Lihat ${itemsToShow.length} ${collapseAll ? 'ayat' : 'dalil lainnya'}`}
              <span className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>↓</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
