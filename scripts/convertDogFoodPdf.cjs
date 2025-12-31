const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function extractTextFromPdf(buffer) {
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
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
  // Accept a few common locations for the source PDF
  const candidates = [
    path.resolve(__dirname, '../src/recipes/DogFood.pdf'),
    path.resolve(__dirname, '../src/assets/recipes/DogFood.pdf'),
    path.resolve(__dirname, '../src/recipes/DogFood.PDF'),
    path.resolve(__dirname, '../src/assets/recipes/DogFood.PDF'),
  ];
  const srcPdf = candidates.find((p) => fs.existsSync(p));

  const outMdDir = path.resolve(__dirname, '../src/content');
  const outMd = path.join(outMdDir, 'dogfood.md');
  const publicPdf = path.resolve(__dirname, '../public/dogfood.pdf');

  if (!fs.existsSync(srcPdf)) {
    console.error('Source PDF not found:', srcPdf);
    process.exit(1);
  }

  const dataBuffer = fs.readFileSync(srcPdf);
  let text = await extractTextFromPdf(dataBuffer);

  // Basic cleanup: collapse multiple spaces and blank lines and trim
  text = text.replace(/\r\n/g, '\n');
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.replace(/ {2,}/g, ' ');
  text = text.trim();

  // Add a top-level title if none found
  let md = '';
  md += '# Dog Food\n\n';
  md += 'Original PDF: [Download](/dogfood.pdf)\n\n';
  md += text.split('\n').map(line => line.trim()).join('\n\n');

  if (!fs.existsSync(outMdDir)) fs.mkdirSync(outMdDir, { recursive: true });
  fs.writeFileSync(outMd, md, 'utf8');
  console.log('Wrote Markdown to', outMd);

  // Copy PDF to public
  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  fs.copyFileSync(srcPdf, publicPdf);
  console.log('Copied PDF to', publicPdf);
}

convert().catch(err => {
  console.error(err);
  process.exit(1);
});
