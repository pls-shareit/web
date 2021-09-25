<template lang="pug">
.create
  .create__header
    img.icon.create__header__icon(
      src='../assets/icons/home.svg'
      @click='store.commit(SWITCH_SCREEN, "title")')
    NameInput(v-model='name')
  slot
  .create__footer
    ExpiryInput(v-model='expiry')
    button.create__button(@click='create') Create!
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { Ref } from "vue";
import { useStore } from "vuex";

import { SWITCH_SCREEN } from "@/utils/mutations";
import { NoExpiry } from "@/utils/expiry";
import type { Expiry } from "@/utils/expiry";
import ExpiryInput from "@/components/inputs/Expiry.vue";
import NameInput from "@/components/inputs/Name.vue";

const store = useStore();
const emit = defineEmits<{
  (event: "create", data: { name: string; expiry: number | null }): void;
}>();

const expiry: Ref<Expiry> = ref(new NoExpiry());
const name = ref("");

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
  min-height: 100vh

.create__header
  display: flex
  width: calc(100vw - $settings-icon-width)

.create__header__icon
  width: $header-icon-size
  padding: $header-icon-padding + $header-icon-margin
  cursor: pointer

.create__footer
  display: flex
  flex-wrap: wrap
  justify-content: space-between
  margin: 0.5rem 1rem

.create__button
  +input-style
  margin: 0.5rem 0
</style>
