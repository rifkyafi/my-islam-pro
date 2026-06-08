// Removed unused import
import { ThemeCard } from './ThemeCard'

export async function ThemesSection() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  let books = [];
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
    <section id="tema" className="py-24">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-3">
          <div>
            <span className="block text-[0.68rem] font-semibold tracking-[4.5px] uppercase text-[#C9A84C] mb-3">Navigasi Kitab</span>
            <h2 className="font-cormorant text-[clamp(1.875rem,3vw,2.625rem)] font-normal leading-[1.15] text-[#F2EBD9]">
              Pilih Kitab
              <br />
              Hadis
            </h2>
          </div>
          <p className="text-[0.875rem] font-light text-[#7A8F96] max-w-full md:max-w-[260px] md:text-right leading-[1.7]">
            Setiap kitab menghimpun ribuan hadis sahih sebagai rujukan utama umat Islam
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 p-[1px] bg-[#C9A84C]/18 border border-[#C9A84C]/18">
          {books.map((book: any) => (
            <ThemeCard 
              key={book.id} 
              theme={{
                slug: book.id,
                title: book.name,
                arabic: '',
                description: `Kumpulan hadis dari ${book.name}`,
                hadithCount: book.available
              }} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}
