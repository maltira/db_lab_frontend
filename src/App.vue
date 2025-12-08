<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { computed, onMounted } from 'vue'
import Notification from '@/components/ui/Notification.vue'
import { useAppInit } from '@/composables/useAppInit.ts'
import { useRoute } from 'vue-router'

const { isAppReady, initApp } = useAppInit()
const route = useRoute()

const hideSidebar = computed(() => {
  return route.meta.hideSidebar && route.meta.hideSidebar === true
})

onMounted(async () => {
  await initApp()
})
</script>

<template>
  <img id="printing-logotype" src="/img/gims.png" alt="logo" :style="{display: 'none'}"/>
  <AppSidebar v-if="!hideSidebar" />
  <div id="content" v-if="isAppReady">
    <RouterView />
  </div>
  <Notification />
</template>

<style lang="scss">
#app {
  display: flex;
}
#content {
  padding: 30px;
  width: 100%;
}

@media print {
  body {
    filter: grayscale(100%) !important;
    -webkit-filter: grayscale(100%) !important;
  }
  #sidebar, .actions, .parameters, .vue-devtools__panel {
    display: none !important;
  }
  #printing-logotype{
    display: block !important;
    position: absolute !important;
    top: 30px !important;
    left: 30px !important;
    width: 70px !important;
    height: 70px !important;
  }
}
</style>
