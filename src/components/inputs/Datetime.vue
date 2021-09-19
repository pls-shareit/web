<template lang="pug">
.datetime_picker
  .date
    select.select(v-model='day' :disabled='disabled')
      option(v-for='day of daysInMonth' :value='day') {{ day }}
    select.select(v-model='month' :disabled='disabled')
      option(v-for='[ monthNum, monthName ] in MONTH_NAMES.entries()' :value='monthNum') {{ monthName }}
    select.select(v-model='year' :disabled='disabled')
      option(v-for='offset in YEAR_RANGE' :value='MIN_YEAR + offset - 1') {{ MIN_YEAR + offset - 1 }}
  .separator(:class='{ "separator--disabled": disabled }') at
  .time
    select.select(v-model='hour' :disabled='disabled')
      option(v-for='hour in 24' :value='hour - 1') {{ ("0" + (hour - 1)).slice(-2) }}
    select.select(v-model='minute' :disabled='disabled')
      option(v-for='minute in 60' :value='minute - 1') {{ ("0" + (minute - 1)).slice(-2) }}
</template>

<script lang="ts" setup>
import { computed } from "vue";

const emit = defineEmits<{
  (event: "update:modelValue", value: Date): void;
}>();
const props = defineProps<{
  disabled: boolean;
  modelValue: Date;
}>();

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MIN_YEAR = new Date().getFullYear();
const YEAR_RANGE = 20;

function update(updater: (value: Date) => void) {
  const value = props.modelValue;
  updater(value);
  emit("update:modelValue", value);
}

const year = computed({
  get(): number {
    return props.modelValue.getFullYear();
  },
  set(year: number) {
    update((d) => d.setFullYear(year));
  },
});
const month = computed({
  get(): number {
    return props.modelValue.getMonth();
  },
  set(month: number) {
    update((d) => d.setMonth(month));
    day.value = Math.min(day.value, daysInMonth.value);
  },
});
const day = computed({
  get(): number {
    return props.modelValue.getDate();
  },
  set(day: number) {
    update((d) => d.setDate(day));
  },
});
const hour = computed({
  get(): number {
    return props.modelValue.getHours();
  },
  set(hour: number) {
    update((d) => d.setHours(hour));
  },
});
const minute = computed({
  get(): number {
    return props.modelValue.getMinutes();
  },
  set(minute: number) {
    update((d) => d.setMinutes(minute));
  },
});

const daysInMonth = computed((): number => {
  return new Date(
    year.value,
    month.value + 1, // The next month (wraps).
    0, // The last day of the previous month, which is the current month.
  ).getDate();
});
</script>

<style lang="sass" scoped>
@import "../../utils/theme.sass"

.datetime_picker
  display: flex
  align-items: center
  flex-wrap: wrap
  row-gap: 0.5rem

.separator
  margin: 0 0.5rem

.separator--disabled
  color: $secondary_colour

.select
  +input-style
</style>
