<template lang="pug">
CreateScreen
  Editor(v-model='text')
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useStore } from "vuex";

import CreateScreen from "@/components/CreateScreen.vue";
import Editor from "@/components/inputs/Editor.vue";

const store = useStore();
const text = ref({
  text: "",
  language: store.state.restrictions.defaultHighlightingLanguage,
});
</script>
