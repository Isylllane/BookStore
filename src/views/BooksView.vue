<script setup>
// Импорт компонентов
import Card from "@/components/Card.vue";
// Импорт модулей
import { ref, onMounted, computed } from "vue";
// Импорт хранилищ pinia
import { useStoreBooks } from "@/stores/useStoreBooks.js";
const store = useStoreBooks();

// Импорт информации о книгах из хранилища
const books = computed(() => {
  return store.books;
});

onMounted(() => {
  store.getBooks();
});

const expand = ref(false); // Показать фильтры

// Фильтр всех книг по убыванию или возрастанию
const sortType = ref("Сначала новинки");

const sortedBooks = computed(() => {
  if (sortType.value === "Сначала дешёвые") {
    return [...books.value].sort(
      (a, b) => a.specification.price - b.specification.price
    );
  } else if (sortType.value === "Сначала дорогие") {
    return [...books.value].sort(
      (a, b) => b.specification.price - a.specification.price
    );
  } else if (sortType.value === "Сначала новинки") {
    return [...books.value].reverse();
  }

  return [...books.value];
});
// Получение всех категорий товаров
const allTypes = computed(() => {
  return [...new Set(books.value.map((book) => book.specification.type))];
});

const allYears = computed(() => {
  const uniqueYears = [
    ...new Set(books.value.map((book) => book.specification.year)),
  ];
  return uniqueYears.sort((a, b) => b - a); // Sort in descending order
});

const allAuthors = computed(() => {
  return [...new Set(books.value.map((book) => book.author))];
});

// allAuthors = authors;
// allYears = years;

const applyFilters = computed((selectedTypes) => {
  // Фильтрация книг по выбранным авторам и годам
  sortedBooks.value = sortedBooks.value.filter((book) => {
    return selectedAuthors.value.includes(book.author);
  });
});
const selectedAuthors = ref([]);

const selectedTypes = ref([]);
</script>

<template>
  <v-container max-width="1260">
    <div class="text-h5 text-sm-h4 font-weight-bold md-2 mb-sm-5">Каталог</div>
    <v-btn @click="console.log(selectedTypes)"> тест </v-btn>
    <div class="d-flex justify-space-between py-3">
      <div class="d-flex">
        <v-select
          class="pb-2"
          v-model="sortType"
          density="compact"
          variant="outlined"
          color="primary"
          base-color="primary"
          @change="sortedBooks"
          :items="['Сначала новинки', 'Сначала дешёвые', 'Сначала дорогие']"
        ></v-select>
      </div>
      <v-btn icon="mdi-filter" @click="expand = !expand"> </v-btn>
    </div>
    <v-lazy
      :options="{ threshold: 0.5 }"
      transition="fade-transition"
      :min-height="100"
    >
      <v-expand-transition>
        <div v-show="expand">
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <div>Категория книги</div>
                <div class="py-1 py-sm-4">
                  <v-virtual-scroll height="150" :items="allTypes">
                    <template v-slot:default="{ item }">
                      <v-checkbox
                        :label="item"
                        density="compact"
                        v-model="selectedTypes"
                        :value="item"
                        color="primary"
                      ></v-checkbox>
                    </template>
                  </v-virtual-scroll>
                </div>
              </v-col>
              <v-divider vertical class="d-none d-sm-block" inset></v-divider>
              <v-col cols="12" sm="6" md="3">
                <div>Год издания</div>
                <div class="py-1 py-sm-4">
                  <v-virtual-scroll height="150" :items="allYears">
                    <template v-slot:default="{ item }">
                      <v-checkbox
                        density="compact"
                        color="primary"
                        :label="String(item)"
                      ></v-checkbox>
                    </template>
                  </v-virtual-scroll>
                </div>
              </v-col>
              <v-divider vertical class="d-none d-md-block" inset></v-divider>

              <v-col cols="12" sm="6" md="3">
                <div>Автор</div>
                <div class="py-1 py-sm-4">
                  <v-virtual-scroll height="150" :items="allAuthors">
                    <template v-slot:default="{ item }">
                      <v-checkbox
                        density="compact"
                        color="primary"
                        v-model="selectedAuthors"
                        :label="String(item)"
                        :value="item"
                      ></v-checkbox>
                    </template>
                  </v-virtual-scroll>
                </div>
              </v-col>
              <v-divider vertical class="d-none d-sm-block" inset></v-divider>
              <v-col cols="12" sm="6" md="3" lg="3">
                <div>Цена</div>

                <div class="py-1 py-sm-4">
                  <v-virtual-scroll height="150" :items="allYears">
                    <template v-slot:default="{ item }">
                      <v-checkbox
                        density="compact"
                        color="primary"
                        :label="String(item)"
                      ></v-checkbox>
                    </template>
                  </v-virtual-scroll>
                </div>
              </v-col>
            </v-row>
          </v-container>
          <v-divider></v-divider>
        </div>
      </v-expand-transition>
    </v-lazy>

    <v-row>
      <template v-if="sortedBooks.length > 0">
        <v-col
          v-for="book in sortedBooks"
          :key="book.id"
          cols="6"
          xs="6"
          sm="4"
          md="3"
          lg="2"
        >
          <!-- Отображение карточек книг -->

          <Card :book="book" />
        </v-col>
      </template>

      <template v-else>
        <v-col
          v-for="i in 20"
          :key="i"
          cols="6"
          xs="6"
          sm="4"
          md="3"
          lg="2"
          xl="auto"
        >
          <!-- Skeleton loaders для каждого элемента -->
          <v-skeleton-loader
            max-width="210"
            min-width="150"
            type="image,list-item-two-line, actions"
          >
          </v-skeleton-loader>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>
