<template>
  <v-empty-state>
    <template v-slot:media>
      <v-icon icon="mdi-alert-circle-outline" class="mb-3"></v-icon>
    </template>

    <template v-slot:headline>
      <div class="text-h5 text-sm-h4">404: Страница не найдена</div>
    </template>

    <template v-slot:title>
      <div class="mt-3">
        <p>Эту страницу не удалось найти.</p>
        <p>Возможно, страницу скрыли или удалили с сайта.</p>
      </div>
    </template>
    <template v-slot:actions>
      <v-btn
        color="primary"
        text="Перейти на главную"
        class="text-none text-h6"
        size="large"
        to="/"
        variant="outlined"
      ></v-btn>
    </template>
  </v-empty-state>
</template>
