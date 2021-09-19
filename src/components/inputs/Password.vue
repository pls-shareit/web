<template lang="pug">
.popup_wrapper(:class='{ "popup_wrapper--open": store.state.passwordPickerOpen }')
  .popup
    h3.popup__title Set Password
    p.popup__description Enter a password to create shares.
    input.popup__input(type='password' placeholder='Password' v-model='password')
    .popup__buttons
      .popup__button(type='button' @click='close') Cancel
      .popup__button(type='button' @click='done') Save
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useStore } from "vuex";

import {
  CLOSE_PASSWORD_PICKER,
  SET_PASSWORD,
  UPDATE_ABILITIES,
} from "@/utils/mutations";

const store = useStore();

const password = ref("");

function close(): void {
  store.commit(CLOSE_PASSWORD_PICKER);
}

function done(): void {
  store.commit(SET_PASSWORD, password.value);
  store.dispatch(UPDATE_ABILITIES);
  close();
}
</script>

<style lang="sass" scoped>
@import "../../utils/theme.sass"

$transition-time: 100ms

.popup_wrapper
  position: fixed
  top: 0
  left: 0
  width: 0
  height: 0
  display: flex
  align-items: center
  justify-content: center
  background: transparent
  z-index: -1
  transition: background $transition-time, width 0s $transition-time, height 0s $transition-time
  .popup
    transform: scale(0)
    transition: transform $transition-time linear

.popup_wrapper--open
  background: $popup-overlay
  z-index: 1
  width: 100vw
  height: 100vh
  transition: background $transition-time, width 0s, height 0s
  .popup
    transform: scale(1)

.popup
  background: $popup-background
  border: $popup-border
  border-radius: 2rem
  display: flex
  flex-direction: column
  align-items: stretch
  text-align: center
  overflow: hidden

.popup__title
  margin: 2rem 2rem 0.5rem 2rem
  font-size: 1.3rem

.popup__description
  margin: 0.5rem 2rem

.popup__input
  margin: 0.5rem 2rem
  padding: 1rem
  +input-style

.popup__buttons
  margin-top: 0.5rem
  display: flex
  align-items: stretch
  border-top: $list-border-width solid $secondary-colour

.popup__button
  // Let the flex box decide its width so all buttons are the same width.
  width: 0
  padding: 1rem
  flex-basis: 0
  flex-grow: 999
  cursor: pointer
  transition: all 100ms linear
  &:not(:last-of-type)
    border-right: $list-border-width solid $secondary-colour
  &:hover
    background: $popup-hover-background
</style>
