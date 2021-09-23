<template lang="pug">
.link_picker(:class='{"link_picker--error": error}')
  input.link_picker__input(type='url' v-model='value' placeholder='Link to shorten...')
  .link_picker__error(v-if='error') {{ error }}
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import type { Ref } from "vue";
import { useStore } from "vuex";

const props = defineProps<{
  modelValue: string | null;
}>();
const emit = defineEmits<{
  (event: "update:modelValue", value: string | null): void;
}>();

const store = useStore();
const error: Ref<string | null> = ref(null);
const value = ref(props.modelValue);

watch(value, (newValue) => {
  store.state.restrictions
    .linkAllowed(newValue)
    .onOk(() => {
      emit("update:modelValue", newValue);
      error.value = null;
    })
    .onError((message: string) => {
      emit("update:modelValue", null);
      error.value = message;
    });
});
</script>

<style lang="sass" scoped>
@import "../../utils/theme.sass"

.link_picker:focus-within, .link_picker:hover
  .link_picker__input, .link_picker__error
    background: $item-hover-background

.link_picker__input
  +input-style
  width: 100%

.link_picker--error > .link_picker__input
  border-bottom: none

.link_picker__error
  +input-style
  padding-top: 0
  border-top: none
  font-size: 0.7em
</style>
