<template>
  <div class="prose max-w-none">
    <div v-html="html"></div>

    <div class="mt-6">
      <a href="/dogfood.pdf" target="_blank" rel="noopener" class="text-blue-600 underline">
        Download original PDF
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import mdRaw from '../../content/dogfood.md?raw';

const html = ref('');

onMounted(() => {
  const md = new MarkdownIt({ html: true });
  html.value = DOMPurify.sanitize(md.render(mdRaw));
});
</script>
