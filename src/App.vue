<script setup lang="ts">

import AppSidebar from '@/components/layout/AppSidebar.vue'
import { onMounted } from 'vue'
import router from '@/router'

onMounted(async() => {
  await router.push('/')
})
</script>

<template>
  <AppSidebar/>
  <div id="content">
    <RouterView/>
  </div>
</template>

<style lang="scss">
#app{
  display: flex;
}
#content{
  padding: 30px;
  width: 100%;
}
</style>
