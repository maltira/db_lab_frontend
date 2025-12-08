<script setup lang="ts">
import Skeleton from '@/components/ui/Skeleton.vue'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { formatDate } from '@/utils/date_format.ts'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { useRoute } from 'vue-router'
import router from '@/router'
import type { Inspection } from '@/types/inspection.ts'
import { useInspectionStore } from '@/stores/inspection.store.ts'
const route = useRoute()
const sidebarStore = useSidebarStore()
const { selectedRoute } = storeToRefs(sidebarStore)

const inspectionStore = useInspectionStore()
const { fetchInspections } = inspectionStore
const { inspections, isLoading, error } = storeToRefs(inspectionStore)

const allInspections = ref<Inspection[]>([])
const filteringBy = ref<'Неделя' | 'Месяц' | 'Год'>('Неделя')
const isFilterWindowOpen = ref(true)

const reloadInspections = async () => {
  isFilterWindowOpen.value = false
  await fetchInspections()

  const timeNow = new Date()
  const getD = (date: Date) => {
    return new Date(date)
  }
  allInspections.value = inspections.value.filter(s => getD(s.next_inspection_date) >= timeNow && getD(s.next_inspection_date) <= getNewDate())
}

const goToShip = async (id: string) => {
  await router.push(`/form/input/ship/${id}`)
}
const goToInspection = async (id: string) => {
  await router.push(`/form/input/inspection/${id}`)
}
const goToInspector = async (id: string) => {
  await router.push(`/form/input/inspector/${id}`)
}

const getNewDate = (): Date => {
  const date = new Date()
  switch (filteringBy.value) {
    case 'Неделя':
      date.setDate(date.getDate() + 7)
      break
    case 'Месяц':
      date.setDate(date.getDate() + 30)
      break
    case 'Год':
      date.setDate(date.getDate() + 365)
      break
  }
  return date
}

const printPage = () => {
  window.print()
}

onMounted(async () => {
  if (typeof route.meta.page_id === 'number')
    selectedRoute.value = { block: 'queries', id: route.meta.page_id }
})
</script>

<template>
  <div class="filter-window" v-if="isFilterWindowOpen">
    <div class="filter-item">
      <p>Выберите период</p>
      <div class="buttons">
        <button :class="{ active: filteringBy === 'Неделя' }" @click="filteringBy = 'Неделя'">
          Неделя
        </button>
        <button :class="{ active: filteringBy === 'Месяц' }" @click="filteringBy = 'Месяц'">
          Месяц
        </button>
        <button :class="{ active: filteringBy === 'Год' }" @click="filteringBy = 'Год'">
          Год
        </button>
      </div>
    </div>
    <button class="continue" @click="reloadInspections" :class="{disabled: !filteringBy}">
      Продолжить
    </button>
  </div>
  <div class="input-view" v-else>
    <div class="title">
      <div class="text">
        <h1>Предстоящие техосмотры</h1>
        <p>Вывод информации о предстовящих осмотрах ({{filteringBy}}) <span @click="isFilterWindowOpen = true">Изменить</span></p>
        <p>Найдено записей: {{ allInspections.length }}</p>
      </div>
    </div>
    <Skeleton v-if="isLoading && !error" height="300px" />
    <p v-if="error" class="mes-p">Произошла ошибка: {{ error }}</p>
    <div v-if="!isLoading && !error && allInspections.length > 0" style="width: 100%">
      <table>
        <thead>
          <tr>
            <td>Инспектор</td>
            <td>Номер судна</td>
            <td>Дата техосмотра</td>
            <td>Результат</td>
            <td>Следующая дата</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(v, i) in allInspections" :key="i" @click="goToInspection(v.id)">
            <td class="active-td" @click.stop @click="goToInspector(v.Inspector!.id)">
              {{ v.Inspector!.surname }}
            </td>
            <td class="active-td" @click.stop @click="goToShip(v.Ship!.id)">
              {{ v.Ship!.ship_number }}
            </td>
            <td>{{ formatDate(v.inspection_date) }}</td>
            <td
              :style="{
                color: v.result
                  ? v.result === 'Не годно к эксплутации'
                    ? 'red'
                    : v.result === 'Годно к эксплутации'
                      ? 'rgb(112, 224, 0)'
                      : '#FFD032'
                  : '',
              }"
            >
              {{ v.result }}
            </td>
            <td>{{ formatDate(v.next_inspection_date) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else-if="!isLoading && !error" class="mes-p">Ничего не найдено</p>

    <div class="actions">
      <button @click="reloadInspections">
        <img src="/icons/reload.svg" alt="reload" />
        Обновить данные
      </button>
      <button @click="printPage">
        <img src="/icons/printing.png" alt="search"/>
        Печать
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
}
.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;

  & > img {
    width: 100px;
  }
  & > .text {
    & > h1,
    & > p {
      text-align: center;
    }
    & > p {
      margin-top: 10px;
      font-size: 16px;
      opacity: 0.7;

      & > span {
        opacity: 0.8;
        cursor: pointer;
        font-size: 14px;
        text-decoration: underline;
        color: #6378ff;

        &:hover{
          opacity: 1;
        }
      }
    }
  }
}
.filter-window {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 40px;

  & > .filter-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    & > p {
      font-size: 16px;
    }
  }
  & > .continue{
    background: rgba(gray, 0.1);
    border: 1px solid rgba(gray, 0.3);
    width: 350px;
    height: 48px;
    border-radius: 8px;
    opacity: 0.8;

    &.disabled {
      pointer-events: none;
      opacity: 0.1;
    }

    &:hover{
      opacity: 0.99;
    }
  }
}
.buttons {
  display: flex;
  gap: 10px;
  & > button {
    padding: 6px 30px;
    opacity: 0.6;
    border: 1px solid rgba(gray, 0.2);
    border-radius: 4px;

    &.active {
      opacity: 1;
      background: rgba(gray, 0.05);
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
        &.active-td:hover {
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
.mes-p {
  font-size: 16px;
  opacity: 0.9;
}
</style>
