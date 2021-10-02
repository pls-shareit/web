import { createApp } from "vue";

import Index from "@/Index.vue";
import { store } from "@/utils/data";
import { router } from "@/utils/routes";

createApp(Index).use(store).use(router).mount("#app");
