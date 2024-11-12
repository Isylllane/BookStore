<script setup>
// Импорт модулей
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, watch } from "vue";
import axios from "axios";

// Импорт хранилищ pinia
import { useStoreBooks } from "@/stores/useStoreBooks.js";
import { useCartStore } from "@/stores/useCartBooks.js";

const cart = useCartStore(); // Инициализация хранилища корзины
const store = useStoreBooks(); // Инициализация хранилища книг

const addToCart = (book) => {
  cart.addItem(book); // Добавление книги в корзину
};

const route = useRoute(); // Получение информации о маршруте
const router = useRouter(); // Инициализация роутера

let bookId = route.params.id; // Получение идентификатора книги из параметров маршрута

const book = ref(null); // Реактивная переменная для хранения данных о книге

// Импорт информации о книге из хранилища при монтировании компонента
onMounted(async () => {
  await store.getBook(bookId); // Асинхронное получение данных книги
  book.value = store.book; // Присвоение данных книги
});

// Переход на блок "Описание"
const scrollToDescription = () => {
  const yOffset = -120;
  const element = document.getElementById("description");
  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

  if (element) {
    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  }
};

// Удаление книги
const deleteBook = async () => {
  try {
    const confirm = window.confirm("Вы уверены, что хотите удалить страницу?");
    if (confirm) {
      await axios.delete(`${store.api}/${bookId}`); // Асинхронное удаление книги
      router.push("/books"); // Переход на страницу списка книг
    }
  } catch (error) {
    console.log("Ошибка при удалении книги", error);
  }
};

// Обновление данных о книге при изменении идентификатора маршрута
watch(
  () => route.params.id,
  async (bookId) => {
    await store.getBook(bookId); // Асинхронное получение данных книги
    book.value = store.book; // Присвоение данных книги
  }
);
</script>

<template>
  <v-container class="pa-md-6" max-width="1260">
    <div v-if="book">
      <div class="text-h6 text-md-h4 font-weight-bold mb-1">
        {{ book.title }}
      </div>
      <div class="mb-2">
        {{ book.author }}
      </div>
      <v-row class="mt-4">
        <v-col cols="12" md="4">
          <v-responsive>
            <v-img :src="book.cover" height="450" />
          </v-responsive>
        </v-col>
        <v-col cols="12" md="5">
          <div class="text-h6 font-weight-bold">О товаре</div>
          <div class="text-body-1 mb-4 text-medium-emphasis">
            {{ book.description?.substring(0, 300) + "..." }}
          </div>
          <v-btn
            color="primary"
            text="Перейти к описанию"
            class="text-none"
            variant="outlined"
            @click="scrollToDescription"
          ></v-btn>
          <div class="d-none d-md-block">
            <div class="text-h6 font-weight-bold mt-4">Характеристики</div>

            <v-list>
              <v-list-item title="Жанр">
                <template v-slot:append>
                  {{ book.specification.type }}
                </template>
              </v-list-item>
              <v-list-item title="Страниц">
                <template v-slot:append>
                  <p class="float-left"></p>
                  {{ book.specification.pages }}
                </template>
              </v-list-item>
              <v-list-item title="Год, тираж">
                <template v-slot:append>
                  {{ book.specification.year }}
                </template>
              </v-list-item>
            </v-list>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <v-card elevation="2">
            <v-card-title class="text-h5 font-weight-bold">
              {{ book.specification?.price }} ₽
              <del
                class="text-caption sale"
                v-if="book.specification.sale !== 0"
              >
                {{ book.specification.sale }} ₽</del
              >
            </v-card-title>

            <v-card-actions>
              <v-btn
                color="primary"
                class="rounded-lg text-none flex-fill"
                size="large"
                variant="elevated"
                @click="addToCart(book)"
                >В корзину</v-btn
              >
            </v-card-actions>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                color="warning"
                text="Изменить"
                class="text-none"
                density="compact"
                variant="outlined"
                :to="'/books/edit/' + book.id"
              ></v-btn>
              <v-btn
                color="error"
                text="Удалить"
                @click="deleteBook"
                class="text-none"
                density="compact"
                variant="outlined"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <div class="text-h6 text-md-h6 font-weight-bold my-3" id="description">
        Описание и характеристики
      </div>
      <v-row>
        <v-col cols="12" md="9">
          <div class="text-body-1 mb-4 text-medium-emphasis">
            {{ book.description }}
          </div>
          <v-list>
            <v-list-item title="Жанр">
              <template v-slot:append>
                <div class="text-left" style="display: flex">
                  {{ book.specification.type }}
                  <v-spacer></v-spacer>
                </div>
              </template>
            </v-list-item>
            <v-list-item title="Страниц">
              <template v-slot:append>
                <p class="float-left"></p>
                {{ book.specification.pages }}
              </template>
            </v-list-item>
            <v-list-item title="Год, тираж">
              <template v-slot:append>
                {{ book.specification.year }}
              </template>
            </v-list-item>
            <v-list-item title="Переплёт">
              <template v-slot:append>
                {{ book.specification.binding }}
              </template>
            </v-list-item>
            <v-list-item title="Код книги">
              <template v-slot:append>
                {{ book.id }}
              </template>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-skeleton-loader type="heading" class="w-66" />
      <v-row class="mt-4">
        <v-col cols="12" md="3">
          <v-responsive>
            <v-img height="350" class="bg-grey-lighten-2">
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular
                    color="primary"
                    indeterminate
                  ></v-progress-circular>
                </div>
              </template>
            </v-img>
          </v-responsive>
        </v-col>
        <v-col cols="12" md="6">
          <v-skeleton-loader type="article, paragraph,paragraph" />
        </v-col>
        <v-col cols="12" md="3">
          <v-skeleton-loader
            type="heading, paragraph, actions"
            :elevation="1"
          ></v-skeleton-loader
        ></v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="9">
          <v-skeleton-loader type="article"> </v-skeleton-loader>
          <v-skeleton-loader type="list-item, list-item"> </v-skeleton-loader>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<style scored>
.sale del::before {
  height: 150% !important;
}
</style>
