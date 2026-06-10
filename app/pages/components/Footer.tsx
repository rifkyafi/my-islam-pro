export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0E1324] overflow-hidden">
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,#D48C46/30,transparent)]" />

      {/* Large watermark */}
      <div
        className="absolute right-10 top-1/2 -translate-y-1/2 font-neirizi text-[10rem] text-[#D48C46]/[0.03] leading-none select-none pointer-events-none"
        aria-hidden="true"
      >
        حديث
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1px_1fr_auto] items-center gap-8 md:gap-10">

          {/* Logo block */}
          <div className="flex flex-col gap-2">
            <span className="font-neirizi text-[2.5rem] text-[#D48C46] leading-none">حديث</span>
            <p className="font-cormorant text-[0.9rem] font-normal text-[#D1A582]">
              Hadis Berdasarkan Tema Kehidupan
            </p>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-16 bg-[linear-gradient(to_bottom,transparent,#D48C46/20,transparent)]" aria-hidden="true" />

          {/* Description */}
          <div>
            <p className="text-[0.825rem] text-[#8B95A6] leading-[1.8] max-w-[360px]">
              Dibuat dengan penuh rasa cinta kepada Rasulullah ﷺ
            </p>
            <p className="text-[0.72rem] text-[#8B95A6]/45 mt-2 leading-[1.7]">
              Data bersumber dari kitab-kitab hadis yang sahih · Digunakan untuk tujuan pembelajaran
            </p>
          </div>

          {/* Right: links + copyright */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="flex items-center gap-5">
              <a href="#tema" className="text-[0.75rem] text-[#8B95A6]/60 hover:text-[#D48C46] transition-colors no-underline tracking-[1px]">Kitab</a>
              <a href="#hadis-pilihan" className="text-[0.75rem] text-[#8B95A6]/60 hover:text-[#D48C46] transition-colors no-underline tracking-[1px]">Hadis Pilihan</a>
            </div>
            <span className="text-[0.68rem] text-[#8B95A6]/30 tracking-[1px]">
              © {year} Hadis Tematik
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
