import { NextResponse } from "next/server";
import https from "https";

const BOOKS = [
  { id: "abu-daud", name: "Abu Dawud", max: 4419 },
  { id: "ahmad", name: "Ahmad", max: 4305 },
  { id: "bukhari", name: "Bukhari", max: 6638 },
  { id: "darimi", name: "Darimi", max: 2949 },
  { id: "ibnu-majah", name: "Ibnu Majah", max: 4285 },
  { id: "malik", name: "Malik", max: 1587 },
  { id: "muslim", name: "Muslim", max: 4930 },
  { id: "nasai", name: "Nasa'i", max: 5364 },
  { id: "tirmidzi", name: "Tirmidzi", max: 3625 },
];

// ── Hadith Index ────────────────────────────────────────────────────
type IndexedHadith = {
  number: number;
  arab: string;
  id: string;
  bookId: string;
  rangeStart: number;
};

const hadithIndex: IndexedHadith[] = [];
let indexBuilt = false;
let indexBuilding = false;

// ── Quran Surah Index ───────────────────────────────────────────────
type IndexedSurah = {
  nomor: number;
  nama: string;         // Arabic script
  namaLatin: string;
  arti: string;
  jumlahAyat: number;
  tempatTurun: string;
  deskripsi: string;
};

let surahIndex: IndexedSurah[] = [];
let surahIndexBuilt = false;

// ── HTTP helpers ────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fetchWithHttps(url: string, timeoutMs = 10000): Promise<{ status: number | undefined; data: any }> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch (e) { reject(e); }
      });
    });
    req.setTimeout(timeoutMs, () => { req.destroy(); reject(new Error("timeout")); });
    req.on("error", reject);
  });
}

async function fetchRange(baseUrl: string, bookId: string, start: number, end: number): Promise<IndexedHadith[]> {
  try {
    const res = await fetchWithHttps(`${baseUrl}/books/${bookId}?range=${start}-${end}`);
    if (res.status !== 200) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hadiths: any[] = res.data?.data?.hadiths ?? res.data?.hadiths ?? [];
    return hadiths.map((h, i) => ({
      number: h.number,
      arab: h.arab ?? "",
      id: h.id ?? "",
      bookId,
      rangeStart: start + i,
    }));
  } catch {
    return [];
  }
}

// Build hadith index (sampled)
async function buildIndex(baseUrl: string) {
  if (indexBuilt || indexBuilding) return;
  indexBuilding = true;

  const CHUNK = 20;
  const POSITIONS = 6;

  for (const book of BOOKS) {
    const step = Math.floor(book.max / (POSITIONS + 1));
    for (let i = 0; i < POSITIONS; i++) {
      const start = Math.max(1, step * (i + 1));
      const end = Math.min(book.max, start + CHUNK - 1);
      const hadiths = await fetchRange(baseUrl, book.id, start, end);
      hadithIndex.push(...hadiths);
      await new Promise(r => setTimeout(r, 300));
    }
    await new Promise(r => setTimeout(r, 800));
  }

  indexBuilt = true;
  indexBuilding = false;
}

// Build Quran surah index from equran.id API
async function buildSurahIndex() {
  if (surahIndexBuilt) return;
  try {
    const res = await fetchWithHttps("https://equran.id/api/v2/surat", 15000);
    if (res.status === 200 && Array.isArray(res.data?.data)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      surahIndex = res.data.data.map((s: any) => ({
        nomor: s.nomor,
        nama: s.nama,
        namaLatin: s.namaLatin,
        arti: s.arti,
        jumlahAyat: s.jumlahAyat,
        tempatTurun: s.tempatTurun,
        deskripsi: s.deskripsi ?? "",
      }));
      surahIndexBuilt = true;
    }
  } catch {
    // silently fail — search will just not return quran results
  }
}

