import Link from 'next/link'
import { ThemeCard } from '../pages/components/ThemeCard'

export default function DalilPage() {
  const dalils = [
    {
      id: "3-sukses",
      kategori: "3 Sukses",
      jumlah: 3,
      keterangan: "Target pembinaan generasi penerus",
      items: [
        { no: 1, karakter: "Alim & Faqih" },
        { no: 2, karakter: "Akhlaqul Kharimah" },
        { no: 3, karakter: "Mandiri" },
      ],
    },
    {
      id: "6-thobiat-luhur",
      kategori: "6 Thobiat Luhur",
      jumlah: 6,
      keterangan: "Karakter mulia umat Islam",
      items: [
        { no: 4, karakter: "Rukun" },
        { no: 5, karakter: "Kompak" },
        { no: 6, karakter: "Kerjasama yang baik" },
        { no: 7, karakter: "Jujur" },
        { no: 8, karakter: "Amanah" },
        { no: 9, karakter: "Mujhid muzhid" },
      ],
    },
    {
      id: "4-tali-keimanan",
      kategori: "4 Tali Keimanan",
      jumlah: 4,
      keterangan: "Penguat tali keimanan",
      items: [
        { no: 10, karakter: "Bersyukur" },
        { no: 11, karakter: "Mempersungguh" },
        { no: 12, karakter: "Mengagungkan" },
        { no: 13, karakter: "Berdo'a" },
      ],
    },
    {
      id: "3-prinsip-kerja-sama",
      kategori: "3 Prinsip Kerja Sama",
      jumlah: 3,
      keterangan: "Prinsip dalam bekerjasama",
      items: [
        { no: 14, karakter: "Benar" },
        { no: 15, karakter: "Kurup" },
        { no: 16, karakter: "Janji" },
      ],
    },
    {
      id: "4-maqodirulloh",
      kategori: "4 Maqodirulloh",
      jumlah: 4,
      keterangan: "Bila diberi qodar",
      items: [
        { no: 17, karakter: "Nikmat, supaya bersyukur" },
        { no: 18, karakter: "Musibah, supaya istirja" },
        { no: 19, karakter: "Qodar cobaan, supaya sabar" },
        { no: 20, karakter: "Qodar salah, supaya bertaubat" },
      ],
    },
    {
      id: "4-roda-berputar",
      kategori: "4 Roda Berputar",
      jumlah: 4,
      keterangan: "Saling membantu dalam jamaah",
      items: [
        { no: 21, karakter: "Yang kuat, membantu yang lemah" },
        { no: 22, karakter: "Yang bisa, membantu yang tidak bisa" },
        { no: 23, karakter: "Yang ingat, mengingatkan yang lupa" },
        { no: 24, karakter: "Yang salah, dinasehati agar mau bertaubat" },
      ],
    },
    {
      id: "5-syarat-kerukunan",
      kategori: "5 Syarat Kerukunan & Kekompakan",
      jumlah: 5,
      keterangan: "Syarat mutlak kerukunan",
      items: [
        { no: 25, karakter: "Bicara yang Baik" },
        { no: 26, karakter: "Jujur, bisa dipercaya, & mempercayai" },
        { no: 27, karakter: "Sabar Keporo Ngalah" },
        { no: 28, karakter: "Tidak merusak sesama (diri, harta, hak azasi dan kehormatan)" },
        { no: 29, karakter: "Saling memperhatikan dan menjaga perasaan" },
      ],
    },
  ];

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
          <p className="text-[1rem] font-light text-[#7A8F96] max-w-full md:max-w-[400px] md:text-right leading-[1.7]">
            Kumpulan dalil karakter luhur dan prinsip dasar pembinaan generasi penerus umat Islam
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {dalils.map((dalil) => (
            <ThemeCard 
              key={dalil.id} 
              theme={{
                slug: `dalil/${dalil.id}`,
                title: dalil.kategori,
                arabic: '',
                description: dalil.keterangan || `Kumpulan dalil ${dalil.kategori}`,
                hadithCount: dalil.jumlah
              }} 
            />
          ))}
        </div>
      </div>
    </div>
  )
}
