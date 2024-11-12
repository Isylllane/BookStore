<script setup>
// Импорт компонентов
import Card from "@/components/Card.vue";
// Импорт модулей
import { ref, onMounted, computed, shallowRef, watchEffect, watch } from "vue";
// Импорт хранилищ Pinia
import { useStoreBooks } from "@/stores/useStoreBooks.js";

// Инициализация хранилища книг и реактивных переменных
const store = useStoreBooks();
const books = ref([]); // Список книг

const itemsPerPage = 8; // Количество элементов на странице
const currentPage = ref(1); // Текущая страница
const isLoading = shallowRef(true); // Состояние загрузки
const dialog = shallowRef(false); // Состояние диалога

// Загрузка книг при монтировании компонента
onMounted(async () => {
  await store.getBooks();
  books.value = store.books.reverse(); // Обратный порядок книг
  isLoading.value = false; // Загрузка завершена
});

const sortType = ref("Сначала новинки"); // Тип сортировки
const selectedTypes = ref([]); // Выбранные типы книг
const selectedYears = ref([]); // Выбранные годы
const selectedAuthors = ref([]); // Выбранные авторы

const searchType = ref(""); // Поиск по типам
const searchYear = ref(""); // Поиск по годам
const searchAuthor = ref(""); // Поиск по авторам

// Фильтрация книг по выбранным фильтрам
const filterBooks = (book) => {
  const priceInRange =
    book.specification.price >= rangePrice.value[0] &&
    book.specification.price <= rangePrice.value[1];
  return (
    (selectedTypes.value.length === 0 ||
      selectedTypes.value.includes(book.specification.type)) &&
    (selectedYears.value.length === 0 ||
      selectedYears.value.map(Number).includes(book.specification.year)) &&
    (selectedAuthors.value.length === 0 ||
      selectedAuthors.value.includes(book.author)) &&
    priceInRange
  );
};

// Сортировка книг по цене
const sortBooks = (a, b) => {
  if (sortType.value === "Сначала дешёвые") {
    return a.specification.price - b.specification.price;
  } else if (sortType.value === "Сначала дорогие") {
    return b.specification.price - a.specification.price;
  } else {
    return 0;
  }
};

// Комбинированная фильтрация и сортировка книг
const filteredBooks = computed(() =>
  books.value.filter(filterBooks).sort(sortBooks)
);

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredBooks.value.slice(start, end);
});

// Получение всех типов книг для фильтрации
const allTypes = computed(() =>
  Array.from(new Set(books.value.map((book) => book.specification.type))).map(
    (type) => ({
      type,
    })
  )
);

// Получение всех годов публикации для фильтрации
const allYears = computed(() =>
  Array.from(new Set(books.value.map((book) => book.specification.year)))
    .sort((a, b) => b - a)
    .map((year) => ({
      year,
    }))
);

// Получение всех авторов для фильтрации
const allAuthors = computed(() =>
  Array.from(new Set(books.value.map((book) => book.author))).map((author) => ({
    author,
  }))
);

const rangePrice = ref([0, 0]); // Диапазон цен

const prices = computed(() =>
  books.value.map((book) => book.specification.price)
);
const minPrice = computed(() =>
  prices.value.length ? Math.min(...prices.value) : -1
);
const maxPrice = computed(() =>
  prices.value.length ? Math.max(...prices.value) : -1
);

// Автоматическое обновление диапазона цен при изменении минимальной и максимальной цены
watchEffect(() => {
  if (minPrice.value !== -1 && maxPrice.value !== -1) {
    rangePrice.value = [minPrice.value, maxPrice.value];
  }
});

// Сброс фильтров
const resetFilters = () => {
  selectedTypes.value = [];
  selectedYears.value = [];
  selectedAuthors.value = [];
  rangePrice.value = [minPrice.value, maxPrice.value];
};

// Переключение меню фильтров в мобильной версии
const toggleDialog = () => {
  dialog.value = !dialog.value;
};

const showTypes = ref(false); // Показать типы
const showYears = ref(false); // Показать годы
const showAuthors = ref(false); // Показать авторов
const showPrice = ref(false); // Показать цены
</script>

