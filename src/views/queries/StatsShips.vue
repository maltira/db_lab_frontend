<script setup lang="ts">
import Skeleton from '@/components/ui/Skeleton.vue'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { formatDate } from '@/utils/date_format.ts'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { useRoute } from 'vue-router'
import router from '@/router'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useShipStore } from '@/stores/ship.store.ts'
import type { Ship } from '@/types/ship.ts'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const monthlyCounts = Array(12).fill(0)
const dailyCounts = Array(31).fill(0)
const monthLabels = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]
const dayLabels = Array.from({ length: 31 }, (_, i) => (i + 1).toString())
const dataByYear = {
  labels: monthLabels,
  datasets: [
    {
      label: 'Статистика за 2025 год',
      backgroundColor: '#f87979',
      data: monthlyCounts,
    },
  ],
}
const dataByMonth = {
  labels: dayLabels,
  datasets: [
    {
      label: 'Статистика за месяц',
      backgroundColor: '#f87979',
      data: dailyCounts,
    },
  ],
}
const options = {
  responsive: true,
}

const route = useRoute()
const sidebarStore = useSidebarStore()
const { selectedRoute } = storeToRefs(sidebarStore)

const shipStore = useShipStore()
const { fetchShips } = shipStore
const { ships, isLoading, error } = storeToRefs(shipStore)
const allShips = ref<Ship[]>([])

const filterByYear = ref<number | null>(null)
const filterByMonth = ref<number | null>(null)
const filterByDay = ref<number | null>(null)
const filterByType = ref('')
const filterByOwner = ref('')
const filterBySkipper = ref('')
const isFilterWindowOpen = ref(true)

const formatingDate = (date: Date) => new Date(date)

const reloadInspections = async () => {
  dailyCounts.fill(0)
  monthlyCounts.fill(0)
  isFilterWindowOpen.value = false
  await fetchShips()
  allShips.value = ships.value

  if (filterByYear.value) {
    allShips.value = allShips.value.filter(
      (s) => formatingDate(s.registration_date).getFullYear() == filterByYear.value,
    )
  }
  if (filterByMonth.value) {
    allShips.value = allShips.value.filter(
      (s) => formatingDate(s.registration_date).getMonth() + 1 == filterByMonth.value,
    )
  }
  if (filterByDay.value) {
    allShips.value = allShips.value.filter(
      (s) => formatingDate(s.registration_date).getDate() == filterByDay.value,
    )
  }
  if (filterByType.value) {
    allShips.value = allShips.value.filter(
      (s) => s.Type!.name === filterByType.value,
    )
  }
  if (filterByOwner.value) {
    allShips.value = allShips.value.filter(
      (s) => s.Owner!.surname === filterByOwner.value,
    )
  }
  if (filterBySkipper.value) {
    allShips.value = allShips.value.filter(
      (s) => s.Skipper!.surname === filterBySkipper.value,
    )
  }

  if (filterByYear.value) {
    for (let s of allShips.value) {
      monthlyCounts[formatingDate(s.registration_date).getMonth()]++
      dailyCounts[formatingDate(s.registration_date).getDate() - 1]++
    }
    dataByYear.datasets[0]!.data = monthlyCounts
    dataByYear.datasets[0]!.label = `Статистика за ${filterByYear.value} год`
    dataByMonth.datasets[0]!.data = dailyCounts
  }
  else {
    const temp = allShips.value.filter(
      (s) => formatingDate(s.registration_date).getFullYear() == 2025,
    )
    for (let s of temp) {
      monthlyCounts[formatingDate(s.registration_date).getMonth()]++
      dailyCounts[formatingDate(s.registration_date).getDate() - 1]++
    }
    dataByYear.datasets[0]!.data = monthlyCounts
    dataByYear.datasets[0]!.label = 'Статистика за 2025 год'
    dataByMonth.datasets[0]!.data = dailyCounts
  }
}

const printPage = () => {
  window.print()
}

const goToShip = async (id: string) => {
  await router.push(`/form/input/ship/${id}`)
}
const goToSkipper = async (id: string) => {
  await router.push(`/form/input/skipper/${id}`)
}
const goToOwner = async (id: string) => {
  await router.push(`/form/input/owner/${id}`)
}
onMounted(() => {
  if (typeof route.meta.page_id === 'number')
    selectedRoute.value = { block: 'queries', id: route.meta.page_id }
})
</script>

