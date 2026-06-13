const books = [
  "abu-daud", "ahmad", "bukhari", "darimi",
  "ibnu-majah", "malik", "muslim", "nasai", "tirmidzi"
];

const baseUrl = "https://raw.githubusercontent.com/gadingnst/hadith-api/master/books";

async function fetchAndMax(bookId) {
  const url = `${baseUrl}/${bookId}.json`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    // Stream as NDJSON-like — but it's one giant array, so parse as text
    // We'll parse the full JSON (Node 22+ supports streaming JSON parse well enough)
    // For very large files, use a streaming JSON parser approach:
    // Read as text and JSON.parse — but these are ~5-15MB, manageable.
    const text = await resp.text();
    const data = JSON.parse(text);
    let max = 0;
    let count = 0;
    for (let i = 0; i < data.length; i++) {
      const n = data[i].number;
      count++;
      if (n > max) max = n;
    }
    return { bookId, fileNameFoundCount: count, maxNumber: max };
  } catch (err) {
    return { bookId, fileNameFoundCount: -1, maxNumber: -1, error: err.message };
  }
}

const results = await Promise.all(books.map(fetchAndMax));

console.log("bookId | fileNameFoundCount | maxNumber");
console.log("-------|-------------------|----------");
for (const r of results) {
  console.log(`${r.bookId} | ${r.fileNameFoundCount} | ${r.maxNumber}`);
}
