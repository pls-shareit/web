<template lang="pug">
.component-root
  .settings(
    :class='{ "settings--open": openFromClick || openFromHover }'
    @mouseover='openFromHover = true'
    @mouseleave='openFromHover = false'
  )
    .settings__list
      .settings__setting(@click='passwordPickerOpen = true')
        img(src='../assets/icons/key.svg').settings__setting__icon.icon
        span.settings__setting__name Set Password
      ThemePicker.settings__setting
      a(href='https://arty.li' target='_blank').settings__setting
        .settings__setting__icon &copy;
        .settings__setting__name Artemis 2021
    img(src='../assets/icons/gear.svg' @click='onClick').settings__icon.icon
  PasswordPicker(:open='passwordPickerOpen' @close='passwordPickerOpen = false')
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import ThemePicker from "./ThemePicker.vue";
import PasswordPicker from "./PasswordPicker.vue";

@Options({
  name: "SettingsMenu",
  components: { ThemePicker, PasswordPicker },
})
export default class SettingsMenu extends Vue {
  openFromClick = false;
  openFromHover = false;
  passwordPickerOpen = false;

  /** Handle an click (or tap) on the icon.
   *
   * This should keep the settings open until it's clicked again. */
  onClick(): void {
    this.openFromClick = !this.openFromClick;
    // Mobile user agents will simulate hover events when the user taps, so
    // it will look like they're hovering on the element until they tap
    // somewhere else on the screen.
    if (!this.openFromClick) this.openFromHover = false;
  }
}
</script>

<style lang="sass" scoped>
@import "../utils/theme.sass"

$setting-icon-margin: 0.5rem
$setting-icon-size: 2.2rem
$setting-icon-padding: 0.5rem
$setting-height: $setting-icon-size + $setting-icon-padding * 2
$setting-height-half: $setting-height * 0.5

.settings
  position: fixed
  top: $setting-icon-margin
  right: $setting-icon-margin

.settings--open
  .settings__list
    transform: scale(1)
  .settings__icon
    transform: rotate(90deg)
    &:hover
      transform: scale(1.1) rotate(90deg)

.settings__icon
  position: absolute
  cursor: pointer
  top: $setting-icon-padding
  right: $setting-icon-padding
  width: $setting-icon-size
  transition: all 100ms linear
  &:hover
    transform: scale(1.1)

.settings__list
  +item-style
  position: fixed
  top: $setting-icon-margin
  right: $setting-icon-margin
  min-height: $setting-height
  border-radius: $setting-height-half
  transform-origin: calc(100% - #{$setting-icon-margin * 2}) $setting-icon-margin * 2
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

.settings__setting__icon
  width: 1.5rem
  margin: 0 0.5rem 0 #{$setting-height-half - 0.75rem}
  text-align: center
</style>
