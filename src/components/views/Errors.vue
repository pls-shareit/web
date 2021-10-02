<template lang="pug">
.errors
  .error(v-for='error of errors')
    .error__title {{ error.title }}
    .error__message {{ error.message }}
    .error__dismiss(@click='dismissError(error)') x
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";

import { DISMISS_ERROR } from "@/utils/mutations";
import type { ErrorMessage } from "@/utils/data";

const store = useStore();

function dismissError(error: ErrorMessage): void {
  store.commit(DISMISS_ERROR, error);
}

const errors = computed((): ErrorMessage[] => store.state.errors);
</script>

<style lang="sass" scoped>
@import "../../utils/theme.sass"

.errors
  position: fixed
  right: 0
  bottom: 0

.error
  position: relative
  +item-style
  border-radius: 1rem
  padding: 1rem
  margin: 0.5rem

.error__title, .error__message
  margin-right: 2rem

.error__message
  margin-top: 1rem
  font-size: 0.8rem

.error__dismiss
  position: absolute
  top: calc(1rem - 0.5ex)
  right: 1rem
  cursor: pointer
</style>
