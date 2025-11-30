<script setup lang="ts">
import Skeleton from '@/components/ui/Skeleton.vue'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { useRoute } from 'vue-router'
import router from '@/router'
import { useViolationStore } from '@/stores/violation.store.ts'
import type { Violation } from '@/types/violation.ts'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { useInspectorStore } from '@/stores/inspector.store.ts'
import { useInspectionStore } from '@/stores/inspection.store.ts'
import type { Inspection } from '@/types/inspection.ts'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const tempInspectors = new Map<string, number>()
const inspectorLabels = [] as string[]
const inspectorCounts = [] as number[]
const chartData = {
  labels: inspectorLabels,
  datasets: [
    {
      label: 'Статистика',
      backgroundColor: '#f87979',
      data: inspectorCounts,
    },
  ],
}
const options = {
  responsive: true,
}

const route = useRoute()
const sidebarStore = useSidebarStore()
const { selectedRoute } = storeToRefs(sidebarStore)

const inspectorStore = useInspectorStore()
const violationStore = useViolationStore()
const inspectionStore = useInspectionStore()
const { fetchViolations } = violationStore
const { fetchInspections } = inspectionStore
const { fetchInspectors } = inspectorStore
const { violations} = storeToRefs(violationStore)
const { inspections} = storeToRefs(inspectionStore)
const { inspectors, isLoading, error } = storeToRefs(inspectorStore)

const allViolations = ref<Violation[]>([])
const allInspections = ref<Inspection[]>([])

const filterByYear = ref<number | null>(null)
const filterByMonth = ref<number | null>(null)
const filterByType = ref<'Техосмотры' | 'Нарушения'>('Техосмотры')
const isFilterWindowOpen = ref(true)

const formatingDate = (date: Date) => new Date(date)

const reloadInspectors = async () => {
  inspectorCounts.length = 0
  inspectorLabels.length = 0
  tempInspectors.clear()
  isFilterWindowOpen.value = false
  await fetchInspectors()
  await fetchViolations()
  await fetchInspections()

  allViolations.value = violations.value
  allInspections.value = inspections.value

  if (filterByYear.value) {
    allViolations.value = allViolations.value.filter(
      (s) => formatingDate(s.violation_date).getFullYear() == filterByYear.value,
    )
    allInspections.value = allInspections.value.filter(
      (s) => formatingDate(s.inspection_date).getFullYear() == filterByYear.value,
    )
  }
  if (filterByMonth.value) {
    allViolations.value = allViolations.value.filter(
      (s) => formatingDate(s.violation_date).getMonth() + 1 == filterByMonth.value,
    )
    allInspections.value = allInspections.value.filter(
      (s) => formatingDate(s.inspection_date).getMonth() + 1 == filterByMonth.value,
    )
  }

  if (filterByYear.value) {
    if (filterByType.value === 'Нарушения')
      for (let s of allViolations.value) {
        if (!tempInspectors.get(s.Inspector!.surname)) tempInspectors.set(s.Inspector!.surname, 0)
        tempInspectors.set(s.Inspector!.surname, tempInspectors.get(s.Inspector!.surname)! + 1);
      }
    else if (filterByType.value === 'Техосмотры') {
      for (let s of allInspections.value) {
        if (!tempInspectors.get(s.Inspector!.surname)) tempInspectors.set(s.Inspector!.surname, 0)
        tempInspectors.set(s.Inspector!.surname, tempInspectors.get(s.Inspector!.surname)! + 1);
      }
    }

    tempInspectors.forEach((value, key) => {
      inspectorLabels.push(key)
      inspectorCounts.push(value)
    })
    chartData.labels = inspectorLabels
    chartData.datasets[0]!.data = inspectorCounts
    chartData.datasets[0]!.label = `${filterByType.value}. Статистика за ${filterByYear.value} год${filterByMonth.value ? `, ${filterByMonth.value}` : ""}`
  }
}
const goToInspector = async (id: string) => {
  await router.push(`/form/input/inspector/${id}`)
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
      <input type="text" v-model="filterByMonth" placeholder="Например, 7" :class="{active: filterByMonth}" />
    </div>
    <div class="filter-item">
      <p>Укажите тип (необяз.)</p>
      <select v-model="filterByType" :class="{active: filterByType}">
        <option>Техосмотры</option>
        <option>Нарушения</option>
      </select>
    </div>
    <button class="continue" @click="reloadInspectors" :class="{disabled: !filterByType}">Продолжить</button>
  </div>
  <div class="input-view" v-else>
    <div class="title">
      <div class="text">
        <h1>Запрос «Статистика по инспекторам»</h1>
        <p>Вывод информации о выявленных нарушениях и проведенных техосмотрах</p>
        <p>
          Параметры: {{ filterByYear }}, {{ filterByMonth }}, {{ filterByType }} <span @click="isFilterWindowOpen = true">Изменить</span>
        </p>
        <p>Найдено записей: {{ inspectors.length }}</p>
      </div>
    </div>
    <Skeleton v-if="isLoading && !error" height="300px" />
    <p v-if="error" class="mes-p">Произошла ошибка: {{ error }}</p>
    <div v-if="!isLoading && !error && inspectors.length > 0" style="width: 100%">
      <div
        v-if="filterByYear"
        :style="{ display: 'flex', justifyContent: 'center', height: '400px' }"
      >
        <Bar :data="chartData" :options="options" />
      </div>
      <table>
        <thead>
        <tr>
          <td>ФИО инспектора</td>
          <td>Должность</td>
          <td v-if="filterByType === 'Нарушения'">Нарушений</td>
          <td v-if="filterByType === 'Техосмотры'">Техосмотров</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(v, i) in inspectors" :key="i" @click="goToInspector(v.id)">
          <td>{{ v.surname }} {{v.name}} {{v.patronymic}}</td>
          <td>{{ v.post }}</td>
          <td v-if="filterByType === 'Нарушения'">{{ allViolations.filter(it => it.inspector_id == v.id).length }}</td>
          <td v-if="filterByType === 'Техосмотры'">{{ allInspections.filter(it => it.inspector_id == v.id).length }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <p v-else-if="!isLoading && !error" class="mes-p">Ничего не найдено</p>
    <div class="actions">
      <button @click="reloadInspectors">
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

  & > input, & > select {
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
