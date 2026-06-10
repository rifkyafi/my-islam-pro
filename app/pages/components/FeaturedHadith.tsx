import { FeaturedHadithData } from '../types'
import { CopyButton } from './CopyButton';

export function FeaturedHadith({ data }: { data: FeaturedHadithData | null }) {
  if (!data) return null;

  const fullHadithText = `${data.arabic}\n\n"${data.translation}"\n\n— ${data.source} No. ${data.number}`;

  return (
    <section id="hadis-pilihan" className="relative bg-[#090C15] py-24 overflow-hidden">
      {/* Left vertical accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[linear-gradient(to_bottom,transparent,#D48C46/30,transparent)]" aria-hidden="true" />

      {/* Large decorative quote mark */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 font-cormorant text-[22rem] text-[#D48C46]/[0.03] leading-none pointer-events-none select-none"
        aria-hidden="true"
      >
        &ldquo;
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-10">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-[#D48C46]/50" />
            <span className="text-[0.65rem] font-semibold tracking-[5px] uppercase text-[#D48C46]">
              Hadis Pilihan
            </span>
          </div>
          <div className="flex-1 h-px bg-[#D48C46]/10" />
          <CopyButton textToCopy={fullHadithText} />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-0 lg:gap-16 items-start">

          {/* Main content */}
          <div className="relative">
            {/* Arabic text with large left border */}
            <div className="flex gap-6 mb-10">
              <div className="hidden md:flex flex-col items-center gap-2 pt-2 shrink-0">
                <div className="w-px flex-1 bg-[linear-gradient(to_bottom,#D48C46,transparent)]" />
              </div>
              <p
                className="font-neirizi text-[1.7rem] md:text-[2.1rem] leading-[1.9] text-right text-[#E8B07D] flex-1"
                dir="rtl"
              >
                {data.arabic}
              </p>
            </div>

            {/* Translation */}
            <blockquote className="relative pl-6 border-l-2 border-[#D48C46]/40 mb-8">
              <p className="font-cormorant text-[1.2rem] md:text-[1.4rem] font-light italic text-[#F0F2F5] leading-[1.9]">
                &ldquo;{data.translation}&rdquo;
              </p>
            </blockquote>

            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 text-[0.72rem] text-[#8B95A6] italic">
                {data.narrator}
              </span>
              <span className="text-[#D48C46]/20">·</span>
              <span className="text-[0.7rem] font-medium tracking-[1.5px] px-3 py-1 border border-[#D48C46]/15 text-[#8B95A6]">
                {data.source} — No. {data.number}
              </span>
              <span className="text-[0.7rem] font-medium tracking-[1.5px] px-3 py-1 bg-[#D48C46]/10 border border-[#D48C46]/25 text-[#D48C46]">
                {data.theme}
              </span>
            </div>
          </div>

          {/* Right side: decorative Arabic calligraphy panel */}
          <div className="hidden lg:flex flex-col items-center justify-center w-48 self-stretch">
            <div className="w-full flex-1 flex flex-col items-center justify-center gap-6 border border-[#D48C46]/10 p-6">
              <div className="w-px h-10 bg-[linear-gradient(to_bottom,transparent,#D48C46/40)]" />
              <span className="font-neirizi text-5xl text-[#D48C46]/25 leading-none writing-vertical" aria-hidden="true">
                الحديث
              </span>
              <span className="font-neirizi text-3xl text-[#D48C46]/15 leading-none" aria-hidden="true">
                ✦
              </span>
              <span className="font-neirizi text-4xl text-[#D48C46]/20 leading-none" aria-hidden="true">
                النبوي
              </span>
              <div className="w-px h-10 bg-[linear-gradient(to_bottom,#D48C46/40,transparent)]" />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
