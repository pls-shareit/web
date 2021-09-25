<template lang="pug">
.index
  transition(name='screen-')
    TitleScreen.screen.screen--home(v-if='store.state.screen === "title"')
    CreateLinkScreen.screen(v-else-if='store.state.screen === "link"' @create='create')
    CreatePasteScreen.screen(v-else-if='store.state.screen === "paste"' @create='create')
    CreateFileScreen.screen(v-else-if='store.state.screen === "file"' @create='create')
  Errors
  SettingsMenu
</template>

<script lang="ts" setup>
import { useStore } from "vuex";

import { UPDATE_ABILITIES, NEW_ERROR } from "@/utils/mutations";
import TitleScreen from "@/components/TitleScreen.vue";
import CreateLinkScreen from "@/components/CreateLinkScreen.vue";
import CreatePasteScreen from "@/components/CreatePasteScreen.vue";
import CreateFileScreen from "@/components/CreateFileScreen.vue";
import SettingsMenu from "@/components/SettingsMenu.vue";
import Errors from "@/components/Errors.vue";

const store = useStore();
store.dispatch(UPDATE_ABILITIES);

function create(promise: Promise<string>) {
  promise.then(
    (link: string) => window.location.href = link,
    (error: string) => store.commit(NEW_ERROR, { title: "Creation error", message: error }),
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