// ── Context Synonyms & Dictionary ───────────────────────────────────
const CONTEXT_SYNONYMS: Record<string, string[]> = {
  "shalat": ["shalat", "sholat", "sembahyang", "sujud", "salat", "rukuk", "ibadah"],
  "sholat": ["shalat", "sholat", "sembahyang", "sujud", "salat", "rukuk", "ibadah"],
  "puasa": ["puasa", "shaum", "saum", "ramadhan", "ramadan", "lapar", "ibadah"],
  "shaum": ["puasa", "shaum", "saum", "ramadhan", "ramadan"],
  "sedekah": ["sedekah", "infak", "infaq", "zakat", "shodaqoh", "dermawan", "berbagi", "harta"],
  "infak": ["sedekah", "infak", "infaq", "zakat", "shodaqoh", "berbagi", "harta"],
  "infaq": ["sedekah", "infak", "infaq", "zakat", "shodaqoh", "berbagi", "harta"],
  "zakat": ["sedekah", "infak", "infaq", "zakat", "shodaqoh", "harta", "fitrah"],
  "kiamat": ["kiamat", "akhirat", "hari akhir", "mahsyar", "kebangkitan", "terompet", "mati", "kematian"],
  "neraka": ["neraka", "jahanam", "siksa", "api", "adab", "dosa"],
  "surga": ["surga", "jannah", "nikmat", "pahala", "kekal", "taman"],
  "orang tua": ["orang tua", "ibu", "bapak", "ayah", "walidain", "berbakti"],
  "ibu": ["orang tua", "ibu", "bapak", "ayah", "walidain", "melahirkan"],
  "ayah": ["orang tua", "ibu", "bapak", "ayah", "walidain"],
  "bapak": ["orang tua", "ibu", "bapak", "ayah", "walidain"],
  "taubat": ["taubat", "ampunan", "istighfar", "tobat", "maaf", "sesal", "ampun"],
  "tobat": ["taubat", "ampunan", "istighfar", "tobat", "maaf", "sesal", "ampun"],
  "ilmu": ["ilmu", "belajar", "membaca", "pengetahuan", "paham", "pengajaran", "ulama"],
  "belajar": ["ilmu", "belajar", "membaca", "pengetahuan", "paham"],
  "nikah": ["nikah", "kawin", "pernikahan", "suami", "istri", "keluarga", "jodoh", "pasangan"],
  "sabar": ["sabar", "tabah", "sabr", "cobaan", "ujian", "musibah"],
  "syukur": ["syukur", "terima kasih", "nikmat", "puji", "bersyukur"],
  "jujur": ["jujur", "benar", "amanah", "dusta", "bohong", "lisan", "ucapan"],
  "syirik": ["syirik", "menyekutukan", "tauhid", "esa", "tuhan"],
  "wudhu": ["wudhu", "bersuci", "thaharah", "suci", "air", "bersihkan"],
  "hijrah": ["hijrah", "pindah", "bersungguh-sungguh"],
  "jihad": ["jihad", "perjuangan", "dakwah", "kebenaran", "sungguh"],
  "quran": ["quran", "kitab", "bacaan", "kalam", "wahyu"],
  "doa": ["doa", "memohon", "meminta", "dzikir", "wirid"]
};

// ── Curated Key Quran Verses ─────────────────────────────────────────
type KeyVerse = {
  surahNomor: number;
  surahName: string;
  ayatNomor: number;
  arab: string;
  translation: string;
  keywords: string[];
};

