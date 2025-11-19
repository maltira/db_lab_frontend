<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { formatDate } from '@/utils/date_format.ts'
import { useViolationStore } from '@/stores/violation.store.ts'

const violationStore = useViolationStore()
const { fetchViolations } = violationStore
const { violations, isLoading, error } = storeToRefs(violationStore)

onMounted(async () => {
  if (violations.value.length === 0) {
    await fetchViolations()
  }
})
</script>

<template>
  <div class="table-container">
    <h1>Таблица «Нарушения»</h1>
    <Skeleton height="300px" v-if="isLoading && !error"/>
    <p v-else-if="error">Произошла ошибка: {{error}}</p>
    <table v-else>
      <thead>
      <tr>
        <td>Номер судна</td>
        <td>Инспектор</td>
        <td>Дата нарушения</td>
        <td>Сумма штрафа</td>
        <td>Описание</td>
        <td>Статус</td>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="(v, i) in violations"
        :key="i"
      >
        <td>{{v.Ship.ship_number}}</td>
        <td>{{v.Inspector.surname}}</td>
        <td>{{formatDate(v.violation_date)}}</td>
        <td>{{v.amount}}</td>
        <td>{{v.description}}</td>
        <td>{{v.status}}</td>
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
