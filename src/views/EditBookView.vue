<script setup>
// Импорт модулей
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, reactive, computed } from "vue";
import axios from "axios";

// Импорт хранилищ Pinia
import { useStoreBooks } from "@/stores/useStoreBooks.js";
const store = useStoreBooks();

const route = useRoute(); // Инициализация маршрута
const router = useRouter(); // Инициализация роутера

let bookId = route.params.id; // Получение ID книги из параметров маршрута
const showField = ref(false); // Изначально поле скрыто

const required = computed(() => {
  return (value) => !!value || "Поле обязательно для заполнения";
});

const book = ref(null);
const books = ref([]); // Реактивная переменная для хранения списка книг
const allTypes = ref([]); // Реактивная переменная для хранения всех жанров книг

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
    await store.getBook(bookId); // Получение данных книги из хранилища
    book.value = store.book;
    // Заполнение входных данных формы
    form.title = book.value.title;
    form.author = book.value.author;
    form.description = book.value.description;
    form.specification.type = book.value.specification.type;
    form.specification.binding = book.value.specification.binding;
    form.specification.year = Number(book.value.specification.year);
    form.specification.pages = Number(book.value.specification.pages);
    form.specification.price = Number(book.value.specification.price);
    form.specification.sale = Number(book.value.specification.sale);
    await store.getBooks(); // Асинхронное получение данных книг из хранилища
    books.value = store.books; // Сохранение в переменную
    // Получение уникальных жанров книг
    allTypes.value = Array.from(
      new Set(books.value.map((book) => book.specification.type))
    );
  } catch (error) {
    console.error("Ошибка при получении книги", error);
  }
});
// Получение данных книг

// Обновление данных книги
const handleSubmit = async () => {
  const updateJob = {
    title: form.title,
    author: form.author,
    description: form.description,
    specification: {
      type: form.specification.type,
      binding: form.specification.binding,
      year: Number(form.specification.year),
      pages: Number(form.specification.pages),
      price: Number(form.specification.price),
      sale: Number(form.specification.sale),
    },
  };

  try {
    const response = await axios.patch(`${store.api}/${bookId}`, updateJob); // Обновление данных книги на сервере

    router.push(`/books/${response.data.id}`); // Переход на страницу обновленной книги
  } catch (error) {
    console.error("Ошибка при изменении книги", error);
  }
};

const newCategory = ref(""); // Реактивная переменная для нового жанра книги

// Функция для добавления нового жанра книги
const addNewCategory = () => {
  if (newCategory.value && !allTypes.value.includes(newCategory.value)) {
    allTypes.value.push(newCategory.value);
    form.specification.type = newCategory.value; // Установка нового жанра для книги
    newCategory.value = ""; // Очистка поля после добавления
  }
};

// Настройки для tooltip
const tooltip = {
  text: "Выберите жанр из списка или введите новый",
  persistent: false,
  openOnClick: true,
  openOnHover: false,
};
</script>

<template>
  <v-container max-width="650px" class="py-16"
    ><v-card class="py-8 px-6" :elevation="1" border rounded v-if="book">
      <div class="text-center text-h5 py-2 px-4">
        Изменить книгу «{{ book.title }}»
      </div>
      <form @submit.prevent="handleSubmit">
        <p class="mb-3 font-weight-bold">Жанр книги</p>

        <v-combobox
          v-model="form.specification.type"
          v-model:search="newCategory"
          v-tooltip="tooltip"
          :hide-no-data="false"
          class="pb-2"
          density="compact"
          variant="outlined"
          color="primary"
          base-color="primary"
          small-chips
          :items="allTypes"
          required
        >
          <template v-slot:no-data>
            <v-list-item @click="addNewCategory">
              <v-list-item-title>
                Добавить <strong>"{{ newCategory }}"</strong>
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-combobox>
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
          type="number"
          v-model="form.specification.price"
          class="pb-2"
          placeholder="Стоимость в рублях"
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
