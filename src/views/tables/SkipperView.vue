<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { useSkipperStore } from '@/stores/skipper.store.ts'

const skipperStore = useSkipperStore()
const { fetchSkippers } = skipperStore
const { skippers, isLoading, error } = storeToRefs(skipperStore)

onMounted(async () => {
  if (skippers.value.length === 0) {
    await fetchSkippers()
  }
})
</script>

<template>
  <div class="table-container owner-content">
    <h1>Таблица «Судоводители»</h1>
    <Skeleton height="300px" v-if="isLoading && !error"/>
    <p v-else-if="error">Произошла ошибка: {{error}}</p>
    <table v-else>
      <thead>
      <tr>
        <td>Имя</td>
        <td>Фамилия</td>
        <td>Отчество</td>
        <td>Номер удостоверения</td>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="(skipper, i) in skippers"
        :key="i"
      >
        <td>{{skipper.name}}</td>
        <td>{{skipper.surname}}</td>
        <td>{{skipper.patronymic || ""}}</td>
        <td>{{skipper.id_number}}</td>
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
