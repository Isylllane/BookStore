<script setup>
// Импорт компонентов
import Card from "@/components/Card.vue";
// Импорт модулей
import { ref, onMounted, computed, shallowRef } from "vue";
import { useRouter } from "vue-router";

// Импорт хранилищ pinia
import { useStoreBooks } from "@/stores/useStoreBooks.js";
const store = useStoreBooks();

const router = useRouter();

// Импорт информации о книгах из хранилища
const books = ref([]);
const isLoading = shallowRef(false);

onMounted(async () => {
  await store.getBooks();
  books.value = store.books.reverse().slice(0, 10);
  isLoading.value = true;
});

const createBook = () => {
  router.push({
    path: "/books/add",
    query: { testbook: true },
  });
};
</script>

<template>
  <v-container max-width="1260">
    <v-row>
      <v-col cols="12" md="6">
        <v-sheet
          class="pa-4 text-center mx-auto bg-grey-lighten-5"
          rounded="lg"
          border
        >
          <h2 class="text-h5 mb-3 text-start">Для посетителей сайта</h2>

          <p class="mb-4 text-medium-emphasis text-body-2 text-start">
            Посмотрите все доступные книги в удобном каталоге!
          </p>

          <div class="text-start">
            <v-btn
              to="/books/"
              class="text-none"
              color="success"
              variant="flat"
              rounded
            >
              Смотреть каталог
            </v-btn>
          </div>
        </v-sheet>
      </v-col>

      <v-col cols="12" md="6">
        <v-sheet
          class="pa-4 text-center mx-auto bg-light-green-lighten-5"
          rounded="lg"
          border
        >
          <h2 class="text-h5 mb-3 text-start">Генерация тестовых книг</h2>

          <p class="mb-4 text-medium-emphasis text-body-2 text-start">
            Создание тестовой книги
          </p>

          <div class="text-start">
            <v-btn
              class="text-none"
              @click="createBook"
              color="success"
              variant="flat"
              rounded
            >
              Создать книгу
            </v-btn>
          </div>
        </v-sheet>
      </v-col>
    </v-row>

    <div class="d-flex justify-space-between py-5">
      <h1 class="text-h4">Новинки</h1>

      <div class="d-flex align-center">
        <v-btn
          class="text-none h-100 text-base"
          rounded="lg"
          slim
          text="Смотреть все"
          variant="text"
          to="/books/"
          append-icon="mdi-arrow-right-thick"
        />
      </div>
    </div>

    <v-slide-group show-arrows="desktop" mobile-breakpoint="md">
      <template v-if="isLoading">
        <!-- Отображение карточек книг -->
        <div v-for="book in books" :key="book.id" class="mr-3">
          <Card :book="book" />
        </div>
      </template>
      <template v-else>
        <!-- Skeleton loaders для каждого элемента -->
        <div v-for="i in 10" :key="i" class="mr-3">
          <v-skeleton-loader
            width="160"
            type="image, list-item-two-line, actions"
          ></v-skeleton-loader>
        </div>
      </template>
    </v-slide-group>
  </v-container>
</template>
