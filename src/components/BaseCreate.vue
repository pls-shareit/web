<template lang="pug">
.create
  slot
  .create__footer
    ExpiryInput(v-model='expiry')
    button.create__button(@click='create') Create!
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { Component, Ref } from "vue";

import { NoExpiry } from "@/utils/expiry";
import type { Expiry } from "@/utils/expiry";
import ExpiryInput from "@/components/inputs/Expiry.vue";
import NameInput from "@/components/inputs/Name.vue";

const emit = defineEmits<{
  (event: "create", data: { name: string; expiry: number | null }): void;
  (event: "headerContent", data: { view: Component; model: Ref }): void;
}>();

const expiry: Ref<Expiry> = ref(new NoExpiry());
const name = ref("");
emit("headerContent", { view: NameInput, model: name });

function create() {
  emit("create", {
    name: name.value,
    expiry: expiry.value.getSeconds(),
  });
}
</script>

<style lang="sass" scoped>
@import "../utils/theme.sass"

$settings-icon-width: $header-icon-size + 2 * ($header-icon-margin + $header-icon-padding)

.create
  display: flex
  flex-direction: column
  justify-content: space-between

.create__footer
  display: flex
  flex-wrap: wrap
  justify-content: space-between
  margin: 0.5rem 1rem

.create__button
  +input-style
  margin: 0.5rem 0
</style>
