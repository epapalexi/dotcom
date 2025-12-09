<template>
  <div
    class="max-h-screen overflow-y-auto flex flex-col md:flex-row gap-12 mx-auto my-8 p-6 rounded-lg shadow-none"
  >
    <div class="flex-1 flex flex-col">
      <h1 class="text-2xl font-bold mb-4">Commission a Painting</h1>
      <p class="mb-4">
        I am currently accepting commissions for pet portraits
        <span class="text-gray-500 font-light"
          >(maybe humans too if they're cute enough)</span
        >. Let me know if you have a furry friend you'd like me to paint!
      </p>
      <p class="mb-2">
        Shoot me an email with a photo of your pet and any details you'd like me
        to know.:
        <a href="mailto:email@mortezakarimi.com" class="text-blue-600 underline"
          >email@mortezakarimi.com</a
        >
      </p>
    </div>
    <div class="flex-1 flex items-stretch">
      <span
        class="img-bracket m-auto"
        style="position: relative; display: inline-block"
      >
        <img
          src="/src/assets/paintings/commission.png"
          alt="Sample painting"
          style="
            max-height: 80vh;
            height: 80%;
            object-fit: contain;
            display: block;
          "
        />
        <span class="corner tl"></span>
        <span class="corner tr"></span>
        <span class="corner bl"></span>
        <span class="corner br"></span>
      </span>
    </div>
  </div>
</template>
