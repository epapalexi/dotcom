<template>
  <div
    class="max-h-screen overflow-y-auto flex flex-col gap-8 mx-auto my-8 p-6 rounded-lg shadow-none"
  >
    <h1 class="text-3xl font-semibold">Resume</h1>

    <!-- Education Section -->
    <section>
      <h2 class="text-2xl mb-4">Education</h2>
      <ul class="list-disc pl-6 space-y-2 text-sm text-gray-700">
        <li>
          <strong>PhD</strong> — Add institution and year (e.g., 2015–2019).
          Replace with your degree details.
        </li>
        <li>
          <strong>BSc / MSc</strong> — Add institution and year (e.g.,
          2010–2014). Replace with your degree details.
        </li>
      </ul>
    </section>

    <!-- Employment Section -->
    <section>
      <h2 class="text-2xl mb-4">Employment</h2>
      <ul class="list-disc pl-6 space-y-2 text-sm text-gray-700">
        <li>
          <strong>Current Position</strong> — Job title, employer, dates.
          Replace with your employment details.
        </li>
        <li>
          <strong>Previous Position</strong> — Job title, employer, dates.
        </li>
      </ul>
    </section>

    <!-- Research Section -->
    <section>
      <h2 class="text-2xl mb-4">Research</h2>
      <p class="text-sm text-gray-700 mb-2">
        Brief description of research interests and key areas of expertise. List
        important projects, techniques, or themes below.
      </p>
      <ul class="list-disc pl-6 space-y-2 text-sm text-gray-700">
        <li>Single-cell transcriptomics / proteomics</li>
        <li>CRISPR-based perturbations</li>
        <li>Computational analysis and data visualization</li>
      </ul>
    </section>

    <div class="text-xs text-gray-500 mt-6">
      Replace these placeholder entries with your actual resume content.
    </div>
  </div>
</template>

<style scoped>
.img-bracket img {
  max-width: 100%;
}
</style>
