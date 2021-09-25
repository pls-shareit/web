<template lang="pug">
.editor
  .editor__gutter
    span(v-for='number in lines') {{ number }}
      br
  textarea.editor__input(@input='update' spellcheck='false')
  LanguageInput.editor__language(v-model='language')
</template>

<script lang="ts" setup>
import { watch, ref, computed } from "vue";

import LanguageInput from "@/components/inputs/Language.vue";

type PasteData = { text: string; language: string };

const props = defineProps<{ modelValue: PasteData }>();
const emit = defineEmits<{
  (event: "update:modelValue", value: PasteData): void;
}>();

const language = ref(props.modelValue.language);
const lines = computed(() => props.modelValue.text.split("\n").length);

function update(event: Event) {
  const input = event.target as HTMLTextAreaElement;
  input.style.height = "";
  input.style.height = `${input.scrollHeight}px`;
  emit("update:modelValue", {
    text: input.value,
    language: props.modelValue.language,
  });
}

watch(language, (newValue) => {
  emit("update:modelValue", {
    text: props.modelValue.text,
    language: newValue,
  });
});
</script>

<style lang="sass" scoped>
@import "../../utils/theme.sass"

.editor
  +item-style
  box-sizing: border-box
  display: flex
  align-items: flex-start
  height: 100%
  width: 100%
  overflow-y: auto
  padding: 0.5rem 0
  border-left: 0
  border-right: 0
  position: relative

.editor__gutter, .editor__input
  font-family: $code-font
  min-height: 100%

.editor__gutter
  min-width: 3ch
  padding-right: 1ch
  text-align: right
  color: $secondary-colour

.editor__input
  background: transparent
  outline: none
  border: none
  padding: 0
  margin: 0
  font-size: inherit
  color: inherit
  resize: none
  width: 100%

.editor__language
  position: absolute
  top: calc(-1 * #{$item-border-width})
  right: 1rem
</style>
