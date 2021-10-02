/** Definition and management of Vue-router routing. */
import { createRouter, createMemoryHistory } from "vue-router";

import CreateFile from "@/components/pages/CreateFile.vue";
import CreateLink from "@/components/pages/CreateLink.vue";
import CreatePaste from "@/components/pages/CreatePaste.vue";
import Share from "@/components/pages/Share.vue";
import Home from "@/components/pages/Home.vue";

const routes = [
  { path: "", component: Home },
  { path: "/!file", component: CreateFile },
  { path: "/!link", component: CreateLink },
  { path: "/!paste", component: CreatePaste },
  { path: "/:share", component: Share },
  { path: "/:any(.*)", redirect: "" },
];

const history = createMemoryHistory();
history.replace(`/${window.location.hash.slice(1)}`);

export const router = createRouter({ history, routes });

window.addEventListener("hashchange", () => {
  router.push(`/${window.location.hash.slice(1)}`);
});

router.afterEach((to) => (window.location.hash = to.fullPath.slice(1)));
