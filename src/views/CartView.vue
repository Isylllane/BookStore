<script setup>
// Импорт модулей
import { RouterLink } from "vue-router";

// Импорт хранилища корзины из Pinia
import { useCartStore } from "@/stores/useCartBooks.js";

const cart = useCartStore(); // Инициализация хранилища корзины

// Функция для удаления элемента из корзины
const removeItem = (item) => {
  cart.removeItem(item);
};

// Функция для обновления количества элементов в корзине
const updateItemQuantity = (item) => {
  if (item.quantity == 0) {
    cart.removeItem(item);
  } else {
    cart.updateItemQuantity(item, item.quantity);
  }
};

// Функция для очистки корзины
const clearCart = () => {
  cart.clearCart();
};

// Функция для увеличения количества элементов
const increaseValue = (item) => {
  item.quantity += 1;
  updateItemQuantity(item);
};

// Функция для уменьшения количества элементов
const decreaseValue = (item) => {
  if (item.quantity > 1) {
    item.quantity -= 1;
  }
  updateItemQuantity(item);
};
</script>

<template>
  <v-container max-width="1260">
    <div class="d-flex justify-space-between py-4 mb-0 mb-sm-4">
      <h1 class="text-h5 text-sm-h4 font-weight-bold">Корзина</h1>

      <div class="d-flex align-center">
        <v-btn
          class="text-none font-weight-bold text-base"
          size="small"
          rounded="lg"
          color="primary"
          text="Очистить"
          variant="outlined"
          @click="clearCart()"
        ></v-btn>
      </div>
    </div>

    <v-row v-if="cart.items.length > 0"
      ><v-col cols="12" md="8">
        <div>
          <transition-group name="cart" tag="div">
            <div
              v-for="item in cart.items"
              :key="item.id"
              class="px-0 d-flex mt-5 ga-2 ga-sm-5 border-b-sm pb-6 pb-sm-7"
            >
              <router-link :to="'/books/' + item.id">
                <v-img
                  :src="item.cover"
                  class="me-2"
                  border
                  style="height: 148px; max-width: 96px; width: 96px"
                ></v-img>
              </router-link>

              <div class="d-flex w-100 ga-1 ga-sm-3 justify-space-between">
                <div
                  class="d-flex justify-space-between w-100 ga-1 ga-sm-5 flex-column flex-sm-row"
                >
                  <div
                    class="flex-grow-1 d-flex flex-column justify-space-between pt-1"
                  >
                    <div>
                      <strong class="link">
                        <router-link :to="'/books/' + item.id">
                          {{ item.title }}
                        </router-link>
                      </strong>
                      <div class="d-flex ga-2 text-medium-emphasis">
                        {{ item.author }}
                      </div>
                    </div>

                    <div class="d-none d-sm-block">
                      {{ item.specification.pages }} стр.
                    </div>
                  </div>

                  <div
                    style="max-width: 300px"
                    class="align-end align-sm-stretch flex-grow-1 flex-shrink-0 d-flex flex-sm-column justify-space-between pt-1"
                  >
                    <div
                      class="d-flex justify-space-between ga-4 flex-column-reverse flex-sm-row"
                    >
                      <v-text-field
                        class="cart-input-center"
                        type="number"
                        min="1"
                        max="999"
                        onkeydown="return event.key !== '-' "
                        max-width="160"
                        min-width="140"
                        density="compact"
                        variant="outlined"
                        color="primary"
                        base-color="primary"
                        v-model.number="item.quantity"
                        @change="updateItemQuantity(item)"
                      >
                        <template v-slot:append>
                          <v-btn
                            icon="mdi-plus"
                            density="compact"
                            variant="tonal"
                            color="primary"
                            @click="increaseValue(item)"
                            @change="updateItemQuantity(item)"
                          >
                          </v-btn>
                        </template>
                        <template v-slot:prepend>
                          <v-btn
                            icon="mdi-minus"
                            density="compact"
                            variant="tonal"
                            color="primary"
                            @click="decreaseValue(item)"
                            @change="updateItemQuantity(item)"
                          >
                          </v-btn>
                        </template>
                      </v-text-field>

                      <div class="align-content-center">
                        <p></p>
                        <p class="text-h6 font-weight-bold">
                          {{ item.specification.price * item.quantity }} ₽
                          <del
                            class="text-caption"
                            v-if="item.specification.sale !== 0"
                          >
                            &nbsp;{{
                              item.specification.sale * item.quantity
                            }}
                            ₽</del
                          >
                        </p>
                      </div>
                    </div>
                    <div class="pb-1 pb-sm-0">
                      <div class="justify-end ga-3 d-flex">
                        <v-btn
                          variant="plain"
                          icon="mdi-delete"
                          v-ripple="false"
                          @click="removeItem(item)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </v-col>

      <v-col cols="12" md="4" class="pl-lg-6 pl-2">
        <v-card class="pa-3">
          <v-list>
            <v-list-item :title="cart.totalQuantity + ' шт.'">
              <template v-slot:append>
                <div class="text-left" style="display: flex">
                  {{ cart.totalSale + cart.totalPrice }} ₽
                </div>
              </template>
            </v-list-item>
            <v-list-item title="Скидка по акциям" v-if="cart.totalSale !== 0">
              <template v-slot:append
                ><p class="text-red-lighten-1">— {{ cart.totalSale }} ₽</p>
              </template>
            </v-list-item>
            <v-list-item title="Итого" class="font-weight-bold">
              <template v-slot:append> {{ cart.totalPrice }} ₽ </template>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-card-item>Принимаем все виды оплаты</v-card-item>
          <v-card-actions>
            <v-btn
              color="primary"
              class="rounded-lg text-none w-100"
              size="large"
              variant="elevated"
              >Перейти к оформлению</v-btn
            >
          </v-card-actions>
        </v-card></v-col
      >
    </v-row>

    <v-sheet v-else class="pa-10" width="100%" height="20%" border rounded>
      <div class="text-h6">В корзине ничего нет</div>
      <div class="text-base pt-3">
        Воспользуйтесь поиском или перейдите в каталог!
      </div>

      <v-btn
        color="primary"
        class="rounded-lg text-none mt-7"
        size="x-large"
        variant="elevated"
        to="/books/"
        >Перейти в каталог</v-btn
      >
    </v-sheet>
  </v-container>
</template>

<style scored>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.cart-input-center input {
  text-align: center;
}

.cart-enter-active,
.cart-leave-active {
  transition: all 0.5s ease;
}
.cart-enter,
.cart-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.cart-input-center input {
  text-align: center;
}
</style>
