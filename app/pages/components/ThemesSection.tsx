import { ThemeCard } from './ThemeCard'

interface HadithBook {
  id: string;
  name: string;
  available: number;
}

export async function ThemesSection() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  let books: HadithBook[] = [];
  try {
    const response = await fetch(`${baseUrl}/api/hadits`, {
      next: { revalidate: 3600 }
    });
    if (response.ok) {
      const json = await response.json();
      books = json.data || [];
    }
  } catch (e) {
    console.error("Error fetching hadith books:", e);
  }

  return (
    <section id="tema" className="py-28 bg-[#090C15] relative overflow-hidden">
      {/* Subtle background grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(#D48C46 1px, transparent 1px), linear-gradient(90deg, #D48C46 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
        aria-hidden="true"
      />

      {/* Radial glow top-left */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(212,140,70,0.04),transparent_65%)] pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-10">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#D48C46]/50" />
              <span className="text-[0.65rem] font-semibold tracking-[5px] uppercase text-[#D48C46]">
                Navigasi Kitab
              </span>
            </div>
            <h2 className="font-cormorant text-[clamp(2rem,3.5vw,3rem)] font-light leading-[1.1] text-[#F0F2F5]">
              Kitab Rujukan
              <br />
              <em className="italic text-[#D48C46]/80">9 Kitab Hadis dan Al-Qur&apos;an</em>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <p className="text-[0.875rem] font-light text-[#8B95A6] max-w-full md:max-w-[280px] md:text-right leading-[1.8]">
              Menghimpun ayat suci Al-Qur&apos;an dan ribuan hadis sahih sebagai rujukan utama umat Islam
            </p>
            {/* Total count badge */}
            <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#D48C46]/20 text-[#D48C46]/70 text-[0.65rem] tracking-[2.5px] uppercase">
              <span className="w-1 h-1 rounded-full bg-[#D48C46] animate-pulse" />
              {String(books.reduce((sum, b) => sum + b.available, 0) + 6236).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} Total Dalil
            </span>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
          {books.map((book) => (
            <div key={book.id} className="col-span-1 flex">
              <div className="w-full h-full">
                <ThemeCard
                  theme={{ slug: book.id, title: book.name, arabic: '', description: '', hadithCount: book.available }}
                  size="md"
                />
              </div>
            </div>
          ))}
          {/* 10th Card: Al-Qur'an */}
          <div className="col-span-1 flex">
            <div className="w-full h-full">
              <ThemeCard
                theme={{ slug: 'quran', title: 'Al-Qur\'an', arabic: 'القرآن الكريم', description: 'Kitab suci Al-Qur\'an Al-Karim', hadithCount: 6236 }}
                size="md"
              />
            </div>
          </div>
        </div>

        {/* Bottom ornament line */}
        <div className="flex items-center justify-center mt-16 gap-4" aria-hidden="true">
          <div className="flex-1 h-px bg-[linear-gradient(to_right,transparent,#D48C46/20)]" />
          <span className="font-neirizi text-[#D48C46]/30 text-lg">✦</span>
          <div className="flex-1 h-px bg-[linear-gradient(to_left,transparent,#D48C46/20)]" />
        </div>
      </div>
    </section>
  )
}
