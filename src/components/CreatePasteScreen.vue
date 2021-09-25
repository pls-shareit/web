<template lang="pug">
CreateScreen(@create='create')
  Editor(v-model='data')
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useStore } from "vuex";

import { createPasteShare } from "@/utils/api";
import CreateScreen from "@/components/CreateScreen.vue";
import Editor from "@/components/inputs/Editor.vue";

const store = useStore();
const data = ref({
  text: "",
  language: store.state.restrictions.defaultHighlightingLanguage,
});
const emit = defineEmits<{(event: "create", promise: Promise<string>): void}>();

function create({ name, expiry }: { name: string, expiry: number | null}) {
  if (!data.value.text) return;
  emit(
    "create",
    createPasteShare({
      name,
      expiry,
      password: store.state.password,
      data: data.value.text,
      language: data.value.language,
      giveFrontendUrl: true,
    }),
  );
}
</script>
