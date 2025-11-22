<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { formatDate } from '@/utils/date_format.ts'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { useViolationStore } from '@/stores/violation.store.ts'
import type { Violation } from '@/types/violation.ts'

// Может прийти ID инспектора, либо ID судна, либо ничего
interface Props {
  inspector_id?: string
  ship_id?: string
}
const props = defineProps<Props>()

const sidebarStore = useSidebarStore()
const { selectedRoute } = storeToRefs(sidebarStore)

const violationStore = useViolationStore()
const { fetchViolations } = violationStore
const { violations, isLoading, error } = storeToRefs(violationStore)
const filteredViolations = ref<Violation[]>([])

const currentInspector = ref<string>("")
const currentShip = ref<string>("")

const reloadViolations = async () => {
  await fetchViolations()
}

const goToViolation = async (id: string) => {

}

onMounted(async () => {
  await fetchViolations()
  selectedRoute.value = { block: "forms", id: 6}
  if (props.inspector_id) {
    filteredViolations.value = violations.value.filter((v) => v.Inspector.id === props.inspector_id)
    if (filteredViolations.value[0]) currentInspector.value = filteredViolations.value[0].Inspector.surname
  } else if (props.ship_id) {
    filteredViolations.value = violations.value.filter((v) => v.Ship.id === props.ship_id)
    if (filteredViolations.value[0]) currentShip.value = filteredViolations.value[0].Ship.ship_number
  }
  else {
    filteredViolations.value = violations.value
  }
})
</script>

<template>
  <div class="data-view">
    <div class="title">
      <img src="/img/gims.png" alt="logo">
      <div class="text">
        <h1>ГИМС РФ</h1>
        <p>Вы находитесь на странице с нарушениями{{currentInspector ? (`, выявленными инспектором «${currentInspector}»`) : (currentShip ? ` судна ${currentShip}»` : "")}}</p>
      </div>
    </div>
    <Skeleton height="300px" v-if="isLoading && !error"/>
    <p v-else-if="error">Произошла ошибка: {{error}}</p>
    <table v-else-if="filteredViolations.length > 0">
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
        v-for="(v, i) in filteredViolations"
        :key="i"
        @click="goToViolation(v.id)"
      >
        <td>{{v.Ship.ship_number}}</td>
        <td>{{v.Inspector.surname}}</td>
        <td>{{formatDate(v.violation_date)}}</td>
        <td>{{v.amount}}</td>
        <td>{{v.description}}</td>
        <td :style="{color: v.status === 'Исполнено' ? '#70e000' : 'red'}">{{v.status}}</td>
      </tr>
      </tbody>
    </table>
    <p v-else>Выявленные нарушения не найдены</p>
    <div class="actions">
      <button @click="">
        <img src="/icons/add.svg" alt="add">
        Новая запись
      </button>
      <button v-if="filteredViolations.length > 0">
        <img src="/icons/search.svg" alt="search">
        Найти запись
      </button>
      <button @click="reloadViolations" >
        <img src="/icons/reload.svg" alt="reload">
        Обновить данные
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.data-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  padding-bottom: 100px;

  & > .title {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;

    margin-bottom: 20px;

    & > img {
      width: 100px;
    }
    & > .text {
      & > h1, & > p {
        text-align: center;
      }
      & > p {
        margin-top: 10px;
        font-size: 16px;
        opacity: 0.7;
      }
    }
  }
}
td {
  font-size: 16px;
  align-content: start;
  padding-left: 6px !important;

  border-bottom: 1px solid rgba(gray, 0.15);
}
table {
  background: rgba(gray, 0.07);
  padding: 5px 15px 15px 15px;
  border-radius: 16px;
  & > thead {
    & > tr > td {
      padding: 15px 0;
      font-weight: bold;
    }
  }
  & > tbody {
    & > tr {

      & > td {
        padding: 5px 0;
      }
      &:last-child {

        & > td {
          border-bottom: none;
        }
      }
      &:hover{
        cursor: pointer;
        background-color: rgba(gray, 0.08);
      }
    }
  }
}
.actions{
  display: flex;
  gap: 10px;

  position: fixed;
  bottom: 0;
  width: calc(100% - 60px);
  padding: 20px 0;

  background-color: $white;

  & button {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    border-radius: 5px;
    border: 1px solid rgba(gray, 0.5);

    & > img {
      width: 20px;
      height: 20px;
    }
    &:hover{
      border-color: rgba(#6378ff, 1);
      background-color: rgba(#6378ff, 0.05);
    }
  }
}
</style>