<template>
  <v-dialog
    v-model="dialog"
    v-if="$vuetify.display.mdAndDown"
    transition="dialog-bottom-transition"
    fullscreen
    class="mt-26"
  >
    <v-toolbar class="rounded-t-lg" style="z-index: 1000">
      <v-app-bar-nav-icon
        icon="mdi-close"
        @click="toggleDialog"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>Фильтры</v-toolbar-title>

      <v-spacer />
      <v-toolbar-items>
        <v-btn
          color="primary"
          text="Сбросить"
          class="text-none pa-2 font-weight-bold"
          @click="resetFilters(), toggleDialog()"
        ></v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-card class="pb-16">
      <v-card-text>
        <!-- Фильтры -->
        <v-card class="pt-2" title="Категория книги" flat>
          <template v-slot:text>
            <v-text-field
              v-model="searchType"
              placeholder="Поиск..."
              density="compact"
              variant="outlined"
              color="primary"
              base-color="primary"
              prepend-inner-icon="mdi-magnify"
              hide-details
              single-line
            ></v-text-field>
          </template>

          <v-data-table
            :items="allTypes"
            :search="searchType"
            class="row-height-40"
            no-data-text="По этому запросу ничего не нашлось"
            :headers="[{ key: 'type' }]"
            :item-value="(item) => `${item.type}`"
            v-model="selectedTypes"
            :items-per-page="showTypes ? -1 : 5"
            show-select
            hide-default-header
            hide-default-footer
            disable-sort
          >
          </v-data-table>
          <v-card-actions class="d-flex justify-center">
            <v-btn
              color="primary"
              variant="text"
              class="text-none pa-2"
              @click="showTypes = !showTypes"
              border
              >{{ showTypes ? "Скрыть жанры" : "Все жанры" }}</v-btn
            >
          </v-card-actions>
        </v-card>

        <v-card class="pt-2" title="Год издания" flat>
          <template v-slot:text>
            <v-text-field
              v-model="searchYear"
              placeholder="Поиск..."
              density="compact"
              variant="outlined"
              color="primary"
              base-color="primary"
              prepend-inner-icon="mdi-magnify"
              hide-details
              single-line
            ></v-text-field>
          </template>

          <v-data-table
            class="row-height-40"
            :items="allYears"
            :search="searchYear"
            no-data-text="По этому запросу ничего не нашлось"
            :headers="[{ key: 'year' }]"
            :item-value="(item) => `${item.year}`"
            v-model="selectedYears"
            :items-per-page="showYears ? -1 : 5"
            show-select
            hide-default-header
            hide-default-footer
            disable-sort
          >
          </v-data-table>
          <v-card-actions class="d-flex justify-center">
            <v-btn
              color="primary"
              variant="text"
              class="text-none pa-2"
              @click="showYears = !showYears"
              border
              >{{
                showYears ? "Скрыть годы издания" : "Все годы издания"
              }}</v-btn
            >
          </v-card-actions>
        </v-card>

        <v-card class="pt-2" title="Авторы" flat>
          <template v-slot:text>
            <v-text-field
              v-model="searchAuthor"
              placeholder="Поиск..."
              density="compact"
              variant="outlined"
              color="primary"
              base-color="primary"
              prepend-inner-icon="mdi-magnify"
              hide-details
              single-line
            ></v-text-field>
          </template>

          <v-data-table
            class="row-height-40"
            :items="allAuthors"
            :search="searchAuthor"
            no-data-text="По этому запросу ничего не нашлось"
            :headers="[{ key: 'author' }]"
            :item-value="(item) => `${item.author}`"
            v-model="selectedAuthors"
            :items-per-page="showAuthors ? -1 : 5"
            show-select
            hide-default-header
            hide-default-footer
            disable-sort
          >
          </v-data-table>
          <v-card-actions class="d-flex justify-center">
            <v-btn
              color="primary"
              variant="text"
              class="text-none pa-2"
              @click="showAuthors = !showAuthors"
              border
              >{{ showAuthors ? "Скрыть авторов" : "Все авторы" }}</v-btn
            >
          </v-card-actions>
        </v-card>

        <div class="pt-2">Цена</div>
        <div class="py-1 py-sm-4">
          <v-range-slider
            v-model="rangePrice"
            :max="maxPrice"
            :min="minPrice"
            color="primary"
            :step="1"
            thumb-color="grey-lighten-4"
          ></v-range-slider>
          <div class="d-flex ga-3">
            <v-text-field
              v-model="rangePrice[0]"
              type="number"
              prefix="от"
              min="0"
              onkeydown="return event.key !== '-'"
              density="compact"
              variant="outlined"
              color="primary"
              base-color="primary"
            ></v-text-field>
            <v-text-field
              v-model="rangePrice[1]"
              type="number"
              prefix="до"
              min="0"
              onkeydown="return event.key !== '-'"
              density="compact"
              variant="outlined"
              color="primary"
              base-color="primary"
            ></v-text-field>
          </div>
        </div>

        <v-btn
          color="primary"
          class="rounded-lg text-none w-100 mt-5"
          size="large"
          variant="elevated"
          @click="toggleDialog()"
          >Применить</v-btn
        >
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-container max-width="1260">
    <div class="text-h5 text-sm-h4 font-weight-bold md-2 mb-sm-5">Каталог</div>
    <v-row>
      <v-col cols="12" md="3" v-if="$vuetify.display.mdAndUp">
        <div
          v-if="
            allTypes.length === 0 ||
            allYears.length === 0 ||
            allAuthors.length === 0 ||
            rangePrice.length === 0
          "
        >
          <div class="text-center mt-10">
            <v-progress-circular
              color="primary"
              indeterminate
            ></v-progress-circular>
          </div>
        </div>
        <div v-else>
          <!-- Фильтры -->
          <v-card class="pt-2" title="Категория книги" flat>
            <template v-slot:text>
              <v-text-field
                v-model="searchType"
                placeholder="Поиск..."
                density="compact"
                variant="outlined"
                color="primary"
                base-color="primary"
                prepend-inner-icon="mdi-magnify"
                hide-details
                single-line
              ></v-text-field>
            </template>

            <v-data-table
              :items="allTypes"
              :search="searchType"
              class="row-height-40"
              no-data-text="По этому запросу ничего не нашлось"
              :headers="[{ key: 'type' }]"
              :item-value="(item) => `${item.type}`"
              v-model="selectedTypes"
              :items-per-page="showTypes ? -1 : 5"
              show-select
              hide-default-header
              hide-default-footer
              disable-sort
            >
            </v-data-table>

            <v-card-actions class="d-flex justify-center">
              <v-btn
                color="primary"
                variant="text"
                class="text-none pa-2"
                @click="showTypes = !showTypes"
                border
                >{{ showTypes ? "Скрыть жанры" : "Все жанры" }}</v-btn
              >
            </v-card-actions>
          </v-card>

          <v-card class="pt-2" title="Год издания" flat>
            <template v-slot:text>
              <v-text-field
                v-model="searchYear"
                placeholder="Поиск..."
                density="compact"
                variant="outlined"
                color="primary"
                base-color="primary"
                prepend-inner-icon="mdi-magnify"
                hide-details
                single-line
              ></v-text-field>
            </template>

            <v-data-table
              class="row-height-40"
              :items="allYears"
              :search="searchYear"
              no-data-text="По этому запросу ничего не нашлось"
              :headers="[{ key: 'year' }]"
              :item-value="(item) => `${item.year}`"
              v-model="selectedYears"
              :items-per-page="showYears ? -1 : 5"
              show-select
              hide-default-header
              hide-default-footer
              disable-sort
            >
            </v-data-table>
            <v-card-actions class="d-flex justify-center">
              <v-btn
                color="primary"
                variant="text"
                class="text-none pa-2"
                @click="showYears = !showYears"
                border
                >{{
                  showYears ? "Скрыть годы издания" : "Все годы издания"
                }}</v-btn
              >
            </v-card-actions>
          </v-card>

          <v-card class="pt-2" title="Авторы" flat>
            <template v-slot:text>
              <v-text-field
                v-model="searchAuthor"
                placeholder="Поиск..."
                density="compact"
                variant="outlined"
                color="primary"
                base-color="primary"
                prepend-inner-icon="mdi-magnify"
                hide-details
                single-line
              ></v-text-field>
            </template>

            <v-data-table
              class="row-height-40"
              :items="allAuthors"
              :search="searchAuthor"
              no-data-text="По этому запросу ничего не нашлось"
              :headers="[{ key: 'author' }]"
              :item-value="(item) => `${item.author}`"
              v-model="selectedAuthors"
              :items-per-page="showAuthors ? -1 : 5"
              show-select
              hide-default-header
              hide-default-footer
              disable-sort
            >
            </v-data-table>
            <v-card-actions class="d-flex justify-center">
              <v-btn
                color="primary"
                variant="text"
                class="text-none pa-2"
                @click="showAuthors = !showAuthors"
                border
                >{{ showAuthors ? "Скрыть авторов" : "Все авторы" }}</v-btn
              >
            </v-card-actions>
          </v-card>

          <div class="pt-2">Цена</div>
          <div class="py-1 py-sm-4">
            <v-range-slider
              v-model="rangePrice"
              :max="maxPrice"
              :min="minPrice"
              color="primary"
              :step="1"
              thumb-color="grey-lighten-4"
            ></v-range-slider>
            <div class="d-flex ga-3">
              <v-text-field
                v-model="rangePrice[0]"
                type="number"
                prefix="от"
                min="0"
                onkeydown="return event.key !== '-'"
                density="compact"
                variant="outlined"
                color="primary"
                base-color="primary"
              ></v-text-field>
              <v-text-field
                v-model="rangePrice[1]"
                type="number"
                prefix="до"
                min="0"
                onkeydown="return event.key !== '-'"
                density="compact"
                variant="outlined"
                color="primary"
                base-color="primary"
              ></v-text-field>
            </div>
          </div>

          <div class="pt-5 d-flex justify-center">
            <v-btn
              color="primary"
              text="Сбросить все фильтры"
              variant="text"
              class="text-none pa-2"
              @click="resetFilters()"
              border
            ></v-btn>
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="9">
        <div class="d-flex justify-space-between py-5">
          <v-select
            class="d-flex justify-md-end"
            v-model="sortType"
            density="compact"
            variant="outlined"
            color="primary"
            base-color="primary"
            @change="filteredBooks"
            :menu-props="{ closeOnContentClick: true }"
            :items="['Сначала новинки', 'Сначала дешёвые', 'Сначала дорогие']"
          ></v-select>

          <div class="d-flex align-center d-md-none">
            <v-btn
              class="text-none h-100 text-base"
              rounded="lg"
              @click="toggleDialog"
              color="primary"
              variant="tonal"
              icon="mdi-filter-variant-plus"
            />
          </div>
        </div>

        <v-row>
          <template v-if="isLoading">
            <v-col v-for="i in 8" :key="i" cols="6" xs="6" sm="4" md="3">
              <v-skeleton-loader
                max-width="170"
                min-width="150"
                type="image,list-item-two-line, actions"
              ></v-skeleton-loader>
            </v-col>
          </template>

          <template v-else-if="filteredBooks.length === 0">
            <v-col cols="12">
              <v-empty-state>
                <template v-slot:media>
                  <v-icon
                    icon="mdi-book-search"
                    color="primary"
                    class="mb-3"
                  ></v-icon>
                </template>

                <template v-slot:headline>
                  <div class="text-h5 text-sm-h4">
                    Мы не нашли книг с такими параметрами.
                  </div>
                </template>

                <template v-slot:title>
                  <div class="mt-3">
                    <p>Попробуйте убрать один или несколько фильтров.</p>
                  </div>
                </template>
                <template v-slot:actions>
                  <v-btn
                    color="primary"
                    text="Сбросить все фильтры"
                    class="text-none text-h6"
                    size="large"
                    @click="resetFilters()"
                    variant="outlined"
                  ></v-btn>
                </template>
              </v-empty-state>
            </v-col>
          </template>
          <template v-else>
            <v-col
              v-for="book in paginatedBooks"
              :key="book.id"
              cols="6"
              xs="6"
              sm="4"
              md="4"
              lg="3"
            >
              <Card :book="book" />
            </v-col>
          </template>
        </v-row>
        <v-pagination
          v-model="currentPage"
          :length="Math.ceil((filteredBooks || []).length / itemsPerPage)"
          :total-visible="7"
          color="primary"
        ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.mt-26 {
  margin-top: 104px;
}
::v-deep .v-data-table.row-height-40 tr {
  height: 40px !important;
  border: none !important;
}
::v-deep .v-data-table.row-height-40 td {
  height: 40px !important;
  border: none !important;
}
</style>
