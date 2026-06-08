import Link from 'next/link'

export function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-5 py-4.5 md:px-10 flex items-center justify-between bg-[#0C1A1F]/82 backdrop-blur-[18px] border-b border-[#C9A84C]/18">
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <span className="font-amiri text-2xl text-[#C9A84C] leading-none">حديث</span>
        <span className="font-cormorant text-[1.05rem] font-medium text-[#C4B89A] tracking-[0.3px]">Hadis Tematik</span>
      </Link>
      <ul className="hidden md:flex items-center gap-9 list-none">
        <li><a href="#tema" className="text-[0.825rem] font-normal text-[#7A8F96] no-underline tracking-[0.5px] transition-colors hover:text-[#F2EBD9]">Tema</a></li>
        <li><a href="#hadis-pilihan" className="text-[0.825rem] font-normal text-[#7A8F96] no-underline tracking-[0.5px] transition-colors hover:text-[#F2EBD9]">Hadis Pilihan</a></li>
        <li>
          <Link href="/search" className="px-5 py-2 border border-[#C9A84C]/42 text-[#C9A84C] text-[0.825rem] no-underline tracking-[0.5px] transition-all hover:bg-[#C9A84C]/12 hover:text-[#E2C07A]">
            Cari Hadis
          </Link>
        </li>
      </ul>
    </nav>
  )
}
