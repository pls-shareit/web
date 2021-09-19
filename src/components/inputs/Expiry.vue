<template lang="pug">
.expiry
  RadioButton.expiry__mode(option='never' v-model='mode' v-if='expiryAllowed(null)')
    span.expiry__mode__label Expire never
  RadioButton.expiry__mode(option='relative' v-model='mode' v-if='relativeOptions.length > 1')
    span.expiry__mode__label Expire after
    select.select(:disabled='mode !== "relative"' v-model='relativeValue')
      option(
        v-for='[ seconds, label ] of relativeOptions'
        :value='seconds') {{ label }}
  RadioButton.expiry__mode(option='constRelative' v-model='mode' v-if='relativeOptions.length === 1')
    span.expiry__mode__label Expire after {{ relativeOptions[0][1] }}
  RadioButton.expiry__mode(option='absolute' v-model='mode')
    span.expiry__mode__label Expire on
    DatetimeInput(:disabled='mode !== "absolute"' v-model='absoluteValue')
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";

import { AbsoluteExpiry, RelativeExpiry, NoExpiry } from "@/utils/expiry";
import type { Expiry } from "@/utils/expiry";
import DatetimeInput from "@/components/inputs/Datetime.vue";
import RadioButton from "@/components/inputs/RadioButton.vue";

const store = useStore();

const emit = defineEmits<{
  (event: "update:modelValue", value: Expiry): void;
}>();

const ALL_RELATIVE_OPTIONS: [number, string][] = [
  [60 * 5, "five minutes"],
  [60 * 60, "an hour"],
  [60 * 60 * 24, "a day"],
  [60 * 60 * 24 * 10, "ten days"],
  [60 * 60 * 24 * 60, "two months"],
  [60 * 60 * 24 * 365, "a year"],
];

function expiryAllowed(expiry: number | null): boolean {
  const max = store.state.resitrictions.maxExpiryTime;
  if (expiry === null) return max === null;
  return max === null || expiry <= max;
}

const relativeOptions = computed(() => {
  return ALL_RELATIVE_OPTIONS.filter(([seconds, _label]) =>
    expiryAllowed(seconds),
  );
});

const mode = ref("never");
const absoluteValue = ref(new Date(new Date().getTime() + 3600000));
const relativeValue = ref(300); // Seconds.

function getValue() {
  switch (mode.value) {
    case "never":
      return new NoExpiry();
    case "relative":
      return new RelativeExpiry(relativeValue.value);
    case "constRelative":
      return new RelativeExpiry(relativeOptions.value[0][0]);
    case "absolute":
      return new AbsoluteExpiry(absoluteValue.value);
  }
  console.error(`Unexpected expiry picker mode ${mode.value}.`);
  return new NoExpiry();
}

watch([mode, absoluteValue, relativeValue], () => {
  emit("update:modelValue", getValue());
});
</script>

<style lang="sass" scoped>
@import "../../utils/theme.sass"

.expiry
  display: flex
  flex-direction: column

.expiry__mode
  display: flex
  align-items: center
  flex-wrap: wrap
  row-gap: 0.5rem
  margin: 0.5rem
  min-height: 2rem
  cursor: text

.expiry__mode__label
  padding-right: 1ch

.select
  +input-style
</style>
