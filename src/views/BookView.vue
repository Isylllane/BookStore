<script setup>
// Импорт компонентов

// Импорт модулей
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import axios from "axios";

// Импорт хранилищ pinia
import { useStoreBooks } from "@/stores/useStoreBooks.js";
const store = useStoreBooks();

const route = useRoute();
const router = useRouter();

let bookId = route.params.id;

// Инициализация book как null
const book = ref(null);

// Импорт информации о книгах из хранилища
onMounted(async () => {
  await store.getBook(bookId);
  book.value = store.book;
});

// Переход на блок
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

const deleteBook = async () => {
  try {
    const confirm = window.confirm("Вы уверены, что хотите удалить страницу?");
    if (confirm) {
      await axios.delete(`${store.api}/${bookId}`);
      router.push("/books");
    }
  } catch (error) {
    console.log("Ошибка при удалении книги", error);
  }
};
</script>

<template>
  <v-container class="pa-md-6" max-width="1260">
    <div v-if="book">
      <div class="text-h6 text-md-h4 font-weight-bold mb-2">
        {{ book.title }}
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
            style="flex: 1"
            class="text-none"
            variant="outlined"
            @click="scrollToDescription"
          ></v-btn>
          <div class="d-none d-md-block">
            <div class="text-h6 font-weight-bold mt-4">Характеристики</div>

            <v-list>
              <v-list-item title="Категория">
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
            </v-card-title>

            <v-card-actions>
              <v-btn
                color="primary"
                class="rounded-lg text-none"
                style="flex: 1"
                size="large"
                variant="elevated"
                >В корзину</v-btn
              >

              <v-btn
                icon="mdi-heart-outline"
                color="red-lighten-2"
                variant="text"
              ></v-btn>
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
            <v-list-item title="Категория">
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

<style scoped></style>
