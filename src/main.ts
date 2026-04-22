import { createApp } from "vue";
import { createPinia } from "pinia";
import '@/assets/sass/main.scss'
import App from "./App.vue";

import router from "./router";
import i18n from "@/core/plugins/i18n";

//imports for app initialization
import ApiService from "@/core/services/ApiService";
import { initApexCharts } from "@/core/plugins/apexcharts";
import { initKtIcon } from "@/core/plugins/keenthemes";

// Vuetify
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import vuetify from '@/core/plugins/vuetify';

const app = createApp(App);
app.use(vuetify);
app.use(router);
import "@/core/plugins/prismjs";

app.use(createPinia());
ApiService.init(app);
initApexCharts(app);
initKtIcon(app);

app.use(i18n);

app.mount("#app");
