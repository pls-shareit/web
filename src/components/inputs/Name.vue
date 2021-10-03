<template lang="pug">
.name_picker(v-if='customNames')
  span.name_picker__prefix(@click='focus')
    span.name_picker__prefix__main(:class='{"name_picker__prefix__main--hidden": props.modelValue}') {{ origin }}
    span.name_picker__prefix__separator /
  .autowidth.name_picker__input_wrapper
    input#name_picker_input.name_picker__input.autowidth__input(
      :value='props.modelValue'
      @input='update'
      :minlength='customNames.minLength'
      :maxlength='customNames.maxLength'
      pattern='[a-z0-9_.~-]*'
      placeholder='name')
    span.autowidth__dummy#dummy {{ props.modelValue || "name" }}
</template>

<script lang="ts" setup>
import { computed, watch } from "vue";
import { useStore } from "vuex";

const props = defineProps<{
  modelValue: string;
}>();
const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const store = useStore();
const customNames = computed(() => store.state.actions.customNames);

const origin = window.location.origin;

watch(customNames, (value) => {
  if (!value) emit("update:modelValue", "");
});

function update(event: Event) {
  const value = (event.target as HTMLInputElement).value
    .toLowerCase()
    .replace(/[^a-z0-9_.~-]/g, "-")
    .substring(0, customNames.value.maxLength);
  emit("update:modelValue", value);
}

function focus() {
  const elem = document.querySelector("#name_picker_input") as HTMLInputElement;
  elem.focus();
  elem.select();
}
</script>

<style lang="sass" scoped>
@import "../../utils/theme.sass"

.name_picker
  display: flex
  align-items: center
  &:focus-within, &:hover
    .name_picker__prefix, .name_picker__input
      background: $item-hover-background

.name_picker__input
  +input-style
  padding: 0.5rem 0
  border-left: none
  text-decoration: underline
  word-wrap: break-word
  cursor: text
  &::placeholder
    text-decoration: underline

.autowidth
  display: inline-block
  position: relative

.autowidth__dummy
  display: inline-block
  visibility: hidden
  white-space: pre
  padding: calc(0.5rem + #{$item-border-width})
  padding-left: 0

.autowidth__input
  position: absolute
  top: 0
  left: 0
  width: 100%
  margin: 0

.name_picker__prefix
  +input-style
  cursor: text
  padding-right: 0
  border-right: none
  overflow: hidden

.name_picker__prefix__main
  display: inline-block
  max-width: 50rem
  transition: all 300ms linear

.name_picker__prefix__main--hidden
    max-width: 0
    opacity: 0
</style>
