import fs from 'fs';
import path from 'path';

const GITHUB_RAW = process.env.GITHUB_RAW_URL || 'https://raw.githubusercontent.com/gadingnst/hadith-api/master/books';

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

async function main() {
  console.log('=== Generating Complete Hadith Search Index ===\n');

  const allHadiths = [];

  for (const book of BOOKS) {
    const url = `${GITHUB_RAW}/${book.id}.json`;
    console.log(`  Fetching ${book.id} (${book.name})...`);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`  [${book.id}] FAILED: HTTP ${res.status}`);
        continue;
      }
      const hadiths = await res.json();
      for (const h of hadiths) {
        allHadiths.push({
          n: h.number,
          i: h.id ?? '',
          b: book.id,
        });
      }
      console.log(`  ${book.id} (${book.name}): ${hadiths.length}/${book.max} hadiths indexed`);
    } catch (e) {
      console.error(`  [${book.id}] FAILED: ${e.message}`);
    }
  }

  console.log(`\nTotal hadiths indexed: ${allHadiths.length}`);

  const outputPath = path.join(process.cwd(), 'public', 'search-index.json');

  if (allHadiths.length === 0 && fs.existsSync(outputPath)) {
    const existingSize = fs.statSync(outputPath).size;
    console.log(`API returned 0 hadiths — preserving existing index (${(existingSize / 1024 / 1024).toFixed(2)} MB)`);
    return;
  }

  fs.writeFileSync(outputPath, JSON.stringify(allHadiths));
  console.log(`Index saved to: ${outputPath}`);
  console.log(`File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