const KEY_VERSES: KeyVerse[] = [
  {
    surahNomor: 2,
    surahName: "Al-Baqarah",
    ayatNomor: 43,
    arab: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ",
    translation: "Dan laksanakanlah salat, tunaikanlah zakat, dan rukuklah beserta orang-orang yang rukuk.",
    keywords: ["shalat", "sholat", "zakat", "rukuk", "ibadah"]
  },
  {
    surahNomor: 2,
    surahName: "Al-Baqarah",
    ayatNomor: 153,
    arab: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    translation: "Wahai orang-orang yang beriman! Mohonlah pertolongan (kepada Allah) dengan sabar dan salat. Sungguh, Allah beserta orang-orang yang sabar.",
    keywords: ["sabar", "shalat", "sholat", "sabr", "tabah", "ibadah", "penolong"]
  },
  {
    surahNomor: 2,
    surahName: "Al-Baqarah",
    ayatNomor: 155,
    arab: "وَلَنَبْلُوَنَّكُمْ بِشَيْءٍ مِنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِنَ الْأَمْوَالِ وَالْأَنْفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ",
    translation: "Dan Kami pasti akan menguji kamu dengan sedikit ketakutan, kelaparan, kekurangan harta, jiwa, dan buah-buahan. Dan sampaikanlah kabar gembira kepada orang-orang yang sabar.",
    keywords: ["sabar", "ujian", "cobaan", "takut", "kelaparan", "harta", "jiwa", "musibah"]
  },
  {
    surahNomor: 2,
    surahName: "Al-Baqarah",
    ayatNomor: 183,
    arab: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِنْ قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
    translation: "Wahai orang-orang yang beriman! Diwajibkan atas kamu berpuasa sebagaimana diwajibkan atas orang-orang sebelum kamu agar kamu bertakwa.",
    keywords: ["puasa", "shaum", "saum", "ramadhan", "ramadan", "wajib", "takwa"]
  },
  {
    surahNomor: 2,
    surahName: "Al-Baqarah",
    ayatNomor: 186,
    arab: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    translation: "Dan apabila hamba-hamba-Ku bertanya kepadamu (Muhammad) tentang Aku, maka sesungguhnya Aku dekat. Aku kabulkan permohonan orang yang berdoa apabila dia berdoa kepada-Ku.",
    keywords: ["doa", "memohon", "meminta", "kabul", "dekat", "hamba"]
  },
  {
    surahNomor: 2,
    surahName: "Al-Baqarah",
    ayatNomor: 261,
    arab: "مَثَلُ الَّذِينَ يُنْفِقُونَ أَمْوَالَهُمْ فِي سَبِILِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنْبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنْبُلَةٍ مِائَةُ حَبَّةٍ",
    translation: "Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai, pada setiap tangkai ada seratus biji.",
    keywords: ["sedekah", "infak", "infaq", "harta", "pemberian", "pahala", "kebaikan"]
  },
  {
    surahNomor: 2,
    surahName: "Al-Baqarah",
    ayatNomor: 275,
    arab: "وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا",
    translation: "Padahal Allah telah menghalalkan jual beli dan mengharamkan riba.",
    keywords: ["riba", "jual beli", "dagang", "usaha", "muamalah", "halal", "haram"]
  },
  {
    surahNomor: 3,
    surahName: "Ali 'Imran",
    ayatNomor: 18,
    arab: "شَهِدَ اللَّهُ أَنَّهُ لَا إِلَٰهَ إِلَّا هُوَ وَالْمَلَائِكَةُ وَأُولُو الْعِلْمِ قَائِمًا بِالْقِسْطِ",
    translation: "Allah menyatakan bahwa tidak ada tuhan selain Dia; (demikian pula) para malaikat dan orang-orang berilmu yang menegakkan keadilan.",
    keywords: ["syahadat", "tauhid", "esa", "tuhan", "ilmu", "keadilan", "iman"]
  },
  {
    surahNomor: 3,
    surahName: "Ali 'Imran",
    ayatNomor: 103,
    arab: "وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا",
    translation: "Dan berpegangteguhlah kamu semuanya pada tali (agama) Allah, dan janganlah kamu bercerai berai.",
    keywords: ["kompak", "bersatu", "ukhuwah", "persaudaraan", "bercerai berai", "tali allah"]
  },
  {
    surahNomor: 4,
    surahName: "An-Nisa'",
    ayatNomor: 29,
    arab: "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَأْكُلُوا أَمْوَالَكُمْ بَيْنَكُمْ بِالْبَاطِلِ إِلَّا أَنْ تَكُونَ تِجَارَةً عَنْ تَرَاضٍ مِنْكُمْ",
    translation: "Wahai orang-orang yang beriman! Janganlah kamu saling memakan harta sesamamu dengan jalan yang batil (tidak benar), kecuali dalam perdagangan atas dasar suka sama suka di antara kamu.",
    keywords: ["harta", "dagang", "perdagangan", "jual beli", "batil", "muamalah"]
  },
  {
    surahNomor: 4,
    surahName: "An-Nisa'",
    ayatNomor: 36,
    arab: "وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا ۖ وَبِالْوَالِدَيْنِ إِحْسَانًا وَبِذِي الْقُرْبَىٰ وَالْيَتَامَىٰ وَالْمَسَاكِينِ",
    translation: "Dan sembahlah Allah dan janganlah kamu mempersekutukan-Nya dengan sesuatu apa pun. Dan berbuat baiklah kepada kedua orang tua, karib kerabat, anak-anak yatim, dan orang-orang miskin.",
    keywords: ["orang tua", "ibu", "ayah", "anak yatim", "miskin", "kerabat", "syirik", "tauhid", "berbuat baik", "walidain"]
  },
  {
    surahNomor: 4,
    surahName: "An-Nisa'",
    ayatNomor: 58,
    arab: "إِنَّ اللَّهَ يَأْمُرُكُمْ أَنْ تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا وَإِذَا حَكَمْتُمْ بَيْنَ النَّاسِ أَنْ تَحَكُمُوا بِالْعَدْلِ",
    translation: "Sungguh, Allah menyuruhmu menyampaikan amanat kepada yang berhak menerimanya, dan apabila kamu menetapkan hukum di antara manusia hendaknya kamu menetapkannya dengan adil.",
    keywords: ["amanah", "adil", "hukum", "pemimpin", "kepemimpinan", "tanggung jawab"]
  },
  {
    surahNomor: 4,
    surahName: "An-Nisa'",
    ayatNomor: 136,
    arab: "يَا أَيُّهَا الَّذِينَ آمَنُوا آمِنُوا بِاللَّهِ وَرَسُولِهِ وَالْكِتَابِ الَّذِي نَزَّلَ عَلَىٰ رَسُولِهِ",
    translation: "Wahai orang-orang yang beriman! Tetaplah beriman kepada Allah dan Rasul-Nya dan kepada Kitab (Al-Qur'an) yang diturunkan kepada Rasul-Nya.",
    keywords: ["iman", "kitab", "rasul", "malaikat", "kiamat", "percaya"]
  },
  {
    surahNomor: 5,
    surahName: "Al-Ma'idah",
    ayatNomor: 2,
    arab: "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ ۖ وَلَا تَعَاوَنُوا عَلَى الْإِثْمِ وَالْعُدْوَانِ",
    translation: "Dan tolong-menolonglah kamu dalam (mengerjakan) kebajikan dan takwa, dan jangan tolong-menolong dalam berbuat dosa dan permusuhan.",
    keywords: ["tolong-menolong", "kerjasama", "kebajikan", "takwa", "dosa", "permusuhan"]
  },
  {
    surahNomor: 5,
    surahName: "Al-Ma'idah",
    ayatNomor: 6,
    arab: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ",
    translation: "Wahai orang-orang yang beriman! Apabila kamu hendak melaksanakan salat, maka basuhlah wajahmu dan tanganmu sampai ke siku, dan sapulah kepalamu dan (basuh) kedua kakimu sampai kedua mata kaki.",
    keywords: ["wudhu", "bersuci", "suci", "air", "thaharah", "shalat", "sholat"]
  },
  {
    surahNomor: 17,
    surahName: "Al-Isra'",
    ayatNomor: 23,
    arab: "وَقَضَىٰ رَبُwكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا ۚ إِمَّا يَبْلُغَنَّ عِنْدَكَ الْكِبَرَ أَحَدُهُمَا أَوْ كِلَاهُمَا فَلَا تَقُلْ لَهُمَا أُفٍّ",
    translation: "Dan Tuhanmu telah memerintahkan agar kamu jangan menyembah selain Dia dan hendaklah berbuat baik kepada ibu bapakmu. Jika salah seorang di antara keduanya atau kedua-duanya sampai berusia lanjut dalam pemeliharaanmu, maka sekali-kali janganlah engkau mengatakan kepada keduanya perkataan 'ah'.",
    keywords: ["orang tua", "ibu", "ayah", "berbakti", "walidain", "bapak", "akhlak"]
  },
  {
    surahNomor: 17,
    surahName: "Al-Isra'",
    ayatNomor: 34,
    arab: "وَأَوْفُوا بِالْعَهْدِ ۖ إِنَّ الْعَهْدَ كَانَ مَسْئُولًا",
    translation: "Dan penuhilah janji, karena janji itu pasti diminta pertanggungjawabannya.",
    keywords: ["janji", "amanah", "jujur", "akhlak", "luhur"]
  },
  {
    surahNomor: 20,
    surahName: "Taha",
    ayatNomor: 114,
    arab: "وَقُلْ رَبِّ زِدْنِي عِلْمًا",
    translation: "Dan katakanlah, 'Ya Tuhanku, tambahkanlah ilmu kepadaku.'",
    keywords: ["ilmu", "belajar", "membaca", "doa", "pengetahuan"]
  },
  {
    surahNomor: 30,
    surahName: "Ar-Rum",
    ayatNomor: 21,
    arab: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً",
    translation: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
    keywords: ["nikah", "pernikahan", "keluarga", "jodoh", "suami", "istri", "kasih sayang", "cinta"]
  },
  {
    surahNomor: 31,
    surahName: "Luqman",
    ayatNomor: 17,
    arab: "يَا بُنَيَّ أَقِمِ الصَّلَاةَ وَأْمُرْ بِالْمَعْرُوفِ وَانْهَ عَنِ الْمُنْكَرِ وَاصْبِرْ عَلَىٰ مَا أَصَابَكَ",
    translation: "Wahai anakku! Laksanakanlah salat dan suruhlah (manusia) berbuat yang makruf dan cegahlah (mereka) dari yang mungkar dan bersabarlah terhadap apa yang menimpamu.",
    keywords: ["shalat", "sholat", "sabar", "makruf", "mungkar", "nasehat", "anak", "orang tua"]
  },
  {
    surahNomor: 39,
    surahName: "Az-Zumar",
    ayatNomor: 53,
    arab: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنْفُسِهِمْ لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
    translation: "Katakanlah, 'Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri! Janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya.'",
    keywords: ["taubat", "tobat", "ampunan", "dosa", "rahmat", "putus asa"]
  },
  {
    surahNomor: 49,
    surahName: "Al-Hujurat",
    ayatNomor: 10,
    arab: "إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ فَأَصْلِحُوا بَيْنَ أَخَوَيْكُمْ",
    translation: "Sesungguhnya orang-orang mukmin itu bersaudara, karena itu damaikanlah antara kedua saudaramu yang berselisih.",
    keywords: ["ukhuwah", "persaudaraan", "damai", "mukmin", "saudara"]
  },
  {
    surahNomor: 49,
    surahName: "Al-Hujurat",
    ayatNomor: 11,
    arab: "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا يَسْخَرْ قَوْمٌ مِنْ قَوْمٍ عَسَىٰ أَنْ يَكُونُوا خَيْرًا مِنْهُمْ",
    translation: "Wahai orang-orang yang beriman! Janganlah suatu kaum mengolok-olok kaum yang lain (karena) boleh jadi mereka (yang diperolok-olokkan) lebih baik dari mereka.",
    keywords: ["lisan", "olok-olok", "perasaan", "ghibah", "gosip", "akhlak", "menjaga perasaan"]
  },
  {
    surahNomor: 58,
    surahName: "Al-Mujadilah",
    ayatNomor: 11,
    arab: "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنْكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ",
    translation: "Niscaya Allah akan mengangkat (derajat) orang-orang yang beriman di antaramu dan orang-orang yang diberi ilmu pengetahuan beberapa derajat.",
    keywords: ["ilmu", "belajar", "derajat", "iman", "pendidikan"]
  },
  {
    surahNomor: 68,
    surahName: "Al-Qalam",
    ayatNomor: 4,
    arab: "وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ",
    translation: "Dan sesungguhnya engkau benar-benar berbudi pekerti yang agung.",
    keywords: ["akhlak", "mulia", "karakter", "budi pekerti", "rasul"]
  },
  {
    surahNomor: 96,
    surahName: "Al-'Alaq",
    ayatNomor: 1,
    arab: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    translation: "Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan.",
    keywords: ["membaca", "belajar", "ilmu", "wahyu", "pengetahuan"]
  },
  {
    surahNomor: 103,
    surahName: "Al-'Asr",
    ayatNomor: 1,
    arab: "وَالْعَصْرِ * إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ * إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
    translation: "Demi masa. Sungguh, manusia berada dalam kerugian, kecuali orang-orang yang beriman dan mengerjakan kebajikan serta saling menasihati untuk kebenaran dan saling menasihati untuk kesabaran.",
    keywords: ["sabar", "waktu", "benar", "nasehat", "iman", "amal saleh"]
  }
];

