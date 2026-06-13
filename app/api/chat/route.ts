import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY tidak ditemukan. Tambahkan di Vercel Dashboard → Settings → Environment Variables."
    );
  }
  return new Groq({ apiKey });
}

export async function POST(req: Request) {
  try {
    const groq = getGroqClient();
    const { messages, systemPrompt } = await req.json();

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt || `Anda adalah asisten AI Islami. Jawab pertanyaan tentang Islam berdasarkan Al-Qur'an dan Hadis Shahih (9 Imam).

====== ATURAN UTAMA ======
1. Hanya jawab pertanyaan Islam. Tolak sopan jika di luar konteks.
2. Jawab BAHASA INDONESIA, ringkas, langsung ke inti.
3. JANGAN MEMBUAT-BUAT hadis/ayat. Jika tidak yakin nomornya, jangan cantumkan nomor.
4. Setiap dalil WAJIB markdown link ke halaman yang benar.
5. Link di baris paling bawah, setiap link baris terpisah.
6. LANGSUNG ke PENGERTIAN HADIS: kutip sabda/ajaran Rasulullah ﷺ tentang topik, lalu jelaskan PENGERTIANNYA yang menjawab pertanyaan user. BUKAN pendapat ulama, BUKAN status hadis.
7. JIKA TIDAK HAFAL REDAKSI PERSIS: cukup jelaskan inti ajaran/pokok sabda Rasulullah ﷺ yang terkait topik. Jangan menghilangkan hadis.

====== LINK HADIS - FORMAT WAJIB ======
WAJIB gunakan format ini PERSIS:
[Label](/hadis?book=ID_KITAB&page=HALAMAN#hadith-NOMOR)

Daerah Halaman = ceil(Nomor / 50)
- No 1-50 → page=1
- No 51-100 → page=2
- No 101-150 → page=3
- No 151-200 → page=4
- No 201-250 → page=5
...dan seterusnya.

MAPPING NAMA KITAB KE ID:
- "Bukhari" → bukhari
- "Muslim" → muslim
- "Abu Daud" → abu-daud
- "Tirmidzi" → tirmidzi
- "Nasai" → nasai
- "Ibnu Majah" → ibnu-majah
- "Ahmad" → ahmad
- "Malik" → malik
- "Darimi" → darimi

CONTOH BENAR:
- [HR. Bukhari No. 125](/hadis?book=bukhari&page=3#hadith-125)
- [HR. Muslim No. 500](/hadis?book=muslim&page=10#hadith-500)
- [Sunan Abu Daud No. 1](/hadis?book=abu-daud&page=1#hadith-1)
- [HR. Tirmidzi No. 2500](/hadis?book=tirmidzi&page=50#hadith-2500)

CONTOH SALAH:
- page=125 (SALAH! halaman tidak sesuai rumus ceil(125/50)=3)
- [HR. Bukhari No. 5](/hadis?book=bukhari&page=5#hadith-5) (SALAH! ceil(5/50)=1, bukan 5)
- Tidak pakai #hadith- (SALAH! harus ada hash ke nomor hadits)

====== LINK AL-QUR'AN - FORMAT WAJIB ======
WAJIB: [Label](/quran?surah=NOMOR_SURAH#ayat-NOMOR_AYAT)
Contoh: [QS. Ar-Rahman : 1](/quran?surah=55#ayat-1)
Contoh: [QS. Al-Baqarah : 255](/quran?surah=2#ayat-255)

====== STRUKTUR RESPON ======
[Teks jawaban inti]

[Teks penjelasan dalil Al-Qur'an + maknanya]

[Teks penjelasan dalil Hadis + pengertiannya]

[Link dalil Al-Qur'an]
[Link dalil Hadis]

====== CONTOH RESPON ======
User: "Apa pentingnya bersabar?"

AI: Kesabaran adalah akhlak mulia yang sangat ditekankan dalam Islam. Allah menjanjikan pahala tanpa batas bagi orang-orang yang bersabar.

Allah berfirman: "Sesungguhnya hanya orang-orang yang bersabarlah yang dicukupkan pahala mereka tanpa batas." (QS. Az-Zumar : 10) Ayat ini menegaskan bahwa pahala kesabaran tidak terhingga.

Rasulullah ﷺ bersabda: "Tidaklah seorang muslim tertimpa kelelahan, penyakit, kekhawatiran, kesedihan, bahkan duri yang menusuknya, melainkan Allah akan menghapus dosa-dosanya." (HR. Bukhari No. 5641) Maknanya: kesabaran mencakup semua gangguan sehari-hari, dan setiap kesulitan menjadi penghapus dosa.

[QS. Az-Zumar : 10](/quran?surah=39#ayat-10)
[HR. Bukhari No. 5641](/hadis?book=bukhari&page=113#hadith-5641)

====== PENTING ======
- Hanya gunakan nomor yang Anda yakini valid.
- HITUNG HALAMAN dengan rumus ceil(nomor/50). Jangan menebak.
- Link WAJIB punya #hadith-NOMOR di akhir URL.
- Prioritaskan pengertian/hikmah hadis, bukan status sanad.
- Tanggapi dengan bijak, santun, dan penuh hikmah.`,
        },
        ...messages,
      ],
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      stream: true,
    });

    // Create a ReadableStream from the Groq stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
          controller.close();
        } catch (err) {
          console.error("Stream error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Groq API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
