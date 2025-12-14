<template>
  <div
    class="pr-5 md:pr-20 pl-5 md:pl-20 pb-56 md:pb-10 pt-5 md:pt-20 h-screen md:h-screen overflow-y-auto"
  >
    <div>
      <h1 class="text-3xl font-semibold mb-8">Selected Publications</h1>
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
          <div
            v-if="authoredPublications.length"
            class="publications-list space-y-6"
          >
            <div
              v-for="(pub, index) in authoredPublications"
              :key="'a-' + index"
              class="publication-item pb-6 border-b border-gray-200 last:border-0"
            >
              <h3 class="text-2xl mb-4">
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
              <p
                class="text-sm text-gray-700 mb-1"
                v-html="formatAuthors(pub)"
              ></p>
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
      };
  },
  mounted() {
    this.fetchPublicationsFromJson();
  },
  methods: {
    async fetchPublicationsFromJson() {
      try {
        const resp = await fetch('/publications.json');
        if (!resp.ok) throw new Error(`Failed to load publications: ${resp.status}`);
        const data = await resp.json();
        this.publications = data || [];
        this.splitPublications();
        this.loading = false;
      } catch (err) {
        console.error('Error loading publications JSON:', err);
        this.error = 'Unable to load publications. Please visit Google Scholar link above.';
        this.loading = false;
      }
    },
    // Escape HTML and bold E Papalexi in the authors string
    formatAuthors(pub) {
      const authors = pub && pub.authors ? String(pub.authors) : "";
      const escapeHtml = (s) =>
        s
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");

      const escaped = escapeHtml(authors);
      // Match "E Papalexi" with or without the period after E, case-insensitive
      const regex = /(\bE\.?\s*Papalexi\b)/gi;
      const replaced = escaped.replace(
        regex,
        '<strong class="font-semibold">$1</strong>'
      );
      return replaced;
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
