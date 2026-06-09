import Link from 'next/link'
import { CardList } from '../pages/components/CardList'
import { DalilEntry } from '../pages/types'

// Mapping tema ke beberapa sumber hadits dan ayat Quran
// book: id kitab hadits | range: nomor hadits yang diambil | quran: [surah, ayat]
const themesData = [
  {
    id: 'akhlak',
    title: 'Akhlak & Karakter',
    desc: 'Adab, akhlak mulia, dan pembentukan karakter',
    book: 'bukhari', range: '1-3',
    quranRefs: [{ surah: 68, ayat: 4 }, { surah: 31, ayat: 18 }],
    keywords: ['Adab', 'Akhlak Mulia', 'Karakter'],
  },
  {
    id: 'keluarga',
    title: 'Keluarga',
    desc: 'Hak dan kewajiban dalam keluarga, parenting',
    book: 'muslim', range: '20-22',
    quranRefs: [{ surah: 4, ayat: 36 }, { surah: 2, ayat: 233 }],
    keywords: ['Orang Tua', 'Anak', 'Suami Istri'],
  },
  {
    id: 'ibadah',
    title: 'Ibadah',
    desc: 'Shalat, puasa, zakat, haji, dan ibadah lainnya',
    book: 'abu-daud', range: '400-403',
    quranRefs: [{ surah: 2, ayat: 43 }, { surah: 29, ayat: 45 }],
    keywords: ['Shalat', 'Puasa', 'Zakat'],
  },
  {
    id: 'ilmu',
    title: 'Ilmu & Pendidikan',
    desc: 'Keutamaan menuntut ilmu dan mengajarkannya',
    book: 'tirmidzi', range: '60-62',
    quranRefs: [{ surah: 96, ayat: 1 }, { surah: 20, ayat: 114 }],
    keywords: ['Ilmu', 'Mengajar', 'Ulama'],
  },
  {
    id: 'muamalah',
    title: 'Muamalah & Ekonomi',
    desc: 'Jual beli, utang piutang, kerja, dan rezeki',
    book: 'nasai', range: '200-202',
    quranRefs: [{ surah: 2, ayat: 275 }, { surah: 62, ayat: 10 }],
    keywords: ['Jual Beli', 'Rezeki', 'Amanah'],
  },
  {
    id: 'kesehatan',
    title: 'Kesehatan & Kebersihan',
    desc: 'Menjaga tubuh, kebersihan, dan pola makan',
    book: 'ibnu-majah', range: '30-32',
    quranRefs: [{ surah: 7, ayat: 31 }, { surah: 5, ayat: 6 }],
    keywords: ['Thaharah', 'Pola Makan', 'Kesehatan'],
  },
  {
    id: 'kepemimpinan',
    title: 'Kepemimpinan',
    desc: 'Tanggung jawab pemimpin, keadilan, dan amanah',
    book: 'ahmad', range: '50-52',
    quranRefs: [{ surah: 4, ayat: 58 }, { surah: 38, ayat: 26 }],
    keywords: ['Keadilan', 'Amanah', 'Pemimpin'],
  },
  {
    id: 'lingkungan',
    title: 'Lingkungan & Alam',
    desc: 'Menjaga bumi, tanaman, dan hewan',
    book: 'malik', range: '10-12',
    quranRefs: [{ surah: 7, ayat: 56 }, { surah: 55, ayat: 7 }],
    keywords: ['Tanaman', 'Hewan', 'Bumi'],
  },
  {
    id: 'doa-taubat',
    title: 'Doa & Taubat',
    desc: 'Adab berdoa, dzikir, dan pintu taubat',
    book: 'darimi', range: '60-62',
    quranRefs: [{ surah: 2, ayat: 186 }, { surah: 39, ayat: 53 }],
    keywords: ['Dzikir', 'Taubat', 'Doa'],
  },
  {
    id: 'persaudaraan',
    title: 'Persaudaraan & Sosial',
    desc: 'Ukhuwah, tolong-menolong, dan hak sesama',
    book: 'bukhari', range: '10-12',
    quranRefs: [{ surah: 49, ayat: 10 }, { surah: 5, ayat: 2 }],
    keywords: ['Ukhuwah', 'Tolong-menolong', 'Hak Sesama'],
  },
  {
    id: 'sabar',
    title: 'Sabar & Syukur',
    desc: 'Menghadapi ujian, bersyukur atas nikmat Allah',
    book: 'muslim', range: '70-72',
    quranRefs: [{ surah: 2, ayat: 155 }, { surah: 14, ayat: 7 }],
    keywords: ['Sabar', 'Syukur', 'Ujian'],
  },
  {
    id: 'kejujuran',
    title: 'Kejujuran & Amanah',
    desc: 'Menjaga lisan, jujur dalam ucapan dan perbuatan',
    book: 'tirmidzi', range: '100-102',
    quranRefs: [{ surah: 9, ayat: 119 }, { surah: 33, ayat: 70 }],
    keywords: ['Jujur', 'Amanah', 'Lisan'],
  },
  {
    id: 'tawadu',
    title: 'Tawadu & Sederhana',
    desc: 'Rendah hati, menghindari sombong dan berfoya-foya',
    book: 'abu-daud', range: '90-92',
    quranRefs: [{ surah: 25, ayat: 63 }, { surah: 17, ayat: 37 }],
    keywords: ['Tawadu', 'Rendah Hati', 'Sederhana'],
  },
  {
    id: 'jihad',
    title: 'Jihad & Perjuangan',
    desc: 'Sungguh-sungguh dalam beramal, berdakwah, dan menegakkan kebenaran',
    book: 'nasai', range: '50-52',
    quranRefs: [{ surah: 22, ayat: 78 }, { surah: 61, ayat: 11 }],
    keywords: ['Ijtihad', 'Dakwah', 'Kebenaran'],
  },
  {
    id: 'sedekah',
    title: 'Sedekah & Infak',
    desc: 'Keutamaan memberi, berbagi, dan menolong sesama',
    book: 'bukhari', range: '25-27',
    quranRefs: [{ surah: 2, ayat: 261 }, { surah: 3, ayat: 92 }],
    keywords: ['Sedekah', 'Infak', 'Zakat'],
  },
];

