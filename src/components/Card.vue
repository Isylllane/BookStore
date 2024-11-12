<script setup>
// Импорт модулей
import { defineProps, ref } from "vue";
import { RouterLink } from "vue-router";
import { useCartStore } from "@/stores/useCartBooks.js";

const cart = useCartStore();

const addToCart = (book) => {
  cart.addItem(book);
};

const props = defineProps({
  book: Object,
});
</script>

<template>
  <v-card
    class="mx-auto"
    :width="$vuetify.display.smAndDown ? '170' : '190'"
    variant="text"
  >
    <router-link :to="'/books/' + book.id">
      <v-lazy
        :options="{ threshold: 0.5 }"
        transition="fade-transition"
        :min-height="200"
      >
        <v-img
          class="align-end text-white mt-3"
          height="200"
          :src="book.cover"
          lazy
        />
      </v-lazy>
    </router-link>

    <v-card-title class="text-subtitle-1 px-0 link">
      <router-link :to="'/books/' + book.id">{{
        book.title
      }}</router-link></v-card-title
    >

    <v-card-subtitle class="px-0">{{ book.author }}</v-card-subtitle>

    <v-card-text class="pb-0 px-0 font-weight-bold d-flex justify-space-between"
      ><p class="text-base">
        {{ book.specification.price }} ₽ &nbsp;
        <del class="text-caption" v-if="book.specification.sale !== 0">
          {{ book.specification.sale }} ₽</del
        >
      </p>
      <v-icon
        v-if="book.specification.sale !== 0"
        icon="mdi-percent-box"
        color="red-lighten-1"
      ></v-icon>
    </v-card-text>

    <v-card-actions class="px-0">
      <v-btn
        color="primary"
        text="В корзину"
        border
        class="text-none flex-fill"
        @click="addToCart(book)"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<style></style>
