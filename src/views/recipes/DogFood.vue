<template>
  <main class="mx-auto max-w-2xl p-6 space-y-6">
    <header class="flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold" v-if="!showGreek">Sky's food</h1>
        <h1 class="text-2xl font-bold" v-else>Το φαγητό της Σκάι</h1>
        <p class="text-sm text-gray-600" v-if="!showGreek">
          A homemade recipe for my soulmate dog
        </p>
        <p class="text-sm text-gray-600" v-else>Σπιτικό φαγητό για τη Σκάι</p>
      </div>

      <div
        role="button"
        tabindex="0"
        @click="toggleLanguage"
        @keydown.enter.prevent="toggleLanguage"
        @keydown.space.prevent="toggleLanguage"
        class="ml-4 px-3 py-2 border rounded cursor-pointer text-sm hover:bg-gray-100 select-none"
        :aria-pressed="showGreek"
        :aria-label="showGreek ? 'EN' : 'GR'"
      >
        <span v-if="!showGreek">GR</span>
        <span v-else>EN</span>
      </div>
    </header>

    <figure class="space-y-1">
      <img
        :src="ingredientsImg"
        :alt="
          showGreek
            ? 'Υλικά για το φαγητό της Σκάι'
            : 'Ingredients for Sky\'s food laid out'
        "
        class="w-full object-cover rounded max-h-[40vh]"
      />
      <figcaption class="text-xs text-gray-500">
        {{ showGreek ? "Υλικά" : "Ingredients" }}
      </figcaption>
    </figure>

    <section class="prose text-sm" v-if="!showGreek">
      <h2 class="text-base font-semibold">Ingredients</h2>
      <ul class="list-disc ml-6 space-y-1">
        <li>One pound ground turkey 🦃</li>
        <li>One pack of chicken liver 🐔</li>
        <li>Half a pack of baby carrots 🥕</li>
        <li>Half a pack of frozen cut bell peppers 🫑</li>
        <li>One cup of oats</li>
        <li>One sweet potato/potato cut in cubes 🍠🥔</li>
        <li>Two eggs 🥚</li>
        <li>Half a pack of frozen blueberries 🫐</li>
        <li>One teaspoon of turmeric</li>
        <li>One teaspoon of cinnamon</li>
        <li>A pinch of black pepper powder</li>
        <li>Two teaspoons of eggshell powder</li>
        <li>Four scoops of daily support powder</li>
        <li>Half a pack of frozen spinach</li>
        <li>500–750ml of water 💧</li>
      </ul>

      <h2 class="text-base font-semibold mt-4">Instructions</h2>
      <ol class="list-decimal ml-6 space-y-1">
        <li>Add all ingredients except the eggs into the pot.</li>
        <li>
          Boil for 20–30 minutes until it’s cooked, stirring every 5–10 minutes
          to prevent sticking.
        </li>
        <li>Once cooked, add the two eggs and stir to combine.</li>
        <li>
          Give a spoon of food to Sky to try and let it cool at room temperature
          before putting it in the fridge.
        </li>
      </ol>
    </section>

    <section class="prose text-sm" v-else>
      <h2 class="text-base font-semibold">Υλικά</h2>
      <ul class="list-disc ml-6 space-y-1">
        <li>μισό κιλό κιμά από γαλοπούλα 🦃</li>
        <li>ένα πακέτο συκώτι κοτόπουλο 🐔</li>
        <li>μισό πακέτο μικρά καρότα 🥕</li>
        <li>μισό πακέτο κομμένες πιπεριές κατεψυγμένες 🫑</li>
        <li>μια κούπα βρώμη</li>
        <li>μια γλυκοπατάτα κομμένη σε κύβους 🍠🥔</li>
        <li>δύο αβγά 🥚</li>
        <li>ένα πακέτο κατεψυγμένα μύρτιλα 🫐</li>
        <li>ένα κουταλάκι του γλυκού κουρκουμά</li>
        <li>ένα κουταλάκι του γλυκού σκόνη κανέλα</li>
        <li>λίγο τριμμένο μαύρο πιπέρι</li>
        <li>δύο κουταλιές του γλυκού σκόνη από τσόφλια αυγού</li>
        <li>τέσσερις κουταλιές "daily support" powder</li>
        <li>ένα πακέτο κατεψυγμένο σπανάκι</li>
        <li>500–750ml νερό 💧</li>
      </ul>

      <h2 class="text-base font-semibold mt-4">Εκτέλεση</h2>
      <p>
        Ρίχνουμε όλα τα υλικά εκτός από τα αυγά μέσα στην κατσαρόλα και βράζουμε
        για 20–30 λεπτά. Ανακατεύουμε κάθε 5–10 λεπτά για να μην κολλήσει. Όταν
        το φαγητό έχει γίνει, σπάμε δύο αβγά και ανακατεύουμε να αναμειχθούν
        καλά. Δίνουμε στη Σκάι να δοκιμάσει και αφήνουμε να κρυώσει πριν το
        βάλουμε στο ψυγείο.
      </p>
    </section>

    <footer class="text-xs text-gray-500">
      {{ showGreek ? "Μερίδες: 10" : "Serves: 10" }}
    </footer>
  </main>
</template>

<script setup>
import { ref } from "vue";
import ingredientsImg from "../../assets/paintings/clove.jpeg";
import finishedImg from "../../assets/paintings/bunnychow.jpeg";

const showGreek = ref(false);
const toggleLanguage = () => {
  showGreek.value = !showGreek.value;
};
</script>
