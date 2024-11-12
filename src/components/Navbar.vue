<template>
  <!-- Боковое меню в мобильной версии -->
  <v-navigation-drawer
    v-if="$vuetify.display.mdAndDown"
    width="310"
    mobile
    clipped
    v-model="isOpen"
    app
  >
    <v-list-item class="pt-5">
      <template v-slot:title
        ><h1 class="link"><router-link to="/">Книжный</router-link></h1>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list nav>
      <v-list-item v-for="(item, i) in pages" :key="i" link :to="item.path">{{
        item.text
      }}</v-list-item>
    </v-list>
  </v-navigation-drawer>

  <!-- Шапка сайта -->

  <v-app-bar
    dense
    :density="$vuetify.display.mdAndUp ? 'default' : 'compact'"
    class="pb-2 px-2 px-md-8 px-lg-16"
    scroll-behavior="elevate"
  >
    <template #prepend>
      <v-app-bar-nav-icon class="d-flex d-md-none" @click="toggleMobile">
        <v-icon icon="mdi-menu" size="large"></v-icon>
      </v-app-bar-nav-icon>
    </template>
    <h1 class="link"><router-link to="/">Книжный</router-link></h1>
    <v-spacer />

    <Search class="d-none d-md-block flex-fill" />

    <v-spacer />

    <v-divider class="ms-3" inset vertical></v-divider>
    <div class="mr-5">
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
        :content="cart.totalQuantity < 9 ? cart.totalQuantity : '9+'"
        color="error"
      />
    </div>

    <template #extension>
      <v-spacer class="d-none d-md-flex" />
      <template class="d-none d-md-flex">
        <div v-for="(page, i) in pages" :key="i">
          <v-btn
            v-bind="page"
            slim
            :to="page.path"
            class="me-2 text-none text-base"
          />
        </div>
      </template>

      <Search class="mx-auto px-4 d-md-none" />

      <v-spacer class="d-none d-md-flex" />
    </template>
  </v-app-bar>
</template>

<script setup>
import Search from "./Search.vue";
import { shallowRef } from "vue";
import { useCartStore } from "@/stores/useCartBooks.js";

const cart = useCartStore();
const isOpen = shallowRef(false);

const pages = [
  { text: "Главная", path: "/" },
  { text: "Каталог", path: "/books/" },
  { text: "Добавить книгу", path: "/books/add/" },
  { text: "404 страница", path: "/dsad" },
];

const toggleMobile = () => {
  isOpen.value = !isOpen.value;
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
