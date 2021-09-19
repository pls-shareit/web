import { createApp } from "vue";
import Share from "@/Share.vue";
import { store } from "@/utils/data";

createApp(Share).use(store).mount("#app");
