import { createApp } from "vue";
import Index from "@/Index.vue";
import { store } from "@/utils/data";

createApp(Index).use(store).mount("#app");
