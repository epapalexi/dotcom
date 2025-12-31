import fs from 'fs';
import path from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

async function extractTextFromPdf(buffer) {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
  const doc = await loadingTask.promise;
  const numPages = doc.numPages;
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(' ');
    fullText += pageText + '\n\n';
  }

  return fullText;
}

async function convert() {
  const __dirname = path.resolve();
  const candidates = [
    path.resolve(__dirname, 'src/recipes/DogFood.pdf'),
    path.resolve(__dirname, 'src/assets/recipes/DogFood.pdf'),
    path.resolve(__dirname, 'src/recipes/DogFood.PDF'),
    path.resolve(__dirname, 'src/assets/recipes/DogFood.PDF'),
  ];
  const srcPdf = candidates.find((p) => fs.existsSync(p));

  const outMdDir = path.resolve('src/content');
  const outMd = path.join(outMdDir, 'dogfood.md');
  const publicPdf = path.resolve('public/dogfood.pdf');

  if (!fs.existsSync(srcPdf)) {
    console.error('Source PDF not found:', srcPdf);
    process.exit(1);
  }

  const dataBuffer = fs.readFileSync(srcPdf);
  let text = await extractTextFromPdf(dataBuffer);

  // Basic cleanup
  text = text.replace(/\r\n/g, '\n');
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.replace(/ {2,}/g, ' ');
  text = text.trim();

  let md = '';
  md += '# Dog Food\n\n';
  md += 'Original PDF: [Download](/dogfood.pdf)\n\n';
  md += text.split('\n').map(line => line.trim()).join('\n\n');

  if (!fs.existsSync(outMdDir)) fs.mkdirSync(outMdDir, { recursive: true });
  fs.writeFileSync(outMd, md, 'utf8');
  console.log('Wrote Markdown to', outMd);

  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  fs.copyFileSync(srcPdf, publicPdf);
  console.log('Copied PDF to', publicPdf);
}

await convert();
