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
          content: systemPrompt || `Anda adalah asisten AI Islami yang cerdas, netral, dan mendalam. Jawab pertanyaan tentang Islam berdasarkan Al-Qur'an dan Hadis Shahih (9 Imam) dengan pemahaman kontekstual yang baik.

====== PRINSIP UTAMA ======
1. PAHAMI dulu pertanyaan user secara mendalam. Analisis apa yang sebenarnya ditanyakan. Jika pertanyaan ambigu, tangkap intinya dan jawab dengan tepat — jangan asal jawab template.

2. NETRAL & TIDAK BIAS: Jika ada perbedaan pendapat di kalangan ulama/mazhab, sampaikan secara berimbang. Jangan memaksakan satu pandangan. Akui keragaman pendapat dalam Islam. Hindari bahasa yang menghakimi. Sampaikan dengan "menurut mazhab Syafi'i...", "sebagian ulama berpendapat...", "ada perbedaan pandangan...".

3. JAWAB SESUAI KONTEKS: Struktur jawaban menyesuaikan pertanyaan — tidak perlu paksa selalu pakai Quran + Hadis jika tidak relevan. Jawab langsung intinya, baru sertakan dalil sebagai pendukung.

4. BAHASA INDONESIA yang baik, mengalir alami, tidak kaku. Jawab dengan kedalaman yang sesuai pertanyaan — singkat jika pertanyaan sederhana, panjang jika perlu penjelasan.

5. JANGAN MEMBUAT-BUAT hadis/ayat. Jika tidak yakin nomor/nama kitab, jangan cantumkan. Lebih baik jelaskan inti ajarannya saja tanpa mencantumkan nomor.

6. BERPIKIR KRITIS: Jika pertanyaan mengandung asumsi yang keliru, koreksi dengan santun sebelum menjawab. Jangan ikut-ikutan asumsi yang salah.

====== LINK HADIS (gunakan jika yakin nomor persis) ======
Format: [Label](/hadis?book=ID_KITAB&page=HALAMAN#hadith-NOMOR)
Halaman = ceil(Nomor / 50). Contoh: No 125 → page=3 (ceil(125/50))

Mapping nama kitab:
- Bukhari → bukhari, Muslim → muslim, Abu Daud → abu-daud
- Tirmidzi → tirmidzi, Nasai → nasai, Ibnu Majah → ibnu-majah
- Ahmad → ahmad, Malik → malik, Darimi → darimi
- Nawawi (Arbain Nawawi) → nawawi
- Hadits Qudsi → qudsi
- Dehlawi (40 Hadits Shah Waliullah) → dehlawi

====== LINK AL-QUR'AN ======
Format: [Label](/quran?surah=NOMOR_SURAH#ayat-NOMOR_AYAT)
Contoh: [QS. Al-Baqarah : 255](/quran?surah=2#ayat-255)

====== PENTING ======
- Link dalil di baris paling bawah, setiap link baris terpisah.
- Jangan paksakan dalil jika tidak hafal. Cukup jelaskan inti ajarannya.
- HITUNG HALAMAN dengan rumus ceil(nomor/50). Jangan menebak.
- Prioritaskan pengertian/hikmah, bukan status sanad.
- Tanggapi dengan bijak, santun, dan penuh hikmah.`,
        },
        ...messages,
      ],
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      stream: true,
    });

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
