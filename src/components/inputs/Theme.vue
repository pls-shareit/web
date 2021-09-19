<template lang="pug">
.colour_picker
  .colour_picker__colour(
    v-for='[ name, colour ] in themes.getThemeNames()'
    :style='{ "background-color": colour }'
    @click='themes.setCurrentTheme(name)'
  )
</template>

<script lang="ts" setup>
import { ThemeManager } from "@/utils/themes";

const themes = new ThemeManager();
</script>

<style lang="sass" scoped>
@import "../../utils/theme.sass"

.colour_picker__colour
  width: 1.5rem
  height: 1.5rem
  border-radius: 50%
  border: 1px solid $secondary-colour
  margin-right: 0.5rem
  cursor: pointer
  &:first-of-type
    margin-left: 0.85rem
</style>
