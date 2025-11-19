<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { formatDate } from '@/utils/date_format.ts'
import { useInspectionStore } from '@/stores/inspection.store.ts'

const inspectionStore = useInspectionStore()
const { fetchInspections } = inspectionStore
const { inspections, isLoading, error } = storeToRefs(inspectionStore)

onMounted(async () => {
  if (inspections.value.length === 0) {
    await fetchInspections()
  }
})
</script>

<template>
  <div class="table-container">
    <h1>Таблица «Технический осмотр»</h1>
    <Skeleton height="300px" v-if="isLoading && !error"/>
    <p v-else-if="error">Произошла ошибка: {{error}}</p>
    <table v-else>
      <thead>
      <tr>
        <td>Инспектор</td>
        <td>Номер судна</td>
        <td>Дата осмотра</td>
        <td>Результат</td>
        <td>Следующий осмотр</td>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="(ins, i) in inspections"
        :key="i"
      >
        <td>{{ins.Inspector.surname}}</td>
        <td>{{ins.Ship.ship_number}}</td>
        <td>{{formatDate(ins.inspection_date)}}</td>
        <td>{{ins.result}}</td>
        <td>{{formatDate(ins.next_inspection_date)}}</td>
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
