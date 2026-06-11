export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[var(--bg-secondary)] overflow-hidden">
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,var(--accent-border),transparent)]" />

      {/* Large watermark */}
      <div
        className="absolute right-10 top-1/2 -translate-y-1/2 font-neirizi text-[10rem] text-[var(--accent-glow)] leading-none select-none pointer-events-none"
        aria-hidden="true"
      >
        حديث
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1px_1fr_auto] items-center gap-8 md:gap-10">

          {/* Logo block */}
          <div className="flex flex-col gap-2">
            <span className="font-neirizi text-[2.5rem] text-[var(--text-accent)] leading-none">حديث</span>
            <p className="font-cormorant text-[0.9rem] font-normal text-[var(--text-secondary)]">
              Hadis Berdasarkan Tema Kehidupan
            </p>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-16 bg-[linear-gradient(to_bottom,transparent,var(--accent-border),transparent)]" aria-hidden="true" />

          {/* Description */}
          <div>
            <p className="text-[0.825rem] text-[var(--text-muted)] leading-[1.8] max-w-[360px]">
              Dibuat dengan penuh rasa cinta kepada Rasulullah ﷺ
            </p>
            <p className="text-[0.72rem] text-[var(--text-muted)] opacity-45 mt-2 leading-[1.7]">
              Data bersumber dari kitab-kitab hadis yang sahih · Digunakan untuk tujuan pembelajaran
            </p>
          </div>

          {/* Right: links + copyright */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="flex items-center gap-5">
              <a href="#tema" className="text-[0.75rem] text-[var(--text-muted)] opacity-60 hover:text-[var(--text-accent)] transition-colors no-underline tracking-[1px]">Kitab</a>
              <a href="#hadis-pilihan" className="text-[0.75rem] text-[var(--text-muted)] opacity-60 hover:text-[var(--text-accent)] transition-colors no-underline tracking-[1px]">Hadis Pilihan</a>
            </div>
            <span className="text-[0.68rem] text-[var(--text-muted)] opacity-30 tracking-[1px]">
              © {year} Hadis Tematik
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