// Helper to expand query terms with context synonyms
function expandQueryWords(words: string[]): string[] {
  const expanded = new Set<string>();
  for (const w of words) {
    if (w.length < 2) continue;
    expanded.add(w);
    const lowercaseWord = w.toLowerCase();
    if (CONTEXT_SYNONYMS[lowercaseWord]) {
      for (const syn of CONTEXT_SYNONYMS[lowercaseWord]) {
        expanded.add(syn);
      }
    }
  }
  return Array.from(expanded);
}

// ── Generic scoring helper with weighted synonyms ──────────────────
function scoreText(text: string, originalWords: string[], expandedWords: string[], rawQuery: string): number {
  const normalizedText = text.toLowerCase();
  let score = 0;

  // Exact full query match
  if (normalizedText.includes(rawQuery)) {
    score += 50;
  }

  // Original query words match (weight = 15)
  for (const w of originalWords) {
    if (w.length < 2) continue;
    if (normalizedText.includes(w)) {
      score += 15;
    }
  }

  // Synonym/expanded words match (weight = 7)
  const synonymsOnly = expandedWords.filter(w => !originalWords.includes(w));
  for (const w of synonymsOnly) {
    if (w.length < 2) continue;
    if (normalizedText.includes(w)) {
      score += 7;
    }
  }

  // Multi-word hit boost
  const originalHits = originalWords.filter(w => w.length >= 2 && normalizedText.includes(w)).length;
  if (originalHits >= 2) {
    score += originalHits * 8;
  }

  return score;
}

