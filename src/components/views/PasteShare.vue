<template lang="pug">
.paste
  .paste__gutter
    span(v-for='number in lines') {{ number }}
      br
  pre.paste__content#share_paste_view(:class='language') {{ props.share.paste }}
</template>

<script lang="ts" setup>
import hljs from "highlight.js";
import { computed, onMounted, onUpdated } from "vue";

import type { PasteShare } from "@/utils/api";

const props = defineProps<{ share: PasteShare }>();
const language = computed(() => {
  if (props.share.language && props.share.language !== "auto") {
    return `language-${props.share.language}`;
  }
  return "";
});
const lines = computed(() => props.share.paste.trim().split("\n").length + 1);

function updateHighlight() {
  const elem = document.getElementById("share_paste_view") as HTMLElement;
  if (elem) hljs.highlightElement(elem);
}

onUpdated(updateHighlight);
onMounted(updateHighlight);
</script>

<style lang="sass" scoped>
@import "../../utils/theme.sass"
@import "../../utils/highlight.sass"

.paste
  box-sizing: border-box
  display: flex
  align-items: flex-start
  height: 100%
  width: 100%
  overflow-y: auto
  font-family: $code-font
  font-size: 0.8rem
  background: $gutter-background

.paste__content
  font-family: $code-font
  margin: 0
  width: 100%
  padding: 0.5rem
  overflow-x: auto

.paste__gutter
  background: $gutter-background
  color: $gutter-color
  text-align: right
  padding: 0.5rem
</style>

<style lang="sass">
/* We need to import the theme without applying scoping protection for it to
   work properly.

@import "../../utils/highlight.sass"
</style>
