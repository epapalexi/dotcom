<template>
  <main class="mx-auto max-w-3xl p-6 space-y-6">
    <header class="flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold" v-if="!showGreek">Sourdough bread</h1>
        <h1 class="text-2xl font-bold" v-else>Ψωμί με προζύμι</h1>
        <p class="text-sm text-gray-600" v-if="!showGreek">
          A detailed sourdough schedule and scalable ingredient tables
        </p>
        <p class="text-sm text-gray-600" v-else>
          Πλήρες πρόγραμμα για προζυμένιο ψωμί με πίνακες υλικών που
          προσαρμόζονται
        </p>
      </div>

      <div
        role="button"
        tabindex="0"
        @click="toggleLanguage"
        @keydown.enter.prevent="toggleLanguage"
        @keydown.space.prevent="toggleLanguage"
        class="ml-4 px-3 py-2 border rounded cursor-pointer text-sm hover:bg-gray-100 select-none"
        :aria-pressed="showGreek"
        :aria-label="showGreek ? 'View in English' : 'Δείτε στα Ελληνικά'"
      >
        <span v-if="!showGreek">Δείτε στα Ελληνικά</span>
        <span v-else>View in English</span>
      </div>
    </header>

    <figure class="space-y-1">
      <img
        :src="ingredientsImg"
        :alt="
          showGreek
            ? 'Υλικά για ψωμί με προζύμι'
            : 'Ingredients for sourdough bread'
        "
        class="w-full object-cover rounded max-h-[40vh]"
      />
      <figcaption class="text-xs text-gray-500">
        {{ showGreek ? "Υλικά" : "Ingredients" }}
      </figcaption>
    </figure>

    <!-- Controls: number of breads (numeric input only) -->
    <div class="flex items-center gap-3">
      <label class="text-sm font-medium">{{
        showGreek ? "Αριθμός ψωμιών" : "Number of breads"
      }}</label>

      <div class="flex items-center gap-2 ml-4">
        <input
          type="number"
          min="1"
          v-model.number="breads"
          class="w-24 px-2 py-1 border rounded text-sm"
        />
        <span class="text-sm text-gray-500">{{
          showGreek ? "ψωμια" : "loaves"
        }}</span>
      </div>
    </div>

    <!-- Levain / Λεβέν -->
    <section class="prose text-sm">
      <h2 class="text-base font-semibold">
        {{ showGreek ? "Λεβέν" : "Levain" }}
      </h2>

      <p v-if="!showGreek">
        In a small bowl, mix the sourdough starter with fresh flour to create
        the levain. Let it rest for 5 hours, covered, in a warm place at about
        26°C (79°F). This levain will be slightly stiff; shape it into a ball
        before letting it rest.
      </p>
      <p v-else>
        Σε ένα μικρό μπολ θα αναμείξεις το προζύμι με καινούριο αλεύρι και θα
        δημιουργήσεις το λεβέν. Αυτό το λεβέν ξεκουράζεται για 5 ώρες,
        σκεπασμένο σε ένα ζεστό σημείο, περίπου στους 26°C.
      </p>

      <table class="w-full text-sm mt-2 table-auto border-collapse">
        <thead>
          <tr class="bg-gray-50 text-left text-xs text-gray-600">
            <th class="p-2">{{ showGreek ? "Υλικό" : "Ingredient" }}</th>
            <th class="p-2 text-right">
              {{
                showGreek
                  ? "Δόση (" + breads + " ψωμ.)"
                  : "Amount (" + breads + " loaves)"
              }}
            </th>
            <th class="p-2 text-right">
              {{ showGreek ? "Ανά ψωμί" : "Per loaf" }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr class="">
            <td class="p-2">
              {{ showGreek ? "Προζύμι" : "Sourdough starter" }}
              <button
                type="button"
                @click="toggleNote('levain.starter')"
                @mouseenter="showNote('levain.starter')"
                @mouseleave="hideNote"
                @focus="showNote('levain.starter')"
                @blur="hideNote"
                class="ml-2 text-xs text-gray-400 hover:text-gray-700 focus:outline-none"
                :aria-expanded="activeNote === 'levain.starter'"
                :aria-label="
                  showGreek ? 'Σημείωση για το προζύμι' : 'Note for starter'
                "
              >
                <span class="sr-only">Show note</span>ℹ️
              </button>

              <div
                v-if="activeNote === 'levain.starter'"
                class="mt-1 text-xs text-gray-600 bg-white border p-2 rounded shadow-sm w-64"
              >
                {{ notes["levain.starter"][showGreek ? "gr" : "en"] }}
              </div>
            </td>
            <td class="p-2 text-right">{{ fmtGrams(levain.starter) }}</td>
            <td class="p-2 text-right">
              {{ fmtGrams(levain.starter / breads) }}
            </td>
          </tr>
          <tr>
            <td class="p-2">
              {{ showGreek ? "Αλεύρι" : "Flour" }}
              <button
                type="button"
                @click="toggleNote('levain.flour')"
                @mouseenter="showNote('levain.flour')"
                @mouseleave="hideNote"
                @focus="showNote('levain.flour')"
                @blur="hideNote"
                class="ml-2 text-xs text-gray-400 hover:text-gray-700 focus:outline-none"
                :aria-expanded="activeNote === 'levain.flour'"
                :aria-label="
                  showGreek
                    ? 'Σημείωση για το αλεύρι του λεβέν'
                    : 'Note for levain flour'
                "
              >
                <span class="sr-only">Show note</span>ℹ️
              </button>
              <div
                v-if="activeNote === 'levain.flour'"
                class="mt-1 text-xs text-gray-600 bg-white border p-2 rounded shadow-sm w-64"
              >
                {{ notes["levain.flour"][showGreek ? "gr" : "en"] }}
              </div>
            </td>
            <td class="p-2 text-right">{{ fmtGrams(levain.flour) }}</td>
            <td class="p-2 text-right">
              {{ fmtGrams(levain.flour / breads) }}
            </td>
          </tr>
          <tr>
            <td class="p-2">
              {{ showGreek ? "Νερό" : "Water" }}
              <button
                type="button"
                @click="toggleNote('levain.water')"
                @mouseenter="showNote('levain.water')"
                @mouseleave="hideNote"
                @focus="showNote('levain.water')"
                @blur="hideNote"
                class="ml-2 text-xs text-gray-400 hover:text-gray-700 focus:outline-none"
                :aria-expanded="activeNote === 'levain.water'"
                :aria-label="
                  showGreek
                    ? 'Σημείωση για το νερό του λεβέν'
                    : 'Note for levain water'
                "
              >
                <span class="sr-only">Show note</span>ℹ️
              </button>
              <div
                v-if="activeNote === 'levain.water'"
                class="mt-1 text-xs text-gray-600 bg-white border p-2 rounded shadow-sm w-64"
              >
                {{ notes["levain.water"][showGreek ? "gr" : "en"] }}
              </div>
            </td>
            <td class="p-2 text-right">{{ fmtGrams(levain.water) }}</td>
            <td class="p-2 text-right">
              {{ fmtGrams(levain.water / breads) }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Autolyse / Αυτόλυση -->
    <section class="prose text-sm">
      <h2 class="text-base font-semibold">
        {{ showGreek ? "Αυτόλυση" : "Autolyse" }}
      </h2>
      <p v-if="!showGreek">
        Mix the flour and water and let sit so the flour can absorb the water.
        This helps soften the flour.
      </p>
      <p v-else>
        Σε αυτό το στάδιο αναμειγνύεις το αλεύρι με το νερό και το αφήνεις να
        σταθεί ώστε το αλεύρι να απορροφήσει το νερό.
      </p>

      <table class="w-full text-sm mt-2 table-auto border-collapse">
        <thead>
          <tr class="bg-gray-50 text-left text-xs text-gray-600">
            <th class="p-2">{{ showGreek ? "Υλικό" : "Ingredient" }}</th>
            <th class="p-2 text-right">
              {{
                showGreek
                  ? "Δόση (" + breads + " ψωμ.)"
                  : "Amount (" + breads + " loaves)"
              }}
            </th>
            <th class="p-2 text-right">
              {{ showGreek ? "Ανά ψωμί" : "Per loaf" }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr>
            <td class="p-2">
              {{ showGreek ? "Αλεύρι" : "Flour" }}
              <button
                type="button"
                @click="toggleNote('autolyse.flour')"
                @mouseenter="showNote('autolyse.flour')"
                @mouseleave="hideNote"
                @focus="showNote('autolyse.flour')"
                @blur="hideNote"
                class="ml-2 text-xs text-gray-400 hover:text-gray-700 focus:outline-none"
                :aria-expanded="activeNote === 'autolyse.flour'"
                :aria-label="
                  showGreek
                    ? 'Σημείωση για αλεύρι αυτόλυσης'
                    : 'Note for autolyse flour'
                "
              >
                ℹ️
              </button>
              <div
                v-if="activeNote === 'autolyse.flour'"
                class="mt-1 text-xs text-gray-600 bg-white border p-2 rounded shadow-sm w-64"
              >
                {{ notes["autolyse.flour"][showGreek ? "gr" : "en"] }}
              </div>
            </td>
            <td class="p-2 text-right">{{ fmtGrams(autolyse.flour) }}</td>
            <td class="p-2 text-right">
              {{ fmtGrams(autolyse.flour / breads) }}
            </td>
          </tr>
          <tr>
            <td class="p-2">
              {{ showGreek ? "Νερό" : "Water" }}
              <button
                type="button"
                @click="toggleNote('autolyse.water')"
                @mouseenter="showNote('autolyse.water')"
                @mouseleave="hideNote"
                @focus="showNote('autolyse.water')"
                @blur="hideNote"
                class="ml-2 text-xs text-gray-400 hover:text-gray-700 focus:outline-none"
              >
                ℹ️
              </button>
              <div
                v-if="activeNote === 'autolyse.water'"
                class="mt-1 text-xs text-gray-600 bg-white border p-2 rounded shadow-sm w-64"
              >
                {{ notes["autolyse.water"][showGreek ? "gr" : "en"] }}
              </div>
            </td>
            <td class="p-2 text-right">{{ fmtGrams(autolyse.water) }}</td>
            <td class="p-2 text-right">
              {{ fmtGrams(autolyse.water / breads) }}
            </td>
          </tr>
        </tbody>
      </table>

      <p class="mt-2 text-sm text-gray-600">
        {{
          showGreek
            ? "Αν κάνεις 4 ψωμιά, ίσως θες να χωρίσεις τη ζύμη σε δύο μπολ για διαφορετικούς σπόρους."
            : "If you are making 4 loaves, consider dividing the dough into two bowls to add different seeds."
        }}
      </p>

      <h3 class="mt-4 font-semibold">
        {{ showGreek ? "Σύνθεση αλεύρων" : "Flour mix" }}
      </h3>
      <table class="w-full text-sm mt-2 table-auto border-collapse">
        <thead>
          <tr class="bg-gray-50 text-left text-xs text-gray-600">
            <th class="p-2">{{ showGreek ? "Υλικό" : "Ingredient" }}</th>
            <th class="p-2 text-right">
              {{
                showGreek
                  ? "Δόση (" + breads + " ψωμ.)"
                  : "Amount (" + breads + " loaves)"
              }}
            </th>
            <th class="p-2 text-right">
              {{ showGreek ? "Ανά ψωμί" : "Per loaf" }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr>
            <td class="p-2">
              {{ showGreek ? "Άσπρο αλεύρι" : "White flour" }}
              <button
                type="button"
                @click="toggleNote('flourMix.white')"
                @mouseenter="showNote('flourMix.white')"
                @mouseleave="hideNote"
                @focus="showNote('flourMix.white')"
                @blur="hideNote"
                class="ml-2 text-xs text-gray-400 hover:text-gray-700 focus:outline-none"
              >
                ℹ️
              </button>
              <div
                v-if="activeNote === 'flourMix.white'"
                class="mt-1 text-xs text-gray-600 bg-white border p-2 rounded shadow-sm w-64"
              >
                {{ notes["flourMix.white"][showGreek ? "gr" : "en"] }}
              </div>
            </td>
            <td class="p-2 text-right">{{ fmtGrams(flourMix.white) }}</td>
            <td class="p-2 text-right">
              {{ fmtGrams(flourMix.white / breads) }}
            </td>
          </tr>
          <tr>
            <td class="p-2">
              {{ showGreek ? "Αλεύρι ολικής" : "Whole wheat flour" }}
              <button
                type="button"
                @click="toggleNote('flourMix.whole')"
                @mouseenter="showNote('flourMix.whole')"
                @mouseleave="hideNote"
                @focus="showNote('flourMix.whole')"
                @blur="hideNote"
                class="ml-2 text-xs text-gray-400 hover:text-gray-700 focus:outline-none"
              >
                ℹ️
              </button>
              <div
                v-if="activeNote === 'flourMix.whole'"
                class="mt-1 text-xs text-gray-600 bg-white border p-2 rounded shadow-sm w-64"
              >
                {{ notes["flourMix.whole"][showGreek ? "gr" : "en"] }}
              </div>
            </td>
            <td class="p-2 text-right">{{ fmtGrams(flourMix.whole) }}</td>
            <td class="p-2 text-right">
              {{ fmtGrams(flourMix.whole / breads) }}
            </td>
          </tr>
          <tr>
            <td class="p-2">
              {{ showGreek ? "Νερό" : "Water" }}
              <button
                type="button"
                @click="toggleNote('flourMix.water')"
                @mouseenter="showNote('flourMix.water')"
                @mouseleave="hideNote"
                @focus="showNote('flourMix.water')"
                @blur="hideNote"
                class="ml-2 text-xs text-gray-400 hover:text-gray-700 focus:outline-none"
              >
                ℹ️
              </button>
              <div
                v-if="activeNote === 'flourMix.water'"
                class="mt-1 text-xs text-gray-600 bg-white border p-2 rounded shadow-sm w-64"
              >
                {{ notes["flourMix.water"][showGreek ? "gr" : "en"] }}
              </div>
            </td>
            <td class="p-2 text-right">{{ fmtGrams(flourMix.water) }}</td>
            <td class="p-2 text-right">
              {{ fmtGrams(flourMix.water / breads) }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Salt -->
    <section class="prose text-sm">
      <h2 class="text-base font-semibold">
        {{ showGreek ? "Αλάτι" : "Salt" }}
      </h2>
      <table class="w-full text-sm mt-2 table-auto border-collapse">
        <thead>
          <tr class="bg-gray-50 text-left text-xs text-gray-600">
            <th class="p-2">{{ showGreek ? "Υλικό" : "Ingredient" }}</th>
            <th class="p-2 text-right">
              {{
                showGreek
                  ? "Δόση (" + breads + " ψωμ.)"
                  : "Amount (" + breads + " loaves)"
              }}
            </th>
            <th class="p-2 text-right">
              {{ showGreek ? "Ανά ψωμί" : "Per loaf" }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr>
            <td class="p-2">
              {{ showGreek ? "Αλάτι" : "Salt" }}
              <button
                type="button"
                @click="toggleNote('salt')"
                @mouseenter="showNote('salt')"
                @mouseleave="hideNote"
                @focus="showNote('salt')"
                @blur="hideNote"
                class="ml-2 text-xs text-gray-400 hover:text-gray-700 focus:outline-none"
              >
                ℹ️
              </button>
              <div
                v-if="activeNote === 'salt'"
                class="mt-1 text-xs text-gray-600 bg-white border p-2 rounded shadow-sm w-64"
              >
                {{ notes["salt"][showGreek ? "gr" : "en"] }}
              </div>
            </td>
            <td class="p-2 text-right">{{ fmtGrams(salt) }}</td>
            <td class="p-2 text-right">{{ fmtGrams(salt / breads) }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Process / Steps -->
    <section class="prose text-sm">
      <h2 class="text-base font-semibold">
        {{ showGreek ? "Εκτέλεση" : "Instructions" }}
      </h2>

      <div v-if="!showGreek">
        <p>
          <strong>Start:</strong> Begin at 8:00 AM — Levain (mix and rest 5
          hours at ~26°C).
        </p>

        <h3 class="font-semibold mt-2">10:00 AM – Autolyse</h3>
        <p>
          Mix flour and water and let sit so flour absorbs water. If making 4
          loaves, divide into two bowls if you want different seeds.
        </p>

        <h3 class="font-semibold mt-2">11:30 AM – Add the Levain</h3>
        <p>
          Add levain to the flour/water mix and mix in gradually. Let rest 1
          hour. If making 4-loaf batch using two bowls, mix ~215 g levain per
          bowl.
        </p>

        <h3 class="font-semibold mt-2">12:30 PM – Salt</h3>
        <p>Add the salt and mix.</p>

        <h3 class="font-semibold mt-2">1:30 PM – Gluten Folds</h3>
        <p>
          Perform folds at 1:30, 2:00, 2:30. Optionally add seeds/olives/nuts
          during folds. 3:00 PM fourth set. 3:30 PM bulk fermentation — rest 2.5
          hours.
        </p>

        <h3 class="font-semibold mt-2">6:00 PM – Pre-shaping</h3>
        <p>Divide and shape into loaves. Rest 20 minutes.</p>

        <h3 class="font-semibold mt-2">
          6:20 PM – Final shaping & Refrigeration
        </h3>
        <p>
          Place each loaf into a bowl dusted with rice flour, cover and
          refrigerate for overnight bulk fermentation.
        </p>

        <h3 class="font-semibold mt-2">The Next Morning – Baking</h3>
        <p>
          Preheat oven to 260°C / 500°F for 40 minutes with Dutch oven inside.
          Bake covered 30 minutes, uncover and bake 10 more minutes. Cool on a
          rack.
        </p>
      </div>

      <div v-else>
        <p>
          <strong>Ξεκίνα:</strong> Ξεκίνα στις 8:00 πμ — Λεβέν (ανακατεύεις
          προζύμι και αλεύρι, ξεκούραση 5 ώρες σε ~26°C).
        </p>

        <h3 class="font-semibold mt-2">10:00 πμ – Αυτόλυση</h3>
        <p>
          Ανακάτεψε το αλεύρι με το νερό και άφησέ το να σταθεί ώστε να
          απορροφήσει το νερό. Αν κάνεις 4 ψωμιά, χώρισε σε δύο μπολ για
          διαφορετικούς σπόρους.
        </p>

        <h3 class="font-semibold mt-2">11:30 πμ – Προσθήκη Λεβέν</h3>
        <p>
          Πρόσθεσε το λεβέν στο μείγμα αλευριού/νερού και ανακάτεψε σταδιακά.
          Άφησέ το 1 ώρα. Σε δόση για 4 ψωμιά και δύο μπολ, βάλε ~215 g λεβέν σε
          κάθε μπολ.
        </p>

        <h3 class="font-semibold mt-2">12:30 μμ – Αλάτι</h3>
        <p>Πρόσθεσε το αλάτι και ανακάτεψε.</p>

        <h3 class="font-semibold mt-2">13:30 μμ – Διπλώματα Γλουτένης</h3>
        <p>
          Κάνε διπλώματα στις 13:30, 14:00, 14:30. Πρόσθεσε σπόρους/ελιά/ξηρούς
          καρπούς αν θέλεις. 15:00 τέταρτο σετ. 15:30 Μαζική Ζύμωση — ξεκούραση
          2,5 ώρες.
        </p>

        <h3 class="font-semibold mt-2">18:00 μμ – Προ-Σχηματισμός</h3>
        <p>Χώρισε και πλάσε σε δύο καρβέλια. Ξεκουράσου 20 λεπτά.</p>

        <h3 class="font-semibold mt-2">18:20 μμ – Σχηματισμός & Ψύξη</h3>
        <p>
          Βάλε κάθε καρβέλι σε αλευρωμένο μπολ (ρυζάλευρο προτιμητέο) και
          σκέπασε. Ψήσε την επόμενη μέρα μετά από νυχτερινή ζύμωση.
        </p>

        <h3 class="font-semibold mt-2">Την επόμενη μέρα – Ψήσιμο</h3>
        <p>
          Προθέρμανε το φούρνο στους 260°C για 40 λεπτά με γάστρα μέσα. Ψήσε
          σκεπασμένο 30 λεπτά, μετά 10 λεπτά ακάλυπτο. Αφήστε να κρυώσει σε
          σχάρα.
        </p>
      </div>
    </section>

    <footer class="text-xs text-gray-500">
      {{ showGreek ? "Μερίδες: ανάλογα" : "Serves: variable" }}
    </footer>
  </main>
</template>

<script setup>
import { ref, computed, onUnmounted } from "vue";
import ingredientsImg from "../../assets/paintings/clove.jpeg";

const showGreek = ref(false);
const toggleLanguage = () => {
  showGreek.value = !showGreek.value;
};

const breads = ref(2);

const multiplier = computed(() => breads.value / 2);

// Base amounts (for 2 breads)
const levainBase = { starter: 50, flour: 100, water: 65 };
const autolyseBase = { flour: 1000, water: 800 };
const flourMixBase = { white: 800, whole: 200, water: 800 };
const saltBase = 20;

const round = (v) => Math.round(v);
const fmtGrams = (v) => `${round(v)} g`;

const levain = computed(() => ({
  starter: levainBase.starter * multiplier.value,
  flour: levainBase.flour * multiplier.value,
  water: levainBase.water * multiplier.value,
}));

const autolyse = computed(() => ({
  flour: autolyseBase.flour * multiplier.value,
  water: autolyseBase.water * multiplier.value,
}));

const flourMix = computed(() => ({
  white: flourMixBase.white * multiplier.value,
  whole: flourMixBase.whole * multiplier.value,
  water: flourMixBase.water * multiplier.value,
}));

const salt = computed(() => saltBase * multiplier.value);

// Tooltip / helper state for ingredient notes
const activeNote = ref(null);
const showNote = (id) => {
  activeNote.value = id;
};
const hideNote = () => {
  activeNote.value = null;
};
const toggleNote = (id) => {
  activeNote.value = activeNote.value === id ? null : id;
};

const notes = {
  "levain.starter": {
    en: "Use starter fed the previous night; levain will be slightly stiff and can be shaped into a ball.",
    gr: "Χρησιμοποίησε προζύμι ταϊσμένο το προηγούμενο βράδυ. Το λεβέν θα είναι λίγο πιο σφιχτό και μπορείς να του δώσεις σχήμα.",
  },
  "levain.flour": {
    en: "Use fresh flour (all-purpose or bread flour) for the levain.",
    gr: "Χρησιμοποίησε καινούριο αλεύρι (για όλες τις χρήσεις ή για ψωμί) για το λεβέν.",
  },
  "levain.water": {
    en: "Room-temperature water helps activity without shocking the starter.",
    gr: 'Νερό σε θερμοκρασία δωματίου βοηθά τη δραστηριότητα χωρίς να "σοκάρει" το προζύμι.',
  },
  "autolyse.flour": {
    en: "Use the specified flour for autolyse so it hydrates evenly.",
    gr: "Χρησιμοποίησε το καθορισμένο αλεύρι για την αυτόλυση ώστε να απορροφηθεί ομοιόμορφα.",
  },
  "autolyse.water": {
    en: "Adjust water to reach the desired dough consistency (hydration).",
    gr: "Προσαρμόστε το νερό για να επιτύχετε την επιθυμητή σύσταση της ζύμης.",
  },
  "flourMix.white": {
    en: "White flour gives a lighter crumb; adjust whole wheat % to taste.",
    gr: "Το άσπρο αλεύρι δίνει πιο ελαφρύ ψίχουλο· προσαρμόστε το ποσοστό ολικής κατά βούληση.",
  },
  "flourMix.whole": {
    en: "Whole wheat will make the dough stiffer and reduce rise slightly.",
    gr: "Η ολικής αλέσεως θα σφίξει τη ζύμη και θα μειώσει κάπως το φούσκωμα.",
  },
  "flourMix.water": {
    en: "Water listed is total for the mix; tweak for hydration preferences.",
    gr: "Το νερό είναι συνολικό για το μείγμα· ρυθμίστε ανάλογα την υγρασία που προτιμάτε.",
  },
  salt: {
    en: "Salt strengthens gluten and adds flavor; do not add too much.",
    gr: "Το αλάτι ενισχύει τη γλουτένη και προσθέτει γεύση· μη βάζετε υπερβολική ποσότητα.",
  },
};
</script>
