import "./assets/main.scss";

import { createApp } from "vue";
// Импортирование Pinia
import { createPinia } from "pinia";

// Импортирование Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import colors from "vuetify/util/colors";

// Импортирование Material Design Icons для Vuetify
import "@mdi/font/css/materialdesignicons.css";

// const customLightTheme = {
//   dark: false,
//   colors: {
//     background: "#eee",
//     surface: "#15202b",
//     primary: "#3f51b5",
//     secondary: "#00ccff",
//     error: "#ffcc00",
//   },
// };
// const customDarkTheme = {
//   dark: true,
//   colors: {
//     background: "#15202b",
//     surface: "#15202b",
//     primary: "#3f51b5",
//     secondary: "#03dac6",
//     error: "#ff5722",
//   },
// };
const vuetify = createVuetify({
  components,
  directives,

  icons: {
    defaultSet: "mdi",
  },
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#41b883",
          secondary: colors.red.lighten4, // #FFCDD2
          error: "#e53935",
          warning: colors.orange.lighten1,
        },
      },
    },
  },
});

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);

app.mount("#app");
