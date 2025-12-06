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
</style>
