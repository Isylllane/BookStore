<template>
  <!-- Боковое меню в мобильной версии -->
  <v-navigation-drawer
    v-model="dialog"
    color="primary"
    disable-resize-watcher
    mobile
  >
    <v-list nav>
      <v-list-item
        v-for="(item, i) in pages"
        :key="i"
        :active="i === 0"
        :to="item.path"
        link
        :title="item.text"
      />
    </v-list>
    <template v-slot:append>
      <div class="pa-2">
        <v-btn class="ms-1" color="medium-emphasis" icon="mdi-heart-outline" />
        <v-btn class="ms-1" color="medium-emphasis" icon="mdi-cart-outline" />
      </div>
    </template>
  </v-navigation-drawer>
  <!-- <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    fullscreen
    class="mt-26"
  >
    <v-card class="rounded-t-lg">
      <v-toolbar>
        <v-btn icon="mdi-close" @click="dialog = false"></v-btn>

        <v-toolbar-title>Меню</v-toolbar-title>

        <v-spacer></v-spacer>
      </v-toolbar>

      <v-list nav>
        <RouterLink v-for="(page, i) in pages" :key="i" :to="page.path">
          <v-btn v-bind="page" slim class="me-2 text-none" />
        </RouterLink>
        <v-list-item v-for="(page, i) in pages" :key="i" :active="i === 0" link>
          <RouterLink :to="page.path">
            <v-list-item-title class="text-h6">{{
              page.text
            }}</v-list-item-title>
          </RouterLink>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog> -->

  <!-- Шапка сайта -->
  <v-app-bar
    :density="$vuetify.display.smAndUp ? 'default' : 'compact'"
    class="pb-2 px-2 px-sm-8 px-md-16"
    scroll-behavior="elevate"
  >
    <template #prepend>
      <v-app-bar-nav-icon class="d-flex d-sm-none" @click="dialog = !dialog"
        ><v-icon icon="mdi-menu" size="large"></v-icon
      ></v-app-bar-nav-icon>
    </template>
    <h1>Книжный</h1>

    <v-spacer />

    <v-card-text class="d-none d-sm-block">
      <Search />
    </v-card-text>

    <v-spacer />

    <v-divider class="ms-3" inset vertical></v-divider>
    <template #append>
      <div class="mr-3">
        <v-btn
          class="ms-1"
          color="medium-emphasis"
          icon="mdi-heart-outline"
          v-ripple="false"
          variant="plain"
        />
        <v-btn
          class="ms-1"
          color="medium-emphasis"
          icon="mdi-cart-outline"
          to="/cart/"
          variant="plain"
          v-ripple="false"
        />
        <v-badge
          v-if="cart.totalQuantity !== 0"
          :content="cart.totalQuantity"
          color="error"
        >
        </v-badge>
      </div>
    </template>
    <template #extension>
      <v-spacer class="d-none d-sm-flex" />
      <template class="d-none d-sm-flex">
        <div v-for="(page, i) in pages" :key="i">
          <v-btn
            v-bind="page"
            slim
            :to="page.path"
            :active="isActiveLink(page.path)"
            class="me-2 text-none text-base"
          />
        </div>
      </template>
      <Search class="mx-auto px-4 d-sm-none" />

      <v-spacer class="d-none d-sm-flex" />
    </template>
  </v-app-bar>
</template>

<script setup>
// Импорт компонентов
import Search from "./Search.vue";

// Импорт модулей
import { shallowRef, ref, computed, onMounted } from "vue"; // Функция для создания реактивности
import { useRoute, useRouter } from "vue-router";
// Импорт хранилищ pinia
import { useCartStore } from "@/stores/useCartBooks.js";
const cart = useCartStore();

const router = useRouter();
const dialog = shallowRef(false);

const pages = [
  {
    text: "Главная",
    path: "/",
  },
  {
    text: "Каталог",
    path: "/books/",
  },
  {
    text: "Добавить книгу",
    path: "/books/add/",
  },
  {
    text: "404 страница",
    path: "/dsad",
  },
];
// Функция сравнивает активную ссылку и подсвечивает соответствующую кнопку в меню
const isActiveLink = (routePath) => {
  const route = useRoute();

  return route.path === routePath;
};
</script>

<style scoped>
.v-app-bar.v-toolbar:not(.v-toolbar--flat) {
  box-shadow: 0px 1px 2px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.15)),
    0px 2px 2px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.15)),
    0px 1px 4px 0px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, 0.15));
}
.mt-26 {
  margin-top: 104px;
}
</style>
