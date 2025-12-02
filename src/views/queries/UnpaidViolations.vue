<script setup lang="ts">
import Skeleton from '@/components/ui/Skeleton.vue'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref } from 'vue'
import { compareDates, formatDate, isAfterOrEqual, isBeforeOrEqual } from '@/utils/date_format.ts'
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

const isCalendarOpen = ref(false)
const toggleCalendar = () => {
  isCalendarOpen.value = !isCalendarOpen.value
  console.log(isCalendarOpen.value)
}
const handleDateSelect = (date: Date | null) => {
  if (date) {
    isCalendarOpen.value = false
  }
}
const handleClickOutside = (event: MouseEvent) => {
  const calendarElement = document.getElementById('calendar-cont')
  if (calendarElement && !calendarElement.contains(event.target as Node)) {
    isCalendarOpen.value = false
  }
}
const filterByDate = ref<Date | null>(null)
const typeFiltering = ref<'До' | 'После' | 'Конкретная' | null>(null)
const filterByShipNumber = ref('')
const isFilterWindowOpen = ref(true)

const handleTypeFiltering = (type: 'До' | 'После' | 'Конкретная') => {
  if (typeFiltering.value === type) typeFiltering.value = null
  else typeFiltering.value = type
}

const reloadViolations = async () => {
  isFilterWindowOpen.value = false
  await fetchViolations()
  allViolations.value = violations.value.filter((s) => s.status === 'Не исполнено')

  if (typeFiltering.value && filterByDate.value) {
    switch (typeFiltering.value) {
      case 'Конкретная':
        allViolations.value = allViolations.value.filter((s) =>
          compareDates(new Date(s.violation_date), filterByDate.value!),
        )
        break
      case 'До':
        allViolations.value = allViolations.value.filter((s) =>
          isBeforeOrEqual(new Date(s.violation_date), filterByDate.value!),
        )
        break
      case 'После':
        allViolations.value = allViolations.value.filter((s) =>
          isAfterOrEqual(new Date(s.violation_date), filterByDate.value!),
        )
        break
    }
  }
  if (filterByShipNumber.value) {
    allViolations.value = allViolations.value.filter((s) =>
      s.Ship!.ship_number === filterByShipNumber.value,
    )
  }
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
  document.addEventListener('click', handleClickOutside)
  if (typeof route.meta.page_id === 'number')
    selectedRoute.value = { block: 'queries', id: route.meta.page_id }
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="filter-window" v-if="isFilterWindowOpen">
    <div class="filter-item">
      <p>Фильтр по дате (необязательно)</p>
      <div class="buttons">
        <button
          :class="{ active: typeFiltering === 'Конкретная' }"
          @click="handleTypeFiltering('Конкретная')"
        >
          Конкретная дата
        </button>
        <button :class="{ active: typeFiltering === 'До' }" @click="handleTypeFiltering('До')">
          До даты
        </button>
        <button
          :class="{ active: typeFiltering === 'После' }"
          @click="handleTypeFiltering('После')"
        >
          После даты
        </button>
      </div>
    </div>
    <div
      v-if="typeFiltering"
      class="filter-item date"
      :style="{ position: 'relative' }"
      id="calendar-cont"
    >
      <p>Дата нарушений *</p>
      <button @click="toggleCalendar" :class="{ active: filterByDate }">
        {{ filterByDate ? formatDate(filterByDate) : 'Укажите дату' }}
        <img src="/icons/calendar.svg" alt="calendar" width="16px" />
      </button>
      <VDatePicker
        :style="{
          position: 'absolute',
          top: '85px',
          width: '100%',
          display: isCalendarOpen ? 'block' : 'none',
          background: 'white',
          zIndex: 10,
        }"
        @update:modelValue="handleDateSelect"
        v-model="filterByDate"
        mode="date"
        :max-date="new Date()"
      />
    </div>
    <div class="filter-item ship-number">
      <p>Номер судна</p>
      <input type="text" v-model="filterByShipNumber" placeholder="Номер судна (необязательно)" :class="{active: filterByShipNumber}">
    </div>
    <button
      class="continue"
      @click="reloadViolations"
      :class="{ disabled: typeFiltering && !filterByDate }"
    >
      {{typeFiltering || filterByDate ? 'Продолжить' : 'Продолжить без параметров'}}
    </button>
  </div>
  <div class="input-view" v-else>
    <div class="title">
      <div class="text">
        <h1>Запрос «Неоплаченные штрафы»</h1>
        <p>Вывод информации о неоплаченных нарушениях</p>
        <p v-if="typeFiltering || filterByDate || filterByShipNumber">Параметры: {{typeFiltering}}, {{formatDate(filterByDate!)}}, {{filterByShipNumber}} <span @click="isFilterWindowOpen = true">Изменить</span></p>
        <p>Найдено записей: {{ allViolations.length }}</p>
        <p>Общая сумма: {{ allViolations.reduce((a, c) => a + parseInt(c.amount), 0) }}</p>
      </div>
    </div>
    <Skeleton v-if="isLoading && !error" height="300px" />
    <p v-if="error" class="mes-p">Произошла ошибка: {{ error }}</p>
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
            <td class="active-td" @click.stop @click="goToShip(v.Ship!.id)">
              {{ v.Ship!.ship_number }}
            </td>
            <td class="active-td" @click.stop @click="goToInspector(v.Inspector!.id)">
              {{ v.Inspector!.surname }}
            </td>
            <td>{{ formatDate(v.violation_date) }}</td>
            <td>{{ v.amount }}</td>
            <td>{{ v.description }}</td>
            <td
              :style="{
                color: v.status ? (v.status === 'Не исполнено' ? 'red' : 'rgb(112, 224, 0)') : '',
              }"
            >
              {{ v.status }}
            </td>
          </tr>
        </tbody>
      </table>
      <p class="mes-p"></p>
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

  & > .filter-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    & > p {
      font-size: 16px;
    }

    &.date, &.ship-number {
      &.disabled {
        opacity: 0.2;
        pointer-events: none;
      }
      & > button, & > input {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 6px 30px;
        opacity: 0.6;
        border: 1px solid rgba(gray, 0.4);
        border-radius: 4px;
        width: 300px;

        &.active {
          opacity: 1;
          background: rgba(gray, 0.05);
        }
      }
      & > input {
        padding: 6px 12px;
      }
    }
  }
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
