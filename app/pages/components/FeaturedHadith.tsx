import { FeaturedHadithData } from '../types'
import { CopyButton } from './CopyButton';

export function FeaturedHadith({ data }: { data: FeaturedHadithData | null }) {
  if (!data) return null;

  const fullHadithText = `${data.arabic}\n\n"${data.translation}"\n\n— ${data.source} No. ${data.number}`;

  return (
    <section id="hadis-pilihan" className="bg-[#0C1A1F] py-8 md:pb-24">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="block text-[0.68rem] font-semibold tracking-[4.5px] uppercase text-[#C9A84C] mb-3">Hadis Pilihan</span>
            <h2 className="font-cormorant text-[clamp(1.875rem,3vw,2.625rem)] font-normal leading-[1.15] text-[#F2EBD9]">Renungan Hari Ini</h2>
          </div>
          <CopyButton textToCopy={fullHadithText} />
        </div>

        <div className="bg-[#132830] border border-[#C9A84C]/18 p-10 md:p-14 md:px-16 relative overflow-hidden">
          <div className="absolute -top-8 left-10 font-cormorant text-[14rem] text-[#C9A84C]/5 leading-none pointer-events-none select-none" aria-hidden="true">&ldquo;</div>
          <p className="font-neirizi text-2xl md:text-[2rem] md:leading-[2.1] text-right direction-rtl text-[#E2C07A] mb-8 relative z-10">{data.arabic}</p>
          <blockquote className="font-cormorant text-[1.125rem] md:text-[1.35rem] font-light italic text-[#F2EBD9] leading-[1.85] pl-6 border-l-2 border-[#C9A84C] mb-8 relative z-10">
            &ldquo;{data.translation}&rdquo;
          </blockquote>
          <footer className="flex items-center justify-between flex-wrap gap-4 relative z-10">
            <span className="text-[0.8rem] text-[#7A8F96] italic">
              {data.narrator}
            </span>
            <div className="flex gap-3 flex-wrap">
              <span className="text-[0.72rem] font-medium tracking-[0.5px] p-[0.35rem_0.875rem] border border-[#C9A84C]/18 text-[#7A8F96]">
                {data.source} · No. {data.number}
              </span>
              <span className="text-[0.72rem] font-medium tracking-[0.5px] p-[0.35rem_0.875rem] bg-[#C9A84C]/12 border border-[#C9A84C]/30 text-[#C9A84C]">
                Tema: {data.theme}
              </span>
            </div>
          </footer>
        </div>
      </div>
    </section>
  )
}
