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
  return store.books;
});
onMounted(() => {
  store.getBooks();
});

// Поиск
const handleBookClick = (id) => {
  router.replace(`/books/${id}`);
};
</script>

<template>
  <v-autocomplete
    :items="books"
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
      <v-list-item @click="handleBookClick(item.raw.id)">
        {{ item.title }}
      </v-list-item>
    </template>
  </v-autocomplete>
</template>
