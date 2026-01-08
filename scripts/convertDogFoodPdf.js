const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

async function convert() {
  const srcPdf = path.resolve(__dirname, "../src/recipes/DogFood.pdf");
  const outMdDir = path.resolve(__dirname, "../src/content");
  const outMd = path.join(outMdDir, "dogfood.md");
  const publicPdf = path.resolve(__dirname, "../public/dogfood.pdf");

  if (!fs.existsSync(srcPdf)) {
    console.error("Source PDF not found:", srcPdf);
    process.exit(1);
  }

  const dataBuffer = fs.readFileSync(srcPdf);
  const data = await pdf(dataBuffer);
  let text = data.text || "";

  // Basic cleanup: collapse multiple blank lines and trim
  text = text.replace(/\r\n/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.trim();

  // Add a top-level title if none found
  let md = "";
  md += "# Dog Food\n\n";
  md += "Original PDF: [Download](/dogfood.pdf)\n\n";
  md += text
    .split("\n")
    .map((line) => line.trim())
    .join("\n\n");

  if (!fs.existsSync(outMdDir)) fs.mkdirSync(outMdDir, { recursive: true });
  fs.writeFileSync(outMd, md, "utf8");
  console.log("Wrote Markdown to", outMd);

  // Copy PDF to public
  const publicDir = path.resolve(__dirname, "../public");
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  fs.copyFileSync(srcPdf, publicPdf);
  console.log("Copied PDF to", publicPdf);
}

convert().catch((err) => {
  console.error(err);
  process.exit(1);
});
