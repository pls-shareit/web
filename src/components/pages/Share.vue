<template lang="pug">
.share(v-if='share !== null')
  component(:is='shareView', :share='share')
.share.share--not-found(v-else)
  h1.share__title 404
  h2.share__subtitle Share not found
  hr.share__page_break
  p.share__text Maybe you have the wrong link, or the share expired or got deleted.
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import type { Component, Ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { getShare } from "@/utils/api";
import type { Share } from "@/utils/api";
import { NEW_ERROR } from "@/utils/mutations";
import ShareMetaView from "@/components/views/ShareMeta.vue";
import LinkShareView from "@/components/views/LinkShare.vue";
import PasteShareView from "@/components/views/PasteShare.vue";
import FileShareView from "@/components/views/FileShare.vue";

const router = useRouter();
const store = useStore();

const emit = defineEmits<{
  (event: "headerContent", data: { view: Component; model: Ref }): void;
}>();

const name = computed(() => router.currentRoute.value.params.share as string);
const share: Ref<Share | null> = ref(null);

const shareView = computed(() => {
  if (share.value === null) return null;
  switch (share.value.type) {
    case "link":
      return LinkShareView;
    case "paste":
      return PasteShareView;
    case "file":
      return FileShareView;
  }
  return null;
});

function update(name: string) {
  if (!name) return;
  getShare(name).then(
    (data) => {
      share.value = data;
      emit("headerContent", { view: ShareMetaView, model: share });
    },
    (error) => {
      store.commit(NEW_ERROR, {
        title: "Error fetching share",
        message: error.message,
      });
      share.value = null;
    },
  );
}

update(name.value);
watch(name, update);
</script>

<style lang="sass" scoped>
@import "../../utils/theme.sass"

.share--not-found
  display: flex
  flex-direction: column
  justify-content: center

.share__title, .share__subtitle, .share__text
  margin: 0
  text-align: center
  font-weight: normal

.share--not-found
  .share__title
    font-size: 10rem

  .share__subtitle
    font-size: 2rem

.share__page_break
  width: 50%
  background: $secondary-colour
  border: 0
  height: 3px
  margin: 1rem auto
</style>