<template>
  <div class="filter-window" v-if="isFilterWindowOpen">
    <div class="filter-item">
      <p>Укажите год (необяз.)</p>
      <input type="text" v-model="filterByYear" placeholder="Например, 2025" :class="{active: filterByYear}"/>
    </div>
    <div class="filter-item">
      <p>Укажите месяц (необяз.)</p>
      <input type="text" v-model="filterByMonth" placeholder="Например, 12" :class="{active: filterByMonth}"/>
    </div>
    <div class="filter-item">
      <p>Укажите день (необяз.)</p>
      <input type="text" v-model="filterByDay" placeholder="Например, 31" :class="{active: filterByDay}"/>
    </div>
    <div class="filter-item">
      <p>Тип судна (необяз.)</p>
      <input type="text" v-model="filterByType" placeholder="Яхты и катера" :class="{active: filterByType}"/>
    </div>
    <div class="filter-item">
      <p>Владелец (необяз.)</p>
      <input type="text" v-model="filterByOwner" placeholder="Казаченко" :class="{active: filterByOwner}"/>
    </div>
    <div class="filter-item">
      <p>Судоводитель (необяз.)</p>
      <input type="text" v-model="filterBySkipper" placeholder="Петров" :class="{active: filterBySkipper}"/>
    </div>
    <button class="continue" @click="reloadInspections">
      {{filterByYear || filterByMonth || filterByDay || filterBySkipper || filterByOwner || filterByType ? 'Продолжить' : 'Продолжить без параметров'}}
    </button>
  </div>
  <div class="input-view" v-else>
    <div class="title">
      <div class="text">
        <h1>Статистика по суднам</h1>
        <p>Вывод информации о суднах</p>
        <p class="parameters">
          Параметры: {{ filterByYear }}, {{ filterByMonth }}, {{ filterByDay }},
          {{ filterByType }}, {{filterByOwner}}, {{filterBySkipper}} <span @click="isFilterWindowOpen = true">Изменить</span>
        </p>
        <p>Найдено записей: {{ allShips.length }}</p>
      </div>
    </div>
    <Skeleton v-if="isLoading && !error" height="300px" />
    <p v-if="error" class="mes-p">Произошла ошибка: {{ error }}</p>
    <div v-if="!isLoading && !error && allShips.length > 0" style="width: 100%">
      <div
        v-if="filterByYear || (!filterByYear && !filterByMonth && !filterByDay && !filterByType && !filterByOwner && !filterBySkipper)"
        :style="{ display: 'flex', justifyContent: 'center', height: '400px' }"
      >
        <Line :data="filterByMonth ? dataByMonth : dataByYear" :options="options" />
      </div>
      <table>
        <thead>
        <tr>
          <td>Тип</td>
          <td>Владелец</td>
          <td>Судоводитель</td>
          <td>Номер судна</td>
          <td>Дата регистрации</td>
          <td>Статус регистрации</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(v, i) in allShips" :key="i" @click="goToShip(v.id)">
          <td>
            {{ v.Type!.name }}
          </td>
          <td class="active-td" @click.stop @click="goToOwner(v.Owner!.id)">
            {{ v.Owner!.surname }}
          </td>
          <td class="active-td" @click.stop @click="goToSkipper(v.Skipper!.id)">
            {{ v.Skipper!.surname }}
          </td>
          <td>
            {{ v.ship_number }}
          </td>
          <td>{{ formatDate(v.registration_date) }}</td>
          <td>{{ v.registration_status }}</td>
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

        &:hover {
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
  & > .continue {
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

    &:hover {
      opacity: 0.99;
    }
  }
}
.filter-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  & > p {
    font-size: 16px;
  }

  & > input {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 6px 12px;
    opacity: 0.6;
    border: 1px solid rgba(gray, 0.4);
    border-radius: 4px;
    width: 300px;

    &.active {
      opacity: 1;
      background: rgba(gray, 0.05);
    }
  }
}
.buttons {
  display: flex;
  gap: 10px;
  & > button {
    padding: 6px 30px;
    opacity: 0.6;
    border: 1px solid rgba(gray, 0.4);
    border-radius: 4px;

    &.active {
      opacity: 1;
      background: rgba(gray, 0.05);
    }
  }
}

.btn-action {
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
    &:hover {
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
