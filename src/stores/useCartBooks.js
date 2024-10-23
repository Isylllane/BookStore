import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: JSON.parse(localStorage.getItem("cart")) || [],
  }),
  getters: {
    totalQuantity: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) =>
      state.items.reduce(
        (sum, item) => sum + item.specification.price * item.quantity,
        0
      ),
    totalSale: (state) =>
      state.items.reduce(
        (sum, item) => sum + item.specification.sale * item.quantity,
        0
      ),
  },
  actions: {
    addItem(product) {
      const existingItem = this.items.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
      this.saveCartToLocalStorage();
    },
    removeItem(product) {
      this.items = this.items.filter((item) => item.id !== product.id);
      this.saveCartToLocalStorage();
    },
    updateItemQuantity(product, quantity) {
      const item = this.items.find((item) => item.id === product.id);
      if (item) {
        item.quantity = quantity;
        this.saveCartToLocalStorage();
      }
    },
    clearCart() {
      this.items = [];
      this.saveCartToLocalStorage();
    },
    saveCartToLocalStorage() {
      localStorage.setItem("cart", JSON.stringify(this.items));
    },
  },
});
