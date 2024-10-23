<script setup>
// Импорт компонентов

// Импорт модулей
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, reactive, computed } from "vue";
import axios from "axios";

// Импорт хранилищ pinia
import { useStoreBooks } from "@/stores/useStoreBooks.js";
const store = useStoreBooks();

const route = useRoute();
const router = useRouter();

let bookId = route.params.id;
const showField = ref(false); // Изначально поле скрыто

const required = computed(() => {
  return (value) => !!value || "Поле обязательно для заполнения";
});

// Инициализация book как null
const book = ref(null);

const form = reactive({
  title: "",
  author: "",
  description: "",
  specification: {
    type: "",
    binding: "",
    year: 0,
    pages: 0,
    price: 0,
    sale: 0,
  },
});

// Импорт информации о книгах из хранилища и заполнение полей
onMounted(async () => {
  try {
    await store.getBook(bookId);
    book.value = store.book;
    // Заполнение входных данных
    form.title = book.value.title;
    form.author = book.value.author;
    form.description = book.value.description;
    form.specification.type = book.value.specification.type;
    form.specification.binding = book.value.specification.binding;
    form.specification.year = book.value.specification.year;
    form.specification.pages = book.value.specification.pages;
    form.specification.price = book.value.specification.price;
    form.specification.sale = book.value.specification.sale;
  } catch (error) {
    console.error("Ошибка при получении книги", error);
  }
});

// Обновление базы данных
const handleSubmit = async () => {
  const updateJob = {
    title: form.title,
    author: form.author,
    cover:
      "https://ndc.bookvoed.ru/resize/1024x1024/pim/products/images/97/9e/018f60da-7c2a-7863-96cd-809296c9979e.jpg",
    description: form.description,
    specification: {
      type: form.specification.type,
      year: form.specification.year,
      pages: form.specification.pages,
      binding: form.specification.binding,
      price: form.specification.price,
      sale: form.specification.sale,
    },
  };

  try {
    const response = await axios.patch(`${store.api}/${bookId}`, updateJob);

    router.push(`/books/${response.data.id}`);
  } catch (error) {
    console.error("Ошибка при изменении книги", error);
  }
};
</script>

<template>
  <v-container max-width="650px" class="py-16"
    ><v-card class="py-8 px-6" :elevation="1" border rounded v-if="book">
      <div class="text-center text-h5 py-2 px-4">
        Изменить книгу «{{ book.title }}»
      </div>
      <form @submit.prevent="handleSubmit">
        <p class="mb-3 font-weight-bold">Категория книги</p>

        <v-select
          v-model="form.specification.type"
          class="pb-2"
          density="compact"
          variant="outlined"
          color="primary"
          base-color="primary"
          required
          :items="[
            'Хобби и досуг',
            'Научно-популярная литература',
            'Художественная литература',
          ]"
        ></v-select>
        <p class="mb-3 font-weight-bold">Название книги</p>
        <v-text-field
          v-model="form.title"
          class="pb-2"
          placeholder="Название"
          density="compact"
          variant="outlined"
          color="primary"
          base-color="primary"
          required
        ></v-text-field>
        <p class="mb-3 font-weight-bold">Автор книги</p>
        <v-text-field
          v-model="form.author"
          class="pb-2"
          placeholder="Введите автора"
          density="compact"
          variant="outlined"
          color="primary"
          base-color="primary"
          required
        ></v-text-field>
        <p class="mb-3 font-weight-bold">Описание</p>
        <v-textarea
          v-model="form.description"
          class="pb-2"
          placeholder="Напишите про книгу подробнее"
          density="compact"
          variant="outlined"
          color="primary"
          base-color="primary"
          required
        ></v-textarea>
        <div class="text-h6 font-weight-bold mb-2">Характеристики</div>
        <p class="mb-3 font-weight-bold">Цена</p>
        <v-text-field
          v-model="form.specification.price"
          class="pb-2"
          placeholder="Стоимость в рублях"
          type="number"
          density="compact"
          variant="outlined"
          color="primary"
          base-color="primary"
          required
        ></v-text-field>
        <p class="font-weight-bold">Скидка на товар</p>
        <v-text-field
          v-model="form.specification.sale"
          class="pb-2"
          type="number"
          placeholder="Если поле "
          density="compact"
          variant="outlined"
          required="showField"
          color="primary"
          base-color="primary"
        ></v-text-field>
        <p class="mb-3 font-weight-bold">Год издания</p>
        <v-text-field
          v-model="form.specification.year"
          class="pb-2"
          placeholder="Год публикации книги"
          type="number"
          density="compact"
          variant="outlined"
          color="primary"
          base-color="primary"
          required
        ></v-text-field>
        <p class="mb-3 font-weight-bold">Количество страниц</p>
        <v-text-field
          v-model="form.specification.pages"
          class="pb-2"
          placeholder="Сколько страниц в книге"
          type="number"
          density="compact"
          variant="outlined"
          color="primary"
          base-color="primary"
          required
        ></v-text-field>
        <p class="mb-3 font-weight-bold">Тип переплёта</p>
        <v-select
          v-model="form.specification.binding"
          class="pb-2"
          placeholder="Выберете переплёт книги"
          density="compact"
          variant="outlined"
          color="primary"
          base-color="primary"
          required
          :items="['Твёрдый переплёт', 'Мягкий переплёт']"
        ></v-select>

        <v-card-actions class="px-0">
          <v-btn
            class="w-100 text-none font-weight-bold"
            color="primary"
            text="Изменить"
            variant="tonal"
            size="large"
            type="submit"
          ></v-btn>
        </v-card-actions>
      </form>
    </v-card>
    <v-skeleton-loader
      class="mx-auto py-8 px-6"
      elevation="1"
      v-else
      border
      type="article, sentences,sentences,sentences,sentences,sentences,sentences,sentences,sentences,sentences,sentences, actions"
    ></v-skeleton-loader>
  </v-container>
</template>
