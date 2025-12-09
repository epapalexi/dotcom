<template>
  <div
    class="pr-5 md:pr-20 pl-5 md:pl-20 pb-56 md:pb-10 pt-5 md:pt-20 h-screen md:h-screen overflow-y-auto"
  >
    <div>
      <h1 class="text-3xl mb-8">Selected Publications</h1>
      <div class="mb-6 text-sm">
        <a
          href="https://scholar.google.com/citations?user=OIUo3mUAAAAJ&hl=en"
          target="_blank"
          class="text-blue-600 underline hover:text-blue-800 transition-colors"
        >
          View full profile on Google Scholar →
        </a>
      </div>

      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-600">Loading publications...</p>
      </div>

      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <div v-else class="space-y-8">
        <div>
          <h2 class="text-2xl mb-4">Selected Publications</h2>

          <div
            v-if="authoredPublications.length"
            class="publications-list space-y-6"
          >
            <div
              v-for="(pub, index) in authoredPublications"
              :key="'a-' + index"
              class="publication-item pb-6 border-b border-gray-200 last:border-0"
            >
              <h3 class="text-lg font-semibold mb-2">
                <a
                  v-if="pub.link"
                  :href="pub.link"
                  target="_blank"
                  class="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {{ pub.title }}
                </a>
                <span v-else>{{ pub.title }}</span>
              </h3>
              <p class="text-sm text-gray-700 mb-1">{{ pub.authors }}</p>
              <p class="text-sm text-gray-600 mb-2">
                <span v-if="pub.venue">{{ pub.venue }}, </span>
                <span v-if="pub.year">{{ pub.year }}</span>
              </p>
              <p v-if="pub.citations" class="text-xs text-gray-500">
                Cited by {{ pub.citations }}
              </p>
            </div>
          </div>
          <div v-else class="text-sm text-gray-600">
            No publications with E Papalexi as first/second/third author found.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Publications",
  data() {
    return {
      publications: [],
      authoredPublications: [],
      otherPublications: [],
      loading: true,
      error: null,
      scholarId: "OIUo3mUAAAAJ",
    };
  },
  mounted() {
    this.fetchPublications();
  },
  methods: {
    async fetchPublications() {
      try {
        // Use a CORS proxy to fetch Google Scholar profile pages, paging through
        // results until no more publications are returned. Be careful of rate
        // limits; we include a safety maxPages to avoid infinite loops.
        const proxyUrl = "https://api.allorigins.win/raw?url=";
        const pageSize = 100; // fetch up to 100 rows per page to reduce requests
        let cstart = 0;
        const maxPages = 50; // safety cap (50 * 100 = 5000 entries)
        let allPubs = [];

        for (let page = 0; page < maxPages; page++) {
          const scholarUrl = `https://scholar.google.com/citations?user=${this.scholarId}&hl=en&cstart=${cstart}&pagesize=${pageSize}`;

          const response = await fetch(
            proxyUrl + encodeURIComponent(scholarUrl)
          );
          if (!response.ok) {
            throw new Error(`Proxy fetch failed: ${response.status}`);
          }

          const html = await response.text();
          const pubs = this.parseScholarHTML(html);

          if (!pubs || pubs.length === 0) {
            break;
          }

          allPubs = allPubs.concat(pubs);

          // If fewer than pageSize were returned, we've reached the last page
          if (pubs.length < pageSize) {
            break;
          }

          cstart += pageSize;
        }

        // Deduplicate publications (by title + year)
        const seen = new Set();
        this.publications = allPubs.filter((p) => {
          const key = `${(p.title || "").toLowerCase()}|${p.year || ""}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        // Remove excluded venues (case-insensitive substring match)
        const excludeVenues = [
          "journal for immunotherapy of cancer",
          "the journal of immunology",
          "cancer research",
          "abstract",
          "new york university",
        ];

        this.publications = this.publications.filter((p) => {
          const venue = (p.venue || "").toLowerCase();
          // Keep publication if none of the exclude terms appear in the venue
          return !excludeVenues.some((ex) => venue.includes(ex));
        });

        // Exclude specific titles (case-insensitive substring match)
        const excludeTitles = [
          "the genetic control of fat body development and function in drosophila melanogaster",
        ];

        this.publications = this.publications.filter((p) => {
          const title = (p.title || "").toLowerCase();
          return !excludeTitles.some((ex) => title.includes(ex));
        });
        // If we couldn't fetch any publications via the CORS proxy, try
        // SerpAPI as a fallback (requires a Vite env var `VITE_SERPAPI_KEY`).
        if (
          (!this.publications || this.publications.length === 0) &&
          typeof import.meta !== "undefined" &&
          import.meta.env &&
          import.meta.env.VITE_SERPAPI_KEY
        ) {
          const serpKey = import.meta.env.VITE_SERPAPI_KEY;
          let start = 0;
          const serpPageSize = 10; // SerpAPI returns ~10 articles per request
          const serpMaxPages = 20;
          let serpAll = [];

          for (let i = 0; i < serpMaxPages; i++) {
            const serpUrl = `https://serpapi.com/search.json?engine=google_scholar_author&author_id=${this.scholarId}&api_key=${serpKey}&start=${start}`;
            const resp = await fetch(serpUrl);
            if (!resp.ok) break;
            const json = await resp.json();
            const articles = json.articles || json.results || [];
            if (!articles.length) break;

            // Map SerpAPI article shape to our publication shape
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
                year:
                  (a.publication_info && a.publication_info.year) ||
                  a.year ||
                  "",
                citations: a.cited_by
                  ? String(a.cited_by.value || a.cited_by)
                  : a.citations
                  ? String(a.citations)
                  : "0",
              });
            });

            start += serpPageSize;
          }

          // Merge serpAll into publications, deduplicate
          const merged = (this.publications || []).concat(serpAll);
          const seen2 = new Set();
          this.publications = merged.filter((p) => {
            const key = `${(p.title || "").toLowerCase()}|${p.year || ""}`;
            if (seen2.has(key)) return false;
            seen2.add(key);
            return true;
          });
        }

        // Sort publications by year (most recent first). Fall back to citations
        // and title when year is not available.
        const extractYear = (val) => {
          if (!val) return 0;
          const s = String(val);
          const m = s.match(/(19|20)\d{2}/);
          if (m) return parseInt(m[0], 10);
          const n = parseInt(s.replace(/[^0-9]/g, ""), 10);
          return isNaN(n) ? 0 : n;
        };

        this.publications.sort((a, b) => {
          const ya = extractYear(a.year || a.venue || a.title);
          const yb = extractYear(b.year || b.venue || b.title);
          if (ya !== yb) return yb - ya;
          const ca =
            parseInt((a.citations || "0").toString().replace(/\D/g, ""), 10) ||
            0;
          const cb =
            parseInt((b.citations || "0").toString().replace(/\D/g, ""), 10) ||
            0;
          if (ca !== cb) return cb - ca;
          return (a.title || "").localeCompare(b.title || "");
        });

        this.splitPublications();
        this.loading = false;
      } catch (err) {
        console.error("Error fetching publications:", err);
        this.error =
          "Unable to load publications. Please visit Google Scholar link above.";
        this.loading = false;
      }
    },
    parseScholarHTML(html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const publications = [];

      // Parse publication rows from Scholar page
      const rows = doc.querySelectorAll(".gsc_a_tr");

      rows.forEach((row) => {
        const titleEl = row.querySelector(".gsc_a_at");
        const authorsEl = row.querySelector(".gs_gray:first-of-type");
        const venueEl = row.querySelector(".gs_gray:last-of-type");
        const yearEl = row.querySelector(".gsc_a_y span");
        const citationsEl = row.querySelector(".gsc_a_c a");

        if (titleEl) {
          publications.push({
            title: titleEl.textContent.trim(),
            link: titleEl.href
              ? new URL(
                  titleEl.getAttribute("href"),
                  "https://scholar.google.com"
                ).href
              : null,
            authors: authorsEl ? authorsEl.textContent.trim() : "",
            venue: venueEl ? venueEl.textContent.trim() : "",
            year: yearEl ? yearEl.textContent.trim() : "",
            citations: citationsEl ? citationsEl.textContent.trim() : "0",
          });
        }
      });

      return publications;
    },
    splitPublications() {
      this.authoredPublications = [];
      this.otherPublications = [];

      const matchRegex = /\bE\.?\s*Papalexi\b/i;

      this.publications.forEach((pub) => {
        const authors = (pub.authors || "").trim();
        if (!authors) {
          this.otherPublications.push(pub);
          return;
        }

        // Split authors by comma and check first three positions
        const parts = authors.split(",").map((s) => s.trim());
        const firstThree = parts.slice(0, 3);

        const isAuthored = firstThree.some((a) => matchRegex.test(a));

        if (isAuthored) {
          this.authoredPublications.push(pub);
        } else {
          this.otherPublications.push(pub);
        }
      });
    },
  },
};
</script>

<style scoped>
.publications-list {
  max-width: 900px;
}
</style>
