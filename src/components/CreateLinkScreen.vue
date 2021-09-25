<template lang="pug">
CreateScreen(@create='create')
  .link
    LinkInput.link__input(v-model='link')
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useStore } from "vuex";

import { createLinkShare } from "@/utils/api";
import CreateScreen from "@/components/CreateScreen.vue";
import LinkInput from "@/components/inputs/Link.vue";

const store = useStore();
const link = ref("");
const emit = defineEmits<{(event: "create", promise: Promise<string>): void}>();

function create({ name, expiry }: { name: string, expiry: number | null}) {
  if (!link.value) return;
  emit(
    "create",
    createLinkShare({
      name,
      expiry,
      password: store.state.password,
      data: link.value,
      giveFrontendUrl: false,
    }),
  );
}
</script>

<style lang="sass" scoped>
.link
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center

.link__input
  margin: 0.5rem
  width: min(calc(100% - 1rem), max(40%, 500px))
</style>
