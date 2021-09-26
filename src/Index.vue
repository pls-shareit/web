<template lang="pug">
.index
  router-view(v-slot='{ Component }')
    transition(name='screen-')
      component.screen(@create='create' :is='Component')
  Errors
  SettingsMenu
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { UPDATE_ABILITIES, NEW_ERROR } from "@/utils/mutations";
import type { NewShare } from "@/utils/api";
import SettingsMenu from "@/components/SettingsMenu.vue";
import Errors from "@/components/Errors.vue";

const store = useStore();
const router = useRouter();
store.dispatch(UPDATE_ABILITIES);

function create(promise: Promise<NewShare>) {
  promise.then(
    (link: NewShare) => router.push(`/${link.name}`),
    (error: string) =>
      store.commit(NEW_ERROR, { title: "Creation error", message: error }),
  );
}
</script>

<style lang="sass">
@import "./utils/theme.sass"

.index
  height: 100vh
  overflow-y: hidden

.screen
  position: relative
  box-sizing: border-box
  height: 100vh

.screen--enter-active, .screen--leave-active
  transition: top 200ms ease-in-out

.screen--enter-from, .screen--leave-from
  top: 0

.screen--home.screen--enter-from
  top: -200vh

.screen--enter-to, .screen--home.screen--leave-to
  top: -100vh

.screen--leave-to
  top: 100vh
</style>
