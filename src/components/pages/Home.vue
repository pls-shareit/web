<template lang="pug">
.title_screen.screen--home
  .header
    img.header__logo(src='../../assets/logo.png')
    h1.header__title ShareIt
    p.header__description ShareIt is a pastebin, link shortener and file uploader.
  hr.page_break(v-if='actions.createPaste || actions.createLink || actions.createFile || actions.login')
  .actions
    router-link.action(v-if='actions.createPaste' to='/!paste')
      img(src='../../assets/icons/clipboard.svg').action__icon
      h2.action__title Paste
    router-link.action(v-if='actions.createLink' to='/!link')
      img(src='../../assets/icons/link.svg').action__icon
      h2.action__title Link
    router-link.action(v-if='actions.createFile' to='/!file')
      img(src='../../assets/icons/upload.svg').action__icon
      h2.action__title File
    .action(
        v-if='actions.login && !(actions.createPaste || actions.createLink || actions.createFile)'
        @click='store.commit(OPEN_PASSWORD_PICKER)')
      img(src='../../assets/icons/key.svg').action__icon
      h2.action__title Login
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";

import { OPEN_PASSWORD_PICKER } from "@/utils/mutations";

const store = useStore();
const actions = computed(() => store.state.actions);
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap')
@import "../../utils/theme.sass"

.title_screen
  display: flex
  flex-direction: column
  justify-content: center

.header
  display: flex
  flex-direction: column
  align-items: center
  margin: 0 1rem 1rem 1rem
  text-align: center

.header__title
  font-size: 3rem
  margin: 1rem 0 1rem 0
  font-weight: normal

.header__description
  margin: 0

.header__logo
  width: 8rem
  opacity: 0.9

.page_break
  width: 50%
  background: $secondary-colour
  border: 0
  height: 3px
  margin: 1rem auto

.actions
  display: flex
  justify-content: center
  margin: 1rem

.action
  +item-style
  display: flex
  flex-direction: column
  align-items: center
  margin: 0 0.7rem
  width: 7rem
  border-radius: 0.5rem
  cursor: pointer
  padding: 1rem
  transform: scale(1)
  transition: all 100ms linear
  color: inherit
  text-decoration: none
  &:hover
    transform: scale(1.1)
    background: $item-hover-background

.action__icon
  +icon-style
  width: 4rem

.action__title
  font-size: 1.2rem
  margin: 0.5rem 0 0 0
  font-weight: normal
</style>
