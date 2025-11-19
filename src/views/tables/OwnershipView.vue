<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { useOwnershipStore } from '@/stores/ownership.store.ts'
import { formatDate } from '@/utils/date_format.ts'

const ownershipStore = useOwnershipStore()
const { fetchOwnerships } = ownershipStore
const { ownerships, isLoading, error } = storeToRefs(ownershipStore)

onMounted(async () => {
  if (ownerships.value.length === 0) {
    await fetchOwnerships()
  }
})
</script>

<template>
  <div class="table-container">
    <h1>Таблица «История владения»</h1>
    <Skeleton height="300px" v-if="isLoading && !error"/>
    <p v-else-if="error">Произошла ошибка: {{error}}</p>
    <table v-else>
      <thead>
      <tr>
        <td>Старый владелец</td>
        <td>Новый владелец</td>
        <td>Дата передачи</td>
        <td>Номер судна</td>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="(ows, i) in ownerships"
        :key="i"
      >
        <td>{{ows.old_owner}}</td>
        <td>{{ows.new_owner}}</td>
        <td>{{formatDate(ows.transfer_date)}}</td>
        <td>{{ows.Ship.ship_number}}</td>
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
