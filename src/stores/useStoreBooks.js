// Импорт модулей
import { ref } from "vue";
import { defineStore } from "pinia";

import axios from "axios";

const api = "https://1dc582cefa1c63a8.mokky.dev/books";

export const useStoreBooks = defineStore("StoreBooks", () => {
  const books = ref([]); // state для всех книг
  const book = ref([]); // state для одной книги

  // Получение информации об всех книгах
  const getBooks = async () => {
    try {
      const response = await axios.get(`${api}`);
      books.value = response.data;
    } catch (error) {
      console.error("Ошибка при получении данных о книгах", error);
    }
  };
  // Получение информации об одной конкретной книге по id
  const getBook = async (id) => {
    try {
      const response = await axios.get(`${api}/${id}`);
      book.value = response.data;
    } catch (error) {
      console.error("Ошибка при получении данных о книгах", error);
    }
  };

  return {
    api,
    books,
    book,
    getBooks,
    getBook,
  };
});
