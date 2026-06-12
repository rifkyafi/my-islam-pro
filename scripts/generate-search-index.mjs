import https from 'https';
import fs from 'fs';
import path from 'path';

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

const API_BASE = process.env.NEXT_PUBLIC_HADITS_API_URL || 'https://api.hadith.gading.dev';
const CHUNK = 250;
const DELAY_MS = 100;

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
          return;
        }
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
    req.on('error', reject);
  });
}

async function main() {
  console.log('=== Generating Complete Hadith Search Index ===\n');

  const allHadiths = [];

  for (const book of BOOKS) {
    const totalChunks = Math.ceil(book.max / CHUNK);
    let fetched = 0;

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK + 1;
      const end = Math.min((i + 1) * CHUNK, book.max);

      try {
        const res = await fetchJson(`${API_BASE}/books/${book.id}?range=${start}-${end}`);
        const hadiths = res?.data?.hadiths ?? res?.hadiths ?? [];
        for (const h of hadiths) {
          allHadiths.push({
            n: h.number,
            i: h.id ?? '',
            b: book.id,
          });
        }
        fetched += hadiths.length;
      } catch (e) {
        console.error(`  [${book.id}] FAILED ${start}-${end}: ${e.message}`);
      }

      if (i < totalChunks - 1) {
        await new Promise(r => setTimeout(r, DELAY_MS));
      }
    }

    console.log(`  ${book.id} (${book.name}): ${fetched}/${book.max} hadiths indexed`);
  }

  console.log(`\nTotal hadiths indexed: ${allHadiths.length}`);

  const outputPath = path.join(process.cwd(), 'public', 'search-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(allHadiths));
  console.log(`Index saved to: ${outputPath}`);
  console.log(`File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
