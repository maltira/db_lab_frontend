<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { formatDate } from '@/utils/date_format.ts'
import { useShipStore } from '@/stores/ship.store.ts'

const shipStore = useShipStore()
const { fetchShips } = shipStore
const { ships, isLoading, error } = storeToRefs(shipStore)

onMounted(async () => {
  if (ships.value.length === 0) {
    await fetchShips()
  }
})
</script>

<template>
  <div class="table-container">
    <h1>Таблица «Судна»</h1>
    <Skeleton height="300px" v-if="isLoading && !error"/>
    <p v-else-if="error">Произошла ошибка: {{error}}</p>
    <table v-else>
      <thead>
      <tr>
        <td>Тип судна</td>
        <td>Владелец</td>
        <td>Номер судна</td>
        <td>Дата регистрации</td>
        <td>Статус регистрации</td>
        <td>Судоводитель</td>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="(ship, i) in ships"
        :key="i"
      >
        <td>{{ship.Type.name}}</td>
        <td>{{ship.Owner.surname}}</td>
        <td>{{ship.ship_number}}</td>
        <td>{{formatDate(ship.registration_date)}}</td>
        <td>{{ship.registration_status}}</td>
        <td>{{ship.Skipper.surname}}</td>
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
