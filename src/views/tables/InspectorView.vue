<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { useInspectorStore } from '@/stores/inspector.store.ts'

const inspectorStore = useInspectorStore()
const { fetchInspectors } = inspectorStore
const { inspectors, isLoading, error } = storeToRefs(inspectorStore)

onMounted(async () => {
  if (inspectors.value.length === 0) {
    await fetchInspectors()
  }
})
</script>

<template>
  <div class="table-container">
    <h1>Таблица «Инспектора»</h1>
    <Skeleton height="300px" v-if="isLoading && !error"/>
    <p v-else-if="error">Произошла ошибка: {{error}}</p>
    <table v-else>
      <thead>
      <tr>
        <td>Имя</td>
        <td>Фамилия</td>
        <td>Отчество</td>
        <td>Должность</td>
        <td>Номер телефона</td>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="(inspector, i) in inspectors"
        :key="i"
      >
        <td>{{inspector.name}}</td>
        <td>{{inspector.surname}}</td>
        <td>{{inspector.patronymic || ""}}</td>
        <td>{{inspector.post}}</td>
        <td>{{inspector.phone}}</td>
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
