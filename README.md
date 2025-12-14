# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Publications JSON (build-time)

A build-time script generates a static `public/publications.json` file with selected publications. The script `scripts/generatePublications.js` runs automatically during `npm run build` and writes the JSON used by the `src/views/pubs.vue` view.

To regenerate publications manually:

```bash
npm run generate-publications
```

Scholar ID live in .env at root of this project under `VITE_SCHOLAR_ID=`

If you use SerpAPI for scraping fallback, set `VITE_SERPAPI_KEY` (or `SERPAPI_KEY`) in the environment before running the generator.
