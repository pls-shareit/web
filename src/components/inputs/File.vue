<template lang="pug">
label.file(
    @dragover='event => event.preventDefault()'
    @dragenter='dragRefCount += 1'
    @dragleave='dragRefCount -= 1'
    @drop='onDrop'
    :class='{ "file--empty": props.modelValue === null, "file--drag-over": dragRefCount }')
  img.file__icon(src='../../assets/icons/upload.svg' v-if='props.modelValue === null')
  img.file__icon(src='../../assets/icons/file.svg' v-else)
  .file__main_text(v-if='props.modelValue === null') Drag and drop a file to upload!
  .file__main_text(v-else) {{ props.modelValue.name }}
  .file__small_text(v-if='props.modelValue === null') ...or click to open a file picker
  .file__small_text(v-else) {{ prettyFileSize(props.modelValue.size) }}
  input.file__input(type='file' @input='onInput' :id='id')
</template>

<script lang="ts" setup>
import { ref } from "vue";

const id = "autoid-file-input-" + Math.random();

const props = defineProps<{ modelValue: File | null }>();
const emit = defineEmits<{
  (event: "update:modelValue", value: File | null): void;
}>();

const dragRefCount = ref(0);

function prettyFileSize(bytes: number): string {
  if (bytes < 1000) return `${bytes} bytes`;
  const units = "kMGTPEZY";
  let power = -1;
  do {
    bytes /= 1000;
    power++;
  } while (bytes >= 1000 && power < units.length - 1);
  return `${bytes.toFixed(2)} ${units[power]}B`;
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  if (!event.dataTransfer || event.dataTransfer.files.length === 0) return;
  dragRefCount.value = 0;
  emit("update:modelValue", event.dataTransfer.files[0]);
}

function onInput() {
  const input = document.getElementById(id) as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  emit("update:modelValue", input.files[0]);
}
</script>

<style lang="sass" scoped>
@import "../../utils/theme.sass"

.file
  +item-style
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column
  border-radius: 1rem
  padding: 1rem
  cursor: pointer
  transition: all 100ms linear
  &:hover, &.file--drag-over
    background: $item-hover-background
    transform: scale(1.05)

.file--empty
  color: $secondary-colour
  .file__icon
    filter: $secondary-icon-filter

.file__input
  visibility: hidden

.file__icon
  +icon-style
  width: 10rem

.file__small_text
  font-size: 0.8rem
</style>
