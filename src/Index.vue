<template lang="pug">
.index
  transition(name='screen-')
    TitleScreen.screen.screen--home(v-if='store.state.screen === "title"')
    CreateLinkScreen.screen(v-else-if='store.state.screen === "link"')
    CreatePasteScreen.screen(v-else-if='store.state.screen === "paste"')
    CreateFileScreen.screen(v-else-if='store.state.screen === "file"')
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
