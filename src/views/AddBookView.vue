<script setup>
// Импорт модулей
import router from "@/router";
import { shallowRef, computed, ref, reactive } from "vue"; // Функция для создания реактивности
import axios from "axios";
// Импорт хранилищ pinia
import { useStoreBooks } from "@/stores/useStoreBooks.js";
const store = useStoreBooks();

const loading = shallowRef(false);
const showField = ref(false); // Изначально поле скрыто

const required = computed(() => {
  return (value) => !!value || "Поле обязательно для заполнения";
});
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

const handleSubmit = async () => {
  const newBook = {
    id: Math.floor(Math.random() * 100000),
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
    const response = await axios.post(`${store.api}`, newBook);

    router.push(`/books/${response.data.id}`);
  } catch (error) {
    console.error("Ошибка при добавлении книги", error);
  }
};
</script>

<template>
  <v-container max-width="650px" class="py-16"
    ><v-card class="py-8 px-6" :elevation="1" border rounded>
      <v-card-title class="text-center text-h5">Добавить книгу</v-card-title>
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
        <v-checkbox-btn
          class="mb-3"
          v-model="showField"
          label="Добавить новую категорию"
          color="primary"
        ></v-checkbox-btn>

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
    <!-- <v-dialog
      v-model="dialogAddBook"
      max-width="600"
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          class="ms-1 text-none font-weight-regular"
          color="medium-emphasis"
          icon="mdi-book-plus"
          v-bind="activatorProps"
        />
      </template>
      <form @submit.prevent="submit">
        <v-card prepend-icon="mdi-book-plus" title="Добавление новой книги">
          <v-card-text>
            <v-row dense>
              <v-col cols="12" md="6" sm="6">
                <v-text-field label="Название" required></v-text-field>
              </v-col>

              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  hint="example of helper text only on focus"
                  label="Автор"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="12" sm="12">
                <v-textarea
                  label="Описание книги"
                  row-height="20"
                  rows="2"
                  variant="outlined"
                ></v-textarea>
              </v-col>
            </v-row>
            <div class="text-h6 font-weight-bold mb-2">Характеристики</div>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field label="Цена"></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="Скидка на товар"
                  hint="Указывайте конкретное число, если скидка не требуется, оставьте поле пустым"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="Год, тираж" required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Количество страниц"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  :items="['Твёрдый переплёт', 'Мягкий переплёт']"
                  label="Переплёт книги"
                  required
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-autocomplete
                  :items="[
                    'Skiing',
                    'Ice hockey',
                    'Soccer',
                    'Basketball',
                    'Hockey',
                    'Reading',
                    'Writing',
                    'Coding',
                    'Basejump',
                  ]"
                  label="Категории"
                  auto-select-first
                  multiple
                ></v-autocomplete>
              </v-col>
            </v-row>

            <small class="text-caption text-medium-emphasis"
              >*indicates required field</small
            >
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="Закрыть"
              variant="plain"
              @click="dialogAddBook = false"
            ></v-btn>

            <v-btn
              :disabled="loading"
              :loading="loading"
              color="primary"
              text="Создать"
              variant="tonal"
              @click="(dialogAddBook = false), (loading = !loading)"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog> -->
  </v-container>
</template>

<style>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
