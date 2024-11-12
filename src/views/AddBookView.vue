<script setup>
// Импорт модулей
import { useRouter, useRoute } from "vue-router";
import { shallowRef, computed, ref, reactive, onMounted } from "vue";
import axios from "axios";
// Импорт хранилищ Pinia
import { useStoreBooks } from "@/stores/useStoreBooks.js";

const store = useStoreBooks(); // Получение хранилища книг из Pinia
const books = ref([]); // Реактивная переменная для хранения списка книг
const allTypes = ref([]); // Реактивная переменная для хранения всех жанров книг

// Получение данных книг
onMounted(async () => {
  await store.getBooks(); // Асинхронное получение данных книг из хранилища
  books.value = store.books; // Сохранение в переменную
  // Получение уникальных жанров книг
  allTypes.value = Array.from(
    new Set(books.value.map((book) => book.specification.type))
  );
});

const loading = shallowRef(false); // Отображение состояния загрузки
const showField = ref(false); // Изначально поле скрыто

const router = useRouter(); // Инициализация маршрутизатора
const route = useRoute(); // Инициализация текущего маршрута

// Функция для проверки обязательного поля
const required = computed(() => {
  return (value) => !!value || "Поле обязательно для заполнения";
});

// Реактивный объект для формы добавления книги
const form = reactive({
  title: "",
  author: "",
  description: "",
  specification: {
    type: "Хобби и досуг",
    binding: "Твёрдый переплёт",
    year: 0,
    pages: 0,
    price: 0,
    sale: 0,
  },
});

const pageHeading = ref("книгу"); // Заголовок страницы

// Функция для генерации случайной обложки книги
const randomCover = () => {
  return (
    "/images/covers/" + "cover" + (Math.floor(Math.random() * 9) + 1) + ".webp"
  );
};

// Инициализация формы
onMounted(() => {
  if (route.query.testbook) {
    // Если в параметрах маршрута есть query с тестовой книгой
    form.title = "Тестовая книга";
    form.author = "Иванов Иван Иванович";
    form.description =
      "Lorem Ipsum - это текст-рыба, часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной рыбой для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул в электронный дизайн. Его популяризации в новое время послужили публикация листов Letraset с образцами Lorem Ipsum в 60-х годах и, в более недавнее время, программы электронной вёрстки типа Aldus PageMaker, в шаблонах которых используется Lorem Ipsum.";
    form.specification.type = "Хобби и досуг";
    form.specification.binding = "Твёрдый переплёт";
    form.specification.year = 2024;
    form.specification.pages = 726;
    form.specification.price = 199;
    form.specification.sale = 0;
    pageHeading.value = "тестовую книгу";
  }
});

// Функция для обработки отправки формы
const handleSubmit = async () => {
  const newBook = {
    title: form.title,
    author: form.author,
    cover: randomCover(),
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
    // Отправка данных новой книги на сервер
    const response = await axios.post(`${store.api}`, newBook);
    // Переход на страницу новой книги после успешной отправки
    router.push(`/books/${response.data.id}`);
  } catch (error) {
    console.error("Ошибка при добавлении книги", error);
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
    ><v-card class="py-8 px-6" :elevation="1" border rounded>
      <v-card-title class="text-center text-h5"
        >Добавить {{ pageHeading }}</v-card-title
      >
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
        <v-checkbox-btn
          class="mb-3"
          v-model="showField"
          label="Требуется скидка на товар"
          color="primary"
        ></v-checkbox-btn>
        <v-text-field
          v-model="form.specification.sale"
          class="pb-2"
          type="number"
          v-if="showField"
          :rules="[required]"
          placeholder="Укажите стоимость товара со скидкой"
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
            :disabled="loading"
            :loading="loading"
            size="large"
            color="primary"
            text="Создать"
            variant="tonal"
            type="submit"
          ></v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-container>
</template>

<style scored>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
