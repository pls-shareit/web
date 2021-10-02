<template lang="pug">
a.share_link(:href='props.modelValue.url') {{ props.modelValue.url }}
</template>

<script lang="ts" setup>
import type { Share } from "@/utils/api";

const props = defineProps<{ modelValue: Share }>();
</script>

<style lang="sass" scoped>
.share_link
  color: inherit
  margin: auto 0
</style>
