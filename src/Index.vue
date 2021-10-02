<template lang="pug">
.index
  .index__top_bar
    router-link(to='/')
      img.index__top_bar__icon(src='./assets/icons/home.svg')
    transition(name='index__top_bar__content-')
      component(
        v-if='headerContentView && headerContentModel'
        :is='headerContentView'
        v-model='headerContentModel.value')
      component(v-else-if='headerContentView' :is='headerContentView')
      .placeholder(v-else)
    SettingsMenu.index__top_bar__settings
  router-view(v-slot='{ Component }')
    transition(name='screen-')
      component.screen(@create='create' @headerContent='setHeaderContent' :is='Component')
  Errors
</template>

<script lang="ts" setup>
import { ref, shallowRef } from "vue";
import type { Ref, Component } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { UPDATE_ABILITIES, NEW_ERROR } from "@/utils/mutations";
import type { NewShare } from "@/utils/api";
import SettingsMenu from "@/components/SettingsMenu.vue";
import Errors from "@/components/Errors.vue";

const store = useStore();
const router = useRouter();
store.dispatch(UPDATE_ABILITIES);

const headerContentView: Ref<Component | null> = shallowRef(null);
const headerContentModel: Ref<Ref | null> = ref(null);

function setHeaderContent({
  model,
  view,
}: {
  model: Ref | null;
  view: Component | null;
}) {
  headerContentModel.value = model;
  headerContentView.value = view;
}

function create(promise: Promise<NewShare>) {
  promise.then(
    (link: NewShare) => router.push(`/${link.name}`),
    (error: string) =>
      store.commit(NEW_ERROR, { title: "Creation error", message: error }),
  );
}

router.beforeEach(() => {
  headerContentModel.value = null;
  headerContentView.value = null;
});
</script>

<style lang="sass">
@import "./utils/theme.sass"

.index
  height: 100vh
  overflow-y: hidden

.index__top_bar
  display: flex
  width: 100%
  background: $background
  position: relative
  z-index: 9

.index__top_bar__settings
  margin-left: auto

.index__top_bar__icon
  +icon-style
  width: $header-icon-size
  padding: $header-icon-padding + $header-icon-margin
  cursor: pointer

$screen-height: "(100vh - #{$header-icon-size + ($header-icon-padding + $header-icon-margin) * 2})"

.screen
  position: relative
  box-sizing: border-box
  height: calc(#{$screen-height})

.screen--enter-active, .screen--leave-active
  transition: top 200ms ease-in-out

.screen--enter-from, .screen--leave-from
  top: 0

.screen--home.screen--enter-from
  top: calc(-2 * #{$screen-height})

.screen--enter-to, .screen--home.screen--leave-to
  top: calc(-1 * #{$screen-height})

.screen--leave-to
  top: calc(#{$screen-height})

.index__top_bar__content--enter-active, .index__top_bar__content--leave-active
  transform-origin: left center
  transition: transform 200ms linear

.index__top_bar__content--enter-from, .index__top_bar__content--leave-to
  transform: scaleX(0)

.index__top_bar__content--enter-to, .index__top_bar__content--leave-from
  transform: scaleX(1)
</style>
