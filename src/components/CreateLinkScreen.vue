<template lang="pug">
CreateScreen
  .link
    LinkInput.link__input(v-model='link')
</template>

<script lang="ts" setup>
import { ref } from "vue";

import CreateScreen from "@/components/CreateScreen.vue";
import LinkInput from "@/components/inputs/Link.vue";

const link = ref("");
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
