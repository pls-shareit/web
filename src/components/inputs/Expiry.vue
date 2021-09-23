<template lang="pug">
.expiry
  span Expire ...
  select.select(v-model='selectedExpiryLabel')
    option(v-for='label of expiryOptions.keys()' :value='label') {{ label }}
  DatetimeInput(v-model='absoluteValue' v-if='absoluteSelected' :disabled='false')
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import type { Ref } from "vue";
import { useStore } from "vuex";

import { AbsoluteExpiry, RelativeExpiry, NoExpiry } from "@/utils/expiry";
import type { Expiry } from "@/utils/expiry";
import DatetimeInput from "@/components/inputs/Datetime.vue";

const store = useStore();

const props = defineProps<{
  modelValue: Expiry;
}>();
const emit = defineEmits<{
  (event: "update:modelValue", value: Expiry): void;
}>();

const absoluteValue = ref(new Date(new Date().getTime() + 3600000));
const absoluteExpiry = computed(() => new AbsoluteExpiry(absoluteValue.value));
const absoluteSelected = computed(
  () => selectedExpiryLabel.value === "on this date:",
);
const selectedExpiryLabel = ref("never");

const allExpiryOptions = new Map<string, Ref<Expiry>>([
  ["never", ref(new NoExpiry())],
  ["in five minutes", ref(new RelativeExpiry(60 * 5))],
  ["in an hour", ref(new RelativeExpiry(60 * 60))],
  ["in a day", ref(new RelativeExpiry(60 * 60 * 24))],
  ["in ten days", ref(new RelativeExpiry(60 * 60 * 24 * 10))],
  ["in two months", ref(new RelativeExpiry(60 * 60 * 24 * 60))],
  ["in a year", ref(new RelativeExpiry(60 * 60 * 24 * 365))],
  ["on this date:", absoluteExpiry],
]);

const expiryOptions = computed(() => {
  const max = store.state.restrictions.maxExpiryTime;
  if (max === null) return allExpiryOptions;
  const options = new Map();
  for (const [label, { value }] of options) {
    if (
      value instanceof AbsoluteExpiry ||
      (value instanceof RelativeExpiry && value.getSeconds() <= max)
    ) {
      options.set(label, value);
    }
  }
  if (options.size < 2) {
    options.set(`maximum (${max}s)`, ref(new RelativeExpiry(max)));
  }
  if (
    !Array.from(options.values()).some(
      ({ value }) => value === props.modelValue,
    )
  ) {
    if (options.has("never")) {
      emit("update:modelValue", options.get("never"));
    } else {
      emit("update:modelValue", options.get("on this date:"));
    }
  }
  return options;
});

watch([selectedExpiryLabel, absoluteValue], () => {
  emit(
    "update:modelValue",
    expiryOptions.value.get(selectedExpiryLabel.value).value,
  );
});
</script>

<style lang="sass" scoped>
@import "../../utils/theme.sass"

.expiry
  display: flex
  flex-wrap: wrap
  align-items: center

.select
  margin: 0.5rem 1ch
  +input-style
</style>
