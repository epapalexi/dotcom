<template>
  <div
    class="pr-5 md:pr-20 pl-5 md:pl-20 pb-56 md:pb-10 pt-5 md:pt-20 h-screen md:h-screen overflow-y-auto"
  >
    <div>
      <h1 class="text-3xl mb-8">Publications</h1>
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
        // Using SerpAPI - requires API key
        // Alternative: use a CORS proxy to fetch Scholar page
        const proxyUrl = "https://api.allorigins.win/raw?url=";
        const scholarUrl = `https://scholar.google.com/citations?user=${this.scholarId}&hl=en`;

        const response = await fetch(proxyUrl + encodeURIComponent(scholarUrl));
        const html = await response.text();

        // Parse publications from HTML
        this.publications = this.parseScholarHTML(html);
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

.publication-item:hover {
  background-color: #f9fafb;
  padding: 1rem;
  margin: -1rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
}
</style>
