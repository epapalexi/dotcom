<template>
  <div
    class="max-h-screen overflow-y-auto flex flex-col gap-8 mx-auto my-8 p-6 rounded-lg shadow-none"
  >
    <h1 class="text-3xl font-semibold">Efthymia Papalexi</h1>

    <!-- Education Section -->
    <section>
      <h2 class="text-2xl mb-4">Education</h2>
      <ul class="list-disc pl-6 space-y-2 text-sm text-gray-700">
        <li>
          <strong>Mount Holyoke College</strong> — August 2009 - May 2013
          <div class="ml-2">
            Major: B.A. Biology, High Honors; Minor: Italian Studies
          </div>
        </li>
        <li>
          <strong>New York University</strong> — August 2015 - June 2021
          <div class="ml-2">PhD, Biology — graduating Summer 2021</div>
        </li>
      </ul>
    </section>

    <!-- Employment Section -->
    <section>
      <h2 class="text-2xl mb-4">Employment</h2>
    </section>

    <!-- Research Section -->
    <section>
      <h2 class="text-2xl mb-4">Research Experience</h2>
      <div class="space-y-4 text-sm text-gray-700">
        <div>
          <div class="font-semibold">Parse Biosciences</div>
          <div class="text-xs text-gray-500">December 2021 - Present</div>
          <div class="italic">Position: Staff Scientist</div>
          <ul class="list-disc pl-6 mt-2">
            <li>
              Responsibilities: Develop novel single-cell sequencing
              technologies and improve the performance of the company’s
              single-cell RNA-sequencing technology.
            </li>
          </ul>
        </div>
        <div class="space-y-6 text-sm text-gray-700"></div>
        <div>
          <div class="font-semibold">New York Genome Center</div>
          <div class="text-xs text-gray-500">July 2021 - November 2021</div>
          <div class="italic">Position: Post-doctoral researcher</div>
          <ul class="list-disc pl-6 mt-2">
            <li>
              Responsibilities: Developed computational and experimental
              single-cell genomics methods to understand causes and consequences
              of cellular heterogeneity in various biological systems.
            </li>
          </ul>
        </div>
      </div>
      <div class="space-y-6 mt-6 text-sm text-gray-700">
        <div>
          <div class="font-semibold">
            Characterizing the Molecular Regulation of PD-L1
          </div>
          <div class="text-xs text-gray-500">May 2016 - October 2021</div>
          <div class="italic">Advisor: Rahul Satija</div>
          <ul class="list-disc pl-6 mt-2">
            <li>
              Developed mixscape, a computational framework that improves the
              signal-to-noise ratio in single-cell perturbation screens by
              identifying and removing confounding sources of variation.
            </li>
            <li>
              Used mixscape to identify and validate regulators of PD-L1,
              leveraging multi-modal data to identify transcriptional and
              post-transcriptional modes of regulation (Nature Genetics, 2021).
            </li>
          </ul>
        </div>

        <div>
          <div class="font-semibold">
            Mouse Models of Acute Myeloid Leukemia
          </div>
          <div class="text-xs text-gray-500">June 2013 - July 2015</div>
          <div class="italic">Advisor: Ross L. Levine</div>
          <ul class="list-disc pl-6 mt-2">
            <li>
              Conducted murine studies in pre-leukemia and leukemia model
              systems to elucidate mechanisms that contribute to disease
              pathogenesis.
            </li>
            <li>
              Maintained mouse colonies, set up genetic and drug studies, and
              performed in vitro assays with cell lines and primary murine
              tissue.
            </li>
          </ul>
        </div>

        <div>
          <div class="font-semibold">
            The Genetic Control of Fat-Body Development and Function
          </div>
          <div class="text-xs text-gray-500">May 2012 - May 2013</div>
          <div class="italic">Advisor: Craig T. Woodard</div>
          <ul class="list-disc pl-6 mt-2">
            <li>
              Used qPCR and fluorescence microscopy to investigate effects of
              starvation on insulin signaling and MMP2 expression in Drosophila
              melanogaster.
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section>
      <h2 class="text-2xl mb-4">Skills</h2>
      <div class="text-sm text-gray-700 space-y-2">
        <div>
          <strong>Laboratory:</strong>
          <span class="ml-2"
            >Bacterial and mammalian cell culture, nucleic acid extraction,
            plasmid construction, RT-PCR, qPCR, bulk and single-cell RNA-seq
            library preparation, western blot, flow cytometry, CRISPR, virus
            production.</span
          >
        </div>
        <div>
          <strong>Programming:</strong>
          <span class="ml-2">R, bash, Git</span>
        </div>
        <div>
          <strong>Bioinformatics:</strong>
          <span class="ml-2"
            >Illumina read processing and mapping, single-cell multi-modal
            analyses, data visualization.</span
          >
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.img-bracket img {
  max-width: 100%;
}
</style>