async function fetchHadiths(baseUrl: string, book: string, range: string) {
  try {
    const res = await fetch(`${baseUrl}/api/hadits?id=${book}&range=${range}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.hadiths ?? [];
  } catch {
    return [];
  }
}

async function fetchQuranAyat(baseUrl: string, surah: number, ayat: number): Promise<DalilEntry | null> {
  try {
    const res = await fetch(`${baseUrl}/api/quran?endpoint=/quran/ayat/${surah}/${ayat}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    const json = await res.json();
    // API myQuran v2 mengembalikan: { data: [ { arab, text, ... } ], info: { surat: { nama: { id } } } }
    const ayatData = Array.isArray(json.data) ? json.data[0] : json.data;
    if (!ayatData) return null;
    const surahName = json.info?.surat?.nama?.id ?? `Surah ${surah}`;
    return {
      arabic: ayatData.arab ?? '',
      translation: ayatData.text ?? '',
      sourceInfo: `QS. ${surahName} : ${ayat}`,
      type: 'quran',
    };
  } catch {
    return null;
  }
}

export default async function DalilPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const dalils = await Promise.all(themesData.map(async (theme) => {
    // Fetch hadits
    const hadiths = await fetchHadiths(baseUrl, theme.book, theme.range);
    const bookName = hadiths.length > 0 ? `HR. ${theme.book.charAt(0).toUpperCase()}${theme.book.slice(1).replace('-', ' ')}` : '';

    const hadithDalils: DalilEntry[] = hadiths.slice(0, 2).map((h: any) => ({
      arabic: h.arab ?? '',
      translation: h.id ?? '',
      sourceInfo: `${bookName} No. ${h.number}`,
      type: 'hadith' as const,
    }));

    // Fetch ayat Quran secara paralel
    const quranDalils = (await Promise.all(
      (theme.quranRefs ?? []).map(({ surah, ayat }) => fetchQuranAyat(baseUrl, surah, ayat))
    )).filter((d): d is DalilEntry => d !== null);

    const allDalils: DalilEntry[] = [...hadithDalils, ...quranDalils];
    const firstDalil = allDalils[0];

    return {
      id: theme.id,
      kategori: theme.title,
      keterangan: theme.desc,
      jumlah: allDalils.length,
      arabic: firstDalil?.arabic ?? '',
      translation: firstDalil?.translation ?? '',
      sourceInfo: firstDalil?.sourceInfo ?? '',
      keywords: theme.keywords,
      dalils: allDalils,
    };
  }));

  return (
    <div className="min-h-screen bg-[#0F2027] text-[#F2EBD9] py-24">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <Link href="/" className="inline-flex items-center text-[#7A8F96] hover:text-[#C9A84C] transition-colors mb-10 text-sm tracking-widest uppercase gap-2">
          <span>&larr;</span> Kembali ke Beranda
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-3 border-b border-[#C9A84C]/18 pb-10">
          <div>
            <span className="block text-[0.68rem] font-semibold tracking-[4.5px] uppercase text-[#C9A84C] mb-3">Karakter Luhur</span>
            <h1 className="font-cormorant text-[clamp(2.5rem,5vw,4rem)] font-normal leading-[1.1] text-[#F2EBD9]">
              Dalil-dalil
              <br />
              Pembinaan
            </h1>
          </div>
          <p className="text-[1rem] lg:text-xl font-light font-neirizi  text-[#7A8F96] max-w-full md:max-w-[400px] md:text-right leading-[1.7]">
            Kumpulan dalil dari Al-Quran dan Hadits menjadi pijakan karakter luhur dan pembinaan generasi penerus umat Islam
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
          {/* Navigasi Tema (Horizontal Scroll di Mobile, Sidebar di Desktop) */}
          <aside className="w-full lg:w-[240px] shrink-0 relative z-40">
            <div className="sticky top-0 lg:top-28 pt-4 lg:pt-0 -mx-5 px-5 lg:mx-0 lg:px-0 bg-[#0F2027]/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none lg:max-h-[calc(100vh-140px)] overflow-x-auto lg:overflow-y-auto lg:pr-4 scrollbar-none lg:scrollbar-thin lg:scrollbar-thumb-[#C9A84C]/20 lg:scrollbar-track-transparent pb-4 border-b border-[#C9A84C]/10 lg:border-b-0">
              <h4 className="hidden lg:block text-[#C9A84C] font-semibold text-[0.65rem] tracking-[3px] uppercase mb-6">
                Daftar Tema
              </h4>
              <nav className="flex flex-row lg:flex-col gap-2 lg:gap-1.5 w-max lg:w-auto">
                {dalils.map((dalil) => (
                  <Link 
                    key={`nav-${dalil.id}`} 
                    href={`#tema-${dalil.id}`}
                    className="text-[0.8rem] lg:text-[0.85rem] text-[#7A8F96] hover:text-[#F2EBD9] hover:bg-[#1E3A47] bg-[#182E38] lg:bg-transparent border border-[#C9A84C]/20 lg:border-transparent px-4 py-1.5 lg:px-3 lg:py-2 rounded-full lg:rounded-md transition-all whitespace-nowrap lg:truncate shadow-sm lg:shadow-none"
                  >
                    {dalil.kategori}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Area Konten Utama */}
          <div className="flex-1 flex flex-col gap-8">
            {dalils.map((dalil) => (
              <div key={dalil.id} id={`tema-${dalil.id}`} className="scroll-mt-28">
                <CardList 
                  theme={{
                    slug: `dalil/${dalil.id}`,
                    title: dalil.kategori,
                    arabic: dalil.arabic,
                    description: dalil.keterangan,
                    hadithCount: dalil.jumlah,
                    translation: dalil.translation,
                    sourceInfo: dalil.sourceInfo,
                    keywords: dalil.keywords,
                    dalils: dalil.dalils,
                  }} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
