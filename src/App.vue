<script setup>
// Импорт компонентов
import Navbar from "@/components/Navbar.vue";
import Footer from "./components/Footer.vue";

// Импорт модулей
import { RouterView } from "vue-router";
</script>

<template>
  <v-app id="inspire" style="min-width: 350px" class="font">
    <!-- Шапка сайта -->
    <Navbar />

    <!-- Основной контент -->
    <v-main>
      <RouterView />
    </v-main>

    <!-- Подвал сайта -->
    <Footer />
  </v-app>
</template>

<style></style>
