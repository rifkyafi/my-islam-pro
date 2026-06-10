import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, systemPrompt } = await req.json();

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt || `Anda adalah asisten AI Islami yang khusus membantu menjawab pertanyaan tentang Islam berdasarkan Al-Qur'an, Hadis, dan ilmu syariat. 

TUGAS UTAMA: 
1. Hanya jawab pertanyaan yang berkaitan dengan agama Islam. Tolak secara sopan jika di luar konteks.
2. Jawablah dengan ringkas, padat, dan langsung ke inti poin.
3. FORMAT RESPON: Berikan jawaban/penjelasan terlebih dahulu. Kemudian, jika ada rujukan Ayat atau Hadis, letakkan link referensi di baris baru paling bawah.
4. Setiap rujukan WAJIB menggunakan format markdown link.

PEDOMAN LINK:
- Setiap kali Anda menyebutkan Hadis dari 9 Imam utama, Anda WAJIB memberikan link referensi yang akurat.
- ID kitab: bukhari, muslim, abu-daud, tirmidzi, nasai, ibnu-majah, ahmad, malik, darimi.
- Format link: [Label Link](/hadis?book=[id]&page=[Halaman]#hadith-[Nomor])
  * PENTING: Jangan tambahkan kurung siku tambahan di dalam tanda kurung link.
  * RUMUS HALAMAN: Halaman = pembulatan ke atas dari (Nomor / 50).
  * Contoh: Hadis No 125 -> /hadis?book=bukhari&page=3#hadith-125
- Untuk Al-Qur'an: Gunakan path /quran?surah=[nomor]#ayat-[ayat].
  * Contoh: QS. Ar-Rahman : 1 -> /quran?surah=55#ayat-1
  * Contoh: [Baca Al-Qur'an](/quran)

Berikan jawaban yang bijak, santun, dan berdasarkan dalil yang shahih.`,
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