// ── Hadith scoring ──────────────────────────────────────────────────
function scoreHadith(h: IndexedHadith, originalWords: string[], expandedWords: string[], rawQuery: string): number {
  const indonesianScore = scoreText(h.id, originalWords, expandedWords, rawQuery);
  
  let arabScore = 0;
  const arab = h.arab.toLowerCase();
  for (const w of originalWords) {
    if (w.length >= 2 && arab.includes(w)) {
      arabScore += 5;
    }
  }

  return indonesianScore + arabScore;
}

// ── Surah scoring ───────────────────────────────────────────────────
function scoreSurah(s: IndexedSurah, originalWords: string[], expandedWords: string[], rawQuery: string): number {
  const latin = s.namaLatin.toLowerCase();
  const arti = s.arti.toLowerCase();
  const desc = s.deskripsi.toLowerCase();
  const nomor = String(s.nomor);
  let score = 0;

  // Exact number match (surah number) -> highest priority
  if (nomor === rawQuery) score += 100;

  // Exact name match
  if (latin === rawQuery) score += 80;
  if (latin.includes(rawQuery)) score += 45;

  const nameScore = scoreText(latin, originalWords, expandedWords, rawQuery);
  const artiScore = scoreText(arti, originalWords, expandedWords, rawQuery);
  const descScore = scoreText(desc, originalWords, expandedWords, rawQuery);

  score += nameScore * 1.5 + artiScore * 1.2 + descScore * 0.8;

  return score;
}

