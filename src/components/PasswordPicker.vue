<template lang="pug">
.popup_wrapper(:class='{ "popup_wrapper--open": open }')
  .popup
    h3.popup__title Set Password
    p.popup__description Enter a password to create shares.
    input.popup__input(type='password' placeholder='Password' v-model='password')
    .popup__buttons
      .popup__button(type='button' @click='$emit("close")') Cancel
      .popup__button(type='button' @click='done') Save
</template>

<script lang="ts">
import { Options, Vue, prop } from "vue-class-component";

class Props {
  open = prop({ default: false });
}

@Options({ name: "PasswordPicker" })
export default class PasswordPicker extends Vue.with(Props) {
  password = "";

  done(): void {
    localStorage.setItem("shareit-password", this.password);
    this.$emit("close");
  }
}
</script>

<style lang="sass" scoped>
@import "../utils/theme.sass"

.popup_wrapper
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  display: flex
  align-items: center
  justify-content: center
  background: transparent
  transition: all 100ms linear
  z-index: -1
  .popup
    transform: scale(0)
    transition: all 100ms linear

.popup_wrapper--open
  background: $popup-overlay
  z-index: 1
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
  border: 0
  font-family: inherit
  font-size: inherit
  color: inherit
  padding: 1rem
  +item-style
  transition: all 100ms linear
  &:focus
    background: $item-hover-background

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
