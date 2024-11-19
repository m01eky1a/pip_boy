import { createApp } from "vue";
import App from "./App.vue";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const app = createApp(App);

// Оставьте комментарии, если store и apiPlugin вам пока не нужны
// import store from "@/store/index";
// import apiPlugin from "@/plugins/api";
// app.use(store);
// app.use(apiPlugin);

app.config.productionTip = false;

app.mount("#app");