// ── Key Verse scoring ───────────────────────────────────────────────
function scoreKeyVerse(v: KeyVerse, originalWords: string[], expandedWords: string[], rawQuery: string): number {
  const translationScore = scoreText(v.translation, originalWords, expandedWords, rawQuery);
  
  // Keyword scoring
  let keywordScore = 0;
  for (const kw of v.keywords) {
    const kwLower = kw.toLowerCase();
    if (rawQuery.includes(kwLower)) {
      keywordScore += 40;
    }
    for (const w of originalWords) {
      if (w.length >= 2 && kwLower.includes(w)) {
        keywordScore += 15;
      }
    }
  }

  return translationScore + keywordScore;
}

// ── Route handler ────────────────────────────────────────────────────
export async function GET(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_HADITS_API_URL;
  if (!baseUrl) {
    return NextResponse.json({ message: "Hadith API URL is not defined" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase().trim() ?? "";

  if (query.length < 2) return NextResponse.json({ results: [], quranResults: [], indexed: false });

  // Kick off index builds (fire-and-forget)
  if (!indexBuilt && !indexBuilding) buildIndex(baseUrl);
  if (!surahIndexBuilt) buildSurahIndex();

  const queryWords = query.split(/\s+/);
  const expandedWords = expandQueryWords(queryWords);

  // ── Hadith search ──
  let corpusToSearch = hadithIndex;
  if (!indexBuilt && corpusToSearch.length === 0) {
    const quickFetch = await fetchRange(baseUrl, "bukhari", 1, 50);
    corpusToSearch = quickFetch;
  }

  const scoredHadiths = corpusToSearch
    .map(h => ({ h, s: scoreHadith(h, queryWords, expandedWords, query) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 8);

  const hadithResults = scoredHadiths.map(({ h }) => ({
    type: "hadith" as const,
    number: h.number,
    arab: h.arab,
    id: h.id,
    bookId: h.bookId,
    bookName: BOOKS.find(b => b.id === h.bookId)?.name ?? h.bookId,
    rangeStart: h.rangeStart,
  }));

  // ── Quran search (Combine Surahs + Key Verses) ──
  const scoredSurahs = surahIndex
    .map(s => ({ s, score: scoreSurah(s, queryWords, expandedWords, query) }))
    .filter(x => x.score > 0);

  const scoredKeyVerses = KEY_VERSES
    .map(v => ({ v, score: scoreKeyVerse(v, queryWords, expandedWords, query) }))
    .filter(x => x.score > 0);

  // Map Surahs to QuranResults (keep score in separate tuple for sorting)
  interface QuranResultItem {
    type: "quran"; nomor: number; nama: string; namaLatin: string;
    arti: string; jumlahAyat: number; tempatTurun: string;
    ayatNomor?: number; ayatTeks?: string; ayatTerjemahan?: string;
  }
  const quranSurahResults: [number, QuranResultItem][] = scoredSurahs.map(({ s, score }) => ([
    score,
    { type: "quran", nomor: s.nomor, nama: s.nama, namaLatin: s.namaLatin, arti: s.arti, jumlahAyat: s.jumlahAyat, tempatTurun: s.tempatTurun },
  ]));

  // Map Verses to QuranResults (cross-referencing with surah metadata)
  const quranVerseResults: [number, QuranResultItem][] = scoredKeyVerses.map(({ v, score }) => {
    const sDetail = surahIndex.find(s => s.nomor === v.surahNomor);
    return [
      score + 10,
      { type: "quran", nomor: v.surahNomor, nama: sDetail?.nama ?? "", namaLatin: v.surahName, arti: sDetail?.arti ?? "", jumlahAyat: sDetail?.jumlahAyat ?? 0, tempatTurun: sDetail?.tempatTurun ?? "", ayatNomor: v.ayatNomor, ayatTeks: v.arab, ayatTerjemahan: v.translation },
    ];
  });

  // Combine and sort by score, then map to strip score
  const quranResults = [...quranSurahResults, ...quranVerseResults]
    .sort((a, b) => b[0] - a[0])
    .slice(0, 8)
    .map(([, result]) => result);

  return NextResponse.json({ results: hadithResults, quranResults, indexed: indexBuilt });
}
