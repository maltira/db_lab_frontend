<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { useShipStore } from '@/stores/ship.store.ts'

const typeStore = useShipStore()
const { fetchTypes } = typeStore
const { types, isLoading, error } = storeToRefs(typeStore)

onMounted(async () => {
  if (types.value.length === 0) {
    await fetchTypes()
  }
})
</script>

<template>
  <div class="table-container">
    <h1>Таблица «Типы судов»</h1>
    <Skeleton height="300px" v-if="isLoading && !error"/>
    <p v-else-if="error">Произошла ошибка: {{error}}</p>
    <table v-else>
      <thead>
      <tr>
        <td>ID</td>
        <td>Название</td>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="(type, i) in types"
        :key="i"
      >
        <td>{{type.id}}</td>
        <td>{{type.name}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.table-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
td {
  font-size: 16px;
  align-content: start;
  padding-left: 4px !important;
}
table, th, td {
  border: 1px solid black;
}
table {
  & > thead {
    & > tr > td {
      padding: 15px 0;
      font-weight: bold;
    }
  }
  & > tbody {
    & > tr > td {
      padding: 5px 0;

      &.address {
        max-width: 250px;
      }
    }
  }
}
</style>
