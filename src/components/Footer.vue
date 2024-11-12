<template>
  <v-footer color="grey-lighten-3 " class="mt-10">
    <v-row justify="center" no-gutters>
      <div v-for="(page, i) in pages" :key="i">
        <v-btn
          v-bind="page"
          slim
          variant="plain"
          v-ripple="false"
          :to="page.path"
          class="me-2 text-none text-base"
        />
      </div>

      <v-col class="primary lighten-2 py-4 text-center white-text" cols="12">
        {{ new Date().getFullYear() }} — <strong>Книжный магазин</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script setup>
const pages = [
  { text: "Главная", path: "/" },
  { text: "Каталог", path: "/books/" },
  { text: "Добавить книгу", path: "/books/add/" },
  { text: "404 страница", path: "/dsad" },
];
</script>
