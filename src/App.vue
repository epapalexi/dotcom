<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";

const showMenu = ref(false);
const headerHeight = ref("40px");

const links = [
  { href: "/", label: "About" },
  {
    href: "#",
    label: "Work",
    children: [
      // { href: '/art/things', label: 'Things' },
      { href: "/Work/publications", label: "Selected Publications" },
      { href: "/Work/resume", label: "Resume" },
    ],
  },
  // { href: '#', label: 'Recipes', children: [
  //   { href: '#', label: 'Breakfast' },
  //   { href: '#', label: 'Lunch' },
  //   { href: '#', label: 'Dinner' }
  // ]},
  // { href: '#', label: 'Failed Attempts At Becoming Rich' },
  { href: "/recipes", label: "Recipes" },
  { href: "/contact", label: "Contact" },
];

watch(showMenu, (val) => {
  headerHeight.value = val ? "170px" : "40px";
});

// Circle position
const circleX = ref(window.innerWidth / 2 - 400);
const circleY = ref(window.innerHeight / 2 - 400);

const activeDropdown = ref<string | null>(null);

function handleMove(e: MouseEvent | TouchEvent) {
  let x = 0,
    y = 0;
  if (e instanceof MouseEvent) {
    x = e.clientX;
    y = e.clientY;
  } else if (e instanceof TouchEvent && e.touches.length) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  }
  circleX.value = x - 400;
  circleY.value = y - 400;
}

onMounted(() => {
  window.addEventListener("mousemove", handleMove);
  window.addEventListener("touchmove", handleMove);
});
onUnmounted(() => {
  window.removeEventListener("mousemove", handleMove);
  window.removeEventListener("touchmove", handleMove);
});
</script>

<template>
  <div
    class="h-screen flex flex-col bg-gray-300 font-sans font-extralight relative overflow-hidden"
    style="height: 100dvh; overflow: hidden"
  >
    <!-- Moving Circle Underlay -->
    <!--
    <div
      class="fixed top-0 left-0 pointer-events-none z-0"
      :style="{
      width: '800px',
      height: '800px',
      borderRadius: '50%',
      background: 'radial-gradient(circle at center, #a7f3d0 60%, #38bdf8 100%)',
      transform: `translate(${circleX}px, ${circleY}px)`,
      transition: 'transform 0.3s cubic-bezier(.25,.8,.25,1)',
      }"
    ></div>
    -->
    <header
      class="fixed top-0 left-0 w-full z-50 bg-transparent transition-all duration-300 overflow-hidden"
      :style="{ height: headerHeight }"
    >
      <div class="flex items-start justify-between px-2 py-1 h-[40px]">
        <a href="/" @click.prevent="$router.push('/')">
          <img
            src="./assets/logo_mk.svg"
            alt="Morteza Karimi Logo"
            class="h-8"
          />
        </a>
        <nav
          class="hidden md:flex space-x-6 relative"
          @mouseleave="headerHeight = '40px'"
        >
          <template v-for="link in links" :key="link.label">
            <div
              class="flex flex-col items-center group relative"
              @mouseenter="
                activeDropdown = link.label;
                link.children
                  ? (headerHeight = '70px')
                  : (headerHeight = '40px');
              "
            >
              <RouterLink
                :to="link.href"
                class="text-gray-700 px-2 py-1 transition-colors duration-200 font-normal"
                :class="
                  link.children
                    ? 'group-hover:text-blue-600'
                    : 'hover:text-blue-600'
                "
              >
                {{ link.label }}
              </RouterLink>
              <div
                v-if="link.children && activeDropdown === link.label"
                class="absolute left-1/2 -translate-x-1/2 flex space-x-4 transition-opacity duration-200"
                :style="{ top: '100%' }"
              >
                <RouterLink
                  v-for="child in link.children"
                  :key="child.label"
                  :to="child.href"
                  class="text-gray-700 hover:text-blue-600 whitespace-nowrap px-2 py-1"
                >
                  {{ child.label }}
                </RouterLink>
              </div>
            </div>
          </template>
        </nav>
        <button
          class="md:hidden flex items-center text-gray-700 py-1"
          @click="showMenu = !showMenu"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      <transition>
        <div
          v-if="showMenu"
          class="md:hidden px-6 pb-4"
          style="overflow: hidden"
        >
          <nav class="flex flex-col space-y-2 items-end text-right">
            <template v-for="link in links" :key="link.label">
              <div class="flex flex-col items-end w-full">
                <a
                  :href="link.href"
                  class="text-gray-700 hover:text-blue-600 block font-normal whitespace-nowrap"
                >
                  {{ link.label }}
                </a>
                <div v-if="link.children" class="flex flex-row space-x-2 mt-1">
                  <a
                    v-for="child in link.children"
                    :key="child.label"
                    :href="child.href"
                    class="text-gray-700 hover:text-blue-600 block font-extralight whitespace-nowrap"
                  >
                    {{ child.label }}
                  </a>
                </div>
              </div>
            </template>
          </nav>
        </div>
      </transition>
      <!-- Header separator -->
      <div
        class="absolute left-[5px] right-[5px] bottom-0 h-[1px] bg-black"
      ></div>
    </header>
    <main
      class="flex-1 min-h-0 overflow-hidden transition-all duration-300"
      :style="{
        marginTop: headerHeight,
        marginBottom: '56px',
      }"
    >
      <RouterView />
    </main>
    <footer
      class="fixed bottom-0 left-0 w-full px-6 py-3 flex flex-row items-center justify-between z-50 bg-transparent shadow-none"
      style="height: 56px"
    >
      <!-- Footer separator -->
      <div class="absolute left-[5px] right-[5px] top-0 h-[1px] bg-black"></div>
      <div class="text-gray-700 text-sm">
        <a
          href="https://github.com/karimi"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center space-x-1 hover:text-blue-600 transition-colors"
          aria-label="GitHub"
        >
          <img src="./assets/github-mark.svg" alt="GitHub" class="w-5 h-5" />
          <span class="sr-only">GitHub</span>
        </a>
      </div>
      <div class="text-gray-500 text-xs mt-2 md:mt-0">
        &copy; 2025 Morteza Karimi. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<style scoped>
html,
body,
#app {
  height: 100dvh;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
</style>
