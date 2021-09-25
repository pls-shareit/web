<template lang="pug">
CreateScreen
  .file
    FileInput(v-model='file')
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { Ref } from "vue";

import CreateScreen from "@/components/CreateScreen.vue";
import FileInput from "@/components/inputs/File.vue";

const file: Ref<File | null> = ref(null);
</script>

<style lang="sass" scoped>
.file
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
</style>
