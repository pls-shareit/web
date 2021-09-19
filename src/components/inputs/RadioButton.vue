<template lang="pug">
label.radio(:for='id')
  input.radio__input(
    type='radio'
    :checked='isChecked'
    :id='id'
    :value='option'
    @change='update')
  .radio__button
  slot
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
  modelValue: string;
  option: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const id = "autoid-radiobutton-" + Math.random(); // Good enough.

const isChecked = computed(() => props.modelValue === props.option);

function update(event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
}
</script>

<style lang="sass" scoped>
@import "../../utils/theme.sass"

.radio__input
  opacity: 0
  width: 0
  height: 0
  margin: 0
  padding: 0

.radio__button
  position: relative
  width: 1rem
  height: 1rem
  border-radius: 50%
  background: $item-background
  border: $item-border
  margin-right: 0.5rem
  cursor: pointer
  transition: background 100ms linear
  .radio:hover > &
    background: $item-hover-background
  &::after
    content: ''
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: $text-colour
    border-radius: 50%
    transform: scale(0)
    transition: transform 50ms linear
    .radio__input:checked + &
      transform: scale(0.9)
</style>
