<template lang="pug">
.link
  a.link__link(:href='props.share.url')
  span points to
  a.link__link(:href='props.share.link')
</template>

<script lang="ts" setup>
import type { LinkShare } from "@/utils/api";

const props = defineProps<{ share: LinkShare }>();
</script>

<style lang="sass" scoped>
@import "../../utils/theme.sass"

.link
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: 1rem
  height: 100%

.link__link
  +input-style
  text-decoration: underline
  padding: 1rem
  border-radius: 1rem
  &::after
    content: attr(href)
</style>
