// import * as pdfjsLib from "pdfjs-dist";

// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

// export async function extractTextFromPdf(file: File): Promise<string> {
//   const arrayBuffer = await file.arrayBuffer();
//   const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
//   const pages: string[] = [];

//   for (let i = 1; i <= pdf.numPages; i++) {
//     const page = await pdf.getPage(i);
//     const content = await page.getTextContent();
//     const text = content.items
//       .map((item: { str: string }) => item.str)
//       .join(" ");
//     pages.push(text);
//   }

//   return pages.join("\n\n");
// }


import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// ✅ Extract text (optimized)
export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = "";
  const MAX_PAGES = 5;

  for (let i = 1; i <= Math.min(pdf.numPages, MAX_PAGES); i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(" ");
    text += pageText + "\n";
  }

  return text.slice(0, 20000);
}

// ✅ Chunking
export function splitIntoChunks(text: string, chunkSize = 500) {
  const words = text.split(" ");
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }

  return chunks;
}

// ✅ Find best chunk
export function findRelevantChunk(chunks: string[], question: string) {
  const qWords = question.toLowerCase().split(" ");

  let bestChunk = chunks[0];
  let bestScore = 0;

  for (const chunk of chunks) {
    const lower = chunk.toLowerCase();
    let score = 0;

    for (const word of qWords) {
      if (lower.includes(word)) score++;
    }

    if (score > bestScore) {
      bestScore = score;
      bestChunk = chunk;
    }
  }

  return bestChunk;
}
