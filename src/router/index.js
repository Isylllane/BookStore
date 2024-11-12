import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      meta: { title: "Книжный магазин" },
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/books/",
      name: "all-books",
      meta: { title: "Каталог" },
      component: () => import("../views/BooksView.vue"),
    },
    {
      path: "/books/:id",
      name: "books",
      meta: { title: "Товар" },
      component: () => import("../views/BookView.vue"),
    },
    {
      path: "/books/add",
      name: "add-book",
      meta: { title: "Новая книга" },
      component: () => import("../views/AddBookView.vue"),
      props: (route) => ({ testbook: route.query.testbook }),
    },
    {
      path: "/books/edit/:id",
      name: "edit-book",
      meta: { title: "Изменение книги" },
      component: () => import("../views/EditBookView.vue"),
    },
    {
      path: "/cart/",
      name: "cart",
      meta: { title: "Корзина" },
      component: () => import("../views/CartView.vue"),
    },

    {
      path: "/:catchAll(.*)",
      name: "not-found",
      meta: { title: "404: Страница не найдена" },
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }; //прокрутите в начало страницы
    // window.scrollTo({ top: 0 });
  },
});
router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});
export default router;
