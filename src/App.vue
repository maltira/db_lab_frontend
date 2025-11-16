<script setup lang="ts">

import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>

<template>
  <AppSidebar/>
  <RouterView/>
</template>

<style lang="scss">
#app{
  display: flex;
  gap: 10px;
}
</style>
