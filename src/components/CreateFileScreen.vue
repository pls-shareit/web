<template lang="pug">
CreateScreen(@create='create')
  .file
    FileInput(v-model='file')
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { Ref } from "vue";
import { useStore } from "vuex";

import { createFileShare } from "@/utils/api";
import CreateScreen from "@/components/CreateScreen.vue";
import FileInput from "@/components/inputs/File.vue";

const store = useStore();
const file: Ref<File | null> = ref(null);
const emit = defineEmits<{(event: "create", promise: Promise<string>): void}>();

function create({ name, expiry }: { name: string, expiry: number | null}) {
  if (!file.value) return;
  emit(
    "create",
    createFileShare({
      name,
      expiry,
      password: store.state.password,
      mimeType: file.value.type,
      data: file.value,
      giveFrontendUrl: true,
    }),
  );
}
</script>

<style lang="sass" scoped>
.file
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
</style>
