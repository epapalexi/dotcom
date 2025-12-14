#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import dotenv from "dotenv";

// Load environment variables from .env if present
dotenv.config();

const OUT_FILE = path.resolve("public/publications.json");
const DEFAULT_SCHOLAR_ID = "OIUo3mUAAAAJ";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url, options = {}) {
  const resp = await fetch(url, options);
  if (!resp.ok)
    throw new Error(`Fetch failed: ${resp.status} ${resp.statusText}`);
  return await resp.text();
}

function parseScholarHTML(html) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const rows = doc.querySelectorAll(".gsc_a_tr");
  const pubs = [];
  rows.forEach((row) => {
    const titleEl = row.querySelector(".gsc_a_at");
    const authorsEl = row.querySelector(".gs_gray:first-of-type");
    const venueEl = row.querySelector(".gs_gray:last-of-type");
    const yearEl = row.querySelector(".gsc_a_y span");
    const citationsEl = row.querySelector(".gsc_a_c a");
    if (titleEl) {
      pubs.push({
        title: titleEl.textContent.trim(),
        link: titleEl.getAttribute("href")
          ? new URL(titleEl.getAttribute("href"), "https://scholar.google.com")
              .href
          : null,
        authors: authorsEl ? authorsEl.textContent.trim() : "",
        venue: venueEl ? venueEl.textContent.trim() : "",
        year: yearEl ? yearEl.textContent.trim() : "",
        citations: citationsEl ? citationsEl.textContent.trim() : "0",
      });
    }
  });
  return pubs;
}

function extractYear(val) {
  if (!val) return 0;
  const s = String(val);
  const m = s.match(/(19|20)\d{2}/);
  if (m) return parseInt(m[0], 10);
  const n = parseInt(s.replace(/[^0-9]/g, ""), 10);
  return isNaN(n) ? 0 : n;
}

async function fetchAllFromScholar(scholarId) {
  const proxyUrl = "https://api.allorigins.win/raw?url=";
  const pageSize = 100;
  let cstart = 0;
  const maxPages = 50;
  let allPubs = [];
  for (let page = 0; page < maxPages; page++) {
    const scholarUrl = `https://scholar.google.com/citations?user=${scholarId}&hl=en&cstart=${cstart}&pagesize=${pageSize}`;
    const url = proxyUrl + encodeURIComponent(scholarUrl);
    try {
      const html = await fetchText(url);
      const pubs = parseScholarHTML(html);
      if (!pubs || pubs.length === 0) break;
      allPubs = allPubs.concat(pubs);
      if (pubs.length < pageSize) break;
      cstart += pageSize;
      // short delay to avoid hammering the proxy
      await sleep(200);
    } catch (err) {
      console.warn("Scholar fetch error:", err.message);
      break;
    }
  }
  return allPubs;
}

async function fetchAllFromSerp(scholarId, serpKey) {
  const serpPageSize = 10;
  const serpMaxPages = 20;
  let serpAll = [];
  let start = 0;
  for (let i = 0; i < serpMaxPages; i++) {
    try {
      const serpUrl = `https://serpapi.com/search.json?engine=google_scholar_author&author_id=${scholarId}&api_key=${serpKey}&start=${start}`;
      const resp = await fetch(serpUrl);
      if (!resp.ok) break;
      const json = await resp.json();
      const articles = json.articles || json.results || [];
      if (!articles.length) break;
      articles.forEach((a) => {
        serpAll.push({
          title: a.title || "",
          link: a.link || a.source || null,
          authors:
            a.authors ||
            (a.publication_info && a.publication_info.authors) ||
            "",
          venue:
            (a.publication_info && a.publication_info.name) ||
            a.publication ||
            "",
          year: (a.publication_info && a.publication_info.year) || a.year || "",
          citations: a.cited_by
            ? String(a.cited_by.value || a.cited_by)
            : a.citations
            ? String(a.citations)
            : "0",
        });
      });
      start += serpPageSize;
      await sleep(200);
    } catch (err) {
      console.warn("SerpAPI fetch error:", err.message);
      break;
    }
  }
  return serpAll;
}

function filterAndDeduplicate(pubs) {
  const seen = new Set();
  const filtered = (pubs || []).filter((p) => {
    const key = `${(p.title || "").toLowerCase()}|${p.year || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const excludeVenues = [
    "journal for immunotherapy of cancer",
    "the journal of immunology",
    "cancer research",
    "abstract",
    "new york university",
  ];
  const excludeTitles = [
    "the genetic control of fat body development and function in drosophila melanogaster",
  ];
  return filtered.filter((p) => {
    const venue = (p.venue || "").toLowerCase();
    const title = (p.title || "").toLowerCase();
    if (excludeVenues.some((ex) => venue.includes(ex))) return false;
    if (excludeTitles.some((ex) => title.includes(ex))) return false;
    return true;
  });
}

function sortPubs(pubs) {
  return pubs.sort((a, b) => {
    const ya = extractYear(a.year || a.venue || a.title);
    const yb = extractYear(b.year || b.venue || b.title);
    if (ya !== yb) return yb - ya;
    const ca =
      parseInt((a.citations || "0").toString().replace(/\D/g, ""), 10) || 0;
    const cb =
      parseInt((b.citations || "0").toString().replace(/\D/g, ""), 10) || 0;
    if (ca !== cb) return cb - ca;
    return (a.title || "").localeCompare(b.title || "");
  });
}

async function main() {
  try {
    const scholarId =
      process.env.VITE_SCHOLAR_ID ||
      process.env.SCHOLAR_ID ||
      DEFAULT_SCHOLAR_ID;
    console.log("Generating publications for scholar id", scholarId);
    let pubs = await fetchAllFromScholar(scholarId);
    if (
      (!pubs || pubs.length === 0) &&
      (process.env.VITE_SERPAPI_KEY || process.env.SERPAPI_KEY)
    ) {
      const key = process.env.VITE_SERPAPI_KEY || process.env.SERPAPI_KEY;
      console.log("No scholar results; falling back to SerpAPI");
      const serpAll = await fetchAllFromSerp(scholarId, key);
      pubs = serpAll;
    }
    pubs = filterAndDeduplicate(pubs);
    pubs = sortPubs(pubs);
    await fs.promises.mkdir(path.dirname(OUT_FILE), { recursive: true });
    await fs.promises.writeFile(
      OUT_FILE,
      JSON.stringify(pubs, null, 2),
      "utf8"
    );
    console.log(`Wrote ${pubs.length} publications to ${OUT_FILE}`);
  } catch (err) {
    console.error("Failed to generate publications:", err);
    process.exit(1);
  }
}

main();
