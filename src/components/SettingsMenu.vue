<template lang="pug">
.settings(
  :class='{ "settings--open": openFromClick || openFromHover }'
  @mouseover='openFromHover = true'
  @mouseleave='openFromHover = false'
  v-bind='$attrs'
)
  .settings__list
    .settings__setting(@click='store.commit(OPEN_PASSWORD_PICKER)' v-if='store.state.actions.login')
      img(src='../assets/icons/key.svg').settings__setting__icon.settings__setting__icon--svg
      span.settings__setting__name Set Password
    ThemeInput.settings__setting
    a(href='https://arty.li' target='_blank').settings__setting
      .settings__setting__icon &copy;
      .settings__setting__name Artemis 2021
  img(src='../assets/icons/gear.svg' @click='onClick').settings__icon
PasswordInput
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useStore } from "vuex";

import { OPEN_PASSWORD_PICKER } from "@/utils/mutations";
import ThemeInput from "@/components/inputs/Theme.vue";
import PasswordInput from "@/components/inputs/Password.vue";

const store = useStore();

const openFromClick = ref(false);
const openFromHover = ref(false);

/** Handle an click (or tap) on the icon.
 *
 * This should keep the settings open until it's clicked again. */
function onClick(): void {
  openFromClick.value = !openFromClick.value;
  // Mobile user agents will simulate hover events when the user taps, so
  // it will look like they're hovering on the element until they tap
  // somewhere else on the screen.
  if (!openFromClick.value) openFromHover.value = false;
}
</script>

<style lang="sass" scoped>
@import "../utils/theme.sass"

$setting-height: $header-icon-size + $header-icon-padding * 2
$setting-height-half: $setting-height * 0.5

.settings
  position: relative
  margin-top: $header-icon-margin
  margin-right: $header-icon-margin
  z-index: 10

.settings--open
  .settings__list
    transform: scale(1)
  .settings__icon
    transform: rotate(90deg)
    &:hover
      transform: scale(1.1) rotate(90deg)

.settings__icon
  +icon-style
  position: absolute
  cursor: pointer
  top: $header-icon-padding
  right: $header-icon-padding
  width: $header-icon-size
  transition: all 100ms linear
  &:hover
    transform: scale(1.1)

.settings__list
  +item-style
  position: absolute
  width: max-content
  right: 0
  min-height: $setting-height
  border-radius: $setting-height-half
  transform-origin: calc(100% - #{$header-icon-margin * 2}) $header-icon-margin * 2
  transform: scale(0)
  transition: all 100ms linear

.settings__setting
  display: flex
  align-items: center
  height: $setting-height
  padding-right: $setting-height + 0.8rem
  background: transparent
  transition: all 100ms linear
  cursor: pointer
  text-decoration: none
  color: inherit
  &:hover
    background: $item-hover-background
  &:first-child
    border-top-left-radius: $setting-height-half
    border-top-right-radius: $setting-height-half
  &:last-child
    border-bottom-left-radius: $setting-height-half
    border-bottom-right-radius: $setting-height-half
  &:not(:last-child)
    border-bottom: $list-border-width solid $secondary-colour

.settings__setting__icon--svg
  +icon-style

.settings__setting__icon
  width: 1.5rem
  margin: 0 0.5rem 0 #{$setting-height-half - 0.75rem}
  text-align: center
</style>
