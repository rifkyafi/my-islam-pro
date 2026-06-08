export function Footer() {
  return (
    <footer className="bg-[#132830] border-t border-[#C9A84C]/18 py-14">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
        <div className="flex flex-col gap-2 shrink-0">
          <span className="font-amiri text-[2.25rem] text-[#C9A84C] leading-none">حديث</span>
          <p className="font-cormorant text-[0.9rem] font-normal text-[#C4B89A]">
            Hadis Berdasarkan Tema Kehidupan
          </p>
        </div>
        <div className="hidden md:block w-[1px] h-[60px] bg-[#C9A84C]/18 shrink-0" aria-hidden="true" />
        <p className="text-[0.825rem] text-[#7A8F96] leading-[1.75]">
          Dibuat dengan penuh rasa cinta kepada Rasulullah ﷺ
          <br />
          <small className="text-[0.72rem] opacity-65">
            Data bersumber dari kitab-kitab hadis yang sahih · Digunakan untuk tujuan pembelajaran
          </small>
        </p>
      </div>
    </footer>
  )
}
