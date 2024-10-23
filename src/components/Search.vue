<script setup>
// Импорт модулей
import { computed, onMounted } from "vue"; // Функция для создания реактивности
import { useRoute, useRouter } from "vue-router";
// Импорт хранилищ pinia
import { useStoreBooks } from "@/stores/useStoreBooks.js";

const router = useRouter();

// Импорт информации о книгах из хранилища

const store = useStoreBooks();

const books = computed(() => {
  return store.books.slice(0, 10);
});
onMounted(() => {
  store.getBooks();
});

// Поиск
const handleBookClick = (id) => {
  document.activeElement && document.activeElement.blur(); // Скрыть экранную клавиатуру
  router.replace(`/books/${id}`);
};
</script>

<template>
  <!-- <v-text-field
        append-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        label="Поиск книги"
        hide-details
        color="primary"
        single-line
      >
      </v-text-field> -->
  <v-autocomplete
    :items="books"
    class="mx-auto"
    density="compact"
    menu-icon=""
    hide-details
    validate-on="lazy"
    placeholder="Поиск книги"
    append-inner-icon="mdi-magnify"
    variant="outlined"
    color="primary"
    base-color="primary"
    clearable
    clear-icon="mdi-close"
    no-data-text="Мы не нашли такой товар"
    :menu-props="{ closeOnContentClick: true }"
  >
    <template v-slot:item="{ item }">
      <v-list-item @click="handleBookClick(item.raw.id)" width="500px">
        {{ item.title }}</v-list-item
      >
    </template>
  </v-autocomplete>
</template>
