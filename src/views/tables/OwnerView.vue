<script setup lang="ts">

import { useOwnerStore } from '@/stores/owner.store.ts'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { formatDate } from '@/utils/date_format.ts'

const ownerStore = useOwnerStore()
const { fetchOwners } = ownerStore
const { owners, isLoading, error } = storeToRefs(ownerStore)

onMounted(async () => {
  if (owners.value.length === 0) {
    await fetchOwners()
  }
})
</script>

<template>
  <div class="table-container owner-content">
    <h1>Таблица «Владельцы»</h1>
    <Skeleton height="300px" v-if="isLoading && !error"/>
    <p v-else-if="error">Произошла ошибка: {{error}}</p>
    <table v-else>
      <thead>
        <tr>
          <td>Имя</td>
          <td>Фамилия</td>
          <td>Отчество</td>
          <td>Адрес</td>
          <td>Дата рождения</td>
          <td>Номер телефона</td>
          <td>Тип лица</td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(owner, i) in owners"
          :key="i"
        >
          <td>{{owner.name}}</td>
          <td>{{owner.surname}}</td>
          <td>{{owner.patronymic || ""}}</td>
          <td class="address">{{owner.address}}</td>
          <td>{{formatDate(owner.birth_date)}}</td>
          <td>{{owner.phone}}</td>
          <td>{{owner.type_of_person}}</td>
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
