<template lang="pug">
.share
  span Link to the share: !{''}
  a(:href='url') {{ url }}
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const name = computed(() => router.currentRoute.value.params.share);
const url = computed(() => `${window.location.origin}/${name.value}`);
</script>
