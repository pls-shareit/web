<template lang="pug">
select.language_picker(v-if='languages && languages.length' :value='modelValue' @input='update')
  option(v-for='language in languages' :value='language') {{ language }}
input.language_picker(v-else :value='modelValue' @input='update' placeholder='Highlighting Language')
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const languages = computed(
  () => store.state.restrictions.highlightingLanguages,
);

const props = defineProps<{
  modelValue: string;
}>();
const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

function update(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  emit("update:modelValue", value);
}
</script>

<style lang="sass" scoped>
@import "../../utils/theme.sass"

.language_picker
  +input-style
</style>
