<template lang="pug">
.file
  a(:href='props.share.url' :download='props.share.name').file__download
    img.file__download__icon(src='../../assets/icons/file.svg')
    | Download!
  table.file__info
    tr
      td Name
      td {{ props.share.name }}
    tr
      td Size
      td {{ prettyFileSize(props.share.file.size) }}
    tr
      td Type
      td {{ props.share.contentType }}
</template>

<script lang="ts" setup>
import type { FileShare } from "@/utils/api";
import { prettyFileSize } from "@/utils/prettifiers";

const props = defineProps<{ share: FileShare }>();
</script>

<style lang="sass" scoped>
@import "../../utils/theme.sass"

.file
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: 3rem
  height: 100%

.file__download
  +input-style
  color: inherit
  text-decoration: none
  display: flex
  font-size: 2rem
  border-radius: 0.5rem
  width: min-content

.file__download__icon
  +icon-style
  width: 1.5em

.file__info
  border-collapse: separate
  border-spacing: 0.5rem
  tr:first-child
    td:first-child
      border-top-left-radius: 1rem
    td:last-child
      border-top-right-radius: 1rem
  tr:last-child
    td:first-child
      border-bottom-left-radius: 1rem
    td:last-child
      border-bottom-right-radius: 1rem

.file__info td
  +item-style
  padding: 1rem
</style>
