<script setup lang="ts">
import Skeleton from '@/components/ui/Skeleton.vue'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { formatDate } from '@/utils/date_format.ts'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { useRoute } from 'vue-router'
import router from '@/router'
import { useViolationStore } from '@/stores/violation.store.ts'
import type { Violation } from '@/types/violation.ts'
const route = useRoute()
const sidebarStore = useSidebarStore()
const { selectedRoute } = storeToRefs(sidebarStore)

const violationStore = useViolationStore()
const { fetchViolations } = violationStore
const { violations, isLoading, error } = storeToRefs(violationStore)
const allViolations = ref<Violation[]>([])

const reloadViolations = async () => {
  await fetchViolations()
  allViolations.value = violations.value.filter(s => s.status === 'Не исполнено')
}
const goToShip = async (id: string) => {
  await router.push(`/form/input/ship/${id}`)
}
const goToViolation = async (id: string) => {
  await router.push(`/form/input/violation/${id}`)
}
const goToInspector = async (id: string) => {
  await router.push(`/form/input/inspector/${id}`)
}
onMounted(async () => {
  await fetchViolations()
  allViolations.value = violations.value.filter(s => s.status === 'Не исполнено')
  if (typeof route.meta.page_id === 'number')
    selectedRoute.value = { block: 'reports', id: route.meta.page_id }
})
</script>

<template>
  <div class="input-view">
    <div class="title">
      <div class="text">
        <h1>Запрос «Неоплаченные штрафы»</h1>
        <p>Вывод информации о неоплаченных нарушениях</p>
        <p>Найдено записей: {{allViolations.length}}</p>
        <p>Общая сумма: {{allViolations.reduce((a,c) => a + parseInt(c.amount), 0)}}</p>
      </div>
    </div>
    <Skeleton v-if="isLoading && !error" height="300px" />
    <p v-if="error" class="mes-p">Произошла ошибка: {{ error }}</p>
<!--    <div class="btn-action">-->
<!--      <button class="btn-item">-->
<!--        <img src="/icons/filter.png" alt="filter">-->
<!--        Фильтры-->
<!--      </button>-->
<!--    </div>-->
    <div v-if="!isLoading && !error && allViolations.length > 0" style="width: 100%">
      <table>
        <thead>
        <tr>
          <td>Номер судна</td>
          <td>Инспектор</td>
          <td>Дата нарушения</td>
          <td>Сумма штрафа</td>
          <td>Описание нарушения</td>
          <td>Статус</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(v, i) in allViolations" :key="i" @click="goToViolation(v.id)">
          <td class="active-td" @click.stop @click="goToShip(v.Ship!.id)">{{ v.Ship!.ship_number }}</td>
          <td class="active-td" @click.stop @click="goToInspector(v.Inspector!.id)">{{ v.Inspector!.surname }}</td>
          <td>{{ formatDate(v.violation_date) }}</td>
          <td>{{ v.amount }}</td>
          <td>{{v.description}}</td>
          <td
            :style="{
                color: v.status
                  ? v.status === 'Не исполнено'
                    ? 'red'
                    : 'rgb(112, 224, 0)'
                  : '',
              }"
          >
            {{ v.status }}
          </td>
        </tr>
        </tbody>
      </table>
      <p class="mes-p" > </p>
    </div>
    <p v-else-if="!isLoading && !error" class="mes-p">Ничего не найдено</p>

    <div class="actions">
      <button @click="reloadViolations">
        <img src="/icons/reload.svg" alt="reload" />
        Обновить данные
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.input-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  padding-bottom: 100px;

  & > .title {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 15px;

    & > img {
      width: 100px;
    }
    & > .text {
      & > h1,
      & > p {
        text-align: start;
      }
      & > p {
        margin-top: 10px;
        font-size: 16px;
        opacity: 0.7;
      }
    }
  }
}
.btn-action{
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 15px;

  & > .btn-item {
    display: flex;
    align-items: center;
    gap: 10px;
    opacity: 0.8;

    & > img {
      width: 16px;
    }
    &:hover{
      opacity: 1;
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
  width: 100%;
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
        &.active-td:hover{
          background-color: rgba(gray, 0.08);
        }
      }
      &:last-child {
        & > td {
          border-bottom: none;
        }
      }
      &:hover {
        cursor: pointer;
        background-color: rgba(gray, 0.08);
      }
    }
  }
}
.actions {
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
    &:hover {
      border-color: rgba(#6378ff, 1);
      background-color: rgba(#6378ff, 0.05);
    }
  }
}
.mes-p{
  font-size: 16px;
  opacity: 0.9;
}
</style>
