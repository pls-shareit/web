<template lang="pug">
.index
  TitleScreen(v-if='store.state.screen === "title"')
  CreateLinkScreen(v-if='store.state.screen === "link"')
  CreatePasteScreen(v-if='store.state.screen === "paste"')
  CreateFileScreen(v-if='store.state.screen === "file"')
  Errors
  SettingsMenu
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";

import { UPDATE_ABILITIES } from "@/utils/mutations";
import TitleScreen from "@/components/TitleScreen.vue";
import CreateLinkScreen from "@/components/CreateLinkScreen.vue";
import CreatePasteScreen from "@/components/CreatePasteScreen.vue";
import CreateFileScreen from "@/components/CreateFileScreen.vue";
import SettingsMenu from "@/components/SettingsMenu.vue";
import Errors from "@/components/Errors.vue";

const store = useStore();
store.dispatch(UPDATE_ABILITIES);
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap')
@import "./utils/theme.sass"

body
  font-family: 'Roboto Slab', monospace, sans-serif
  color: $text-colour
  background: $background
  min-height: 100vh
  margin: 0

.index
  display: flex
  flex-direction: column
  justify-content: center
  min-height: 100vh
</style>
