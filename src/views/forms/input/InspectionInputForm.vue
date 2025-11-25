<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Skeleton from '@/components/ui/Skeleton.vue'
import { formatDate } from '@/utils/date_format.ts'
import type { InspectionCreateRequest} from '@/types/dto/request.dto.ts'
import { useNotification } from '@/composables/useNotification.ts'
import router from '@/router'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { useRoute } from 'vue-router'
import { useInspectionStore } from '@/stores/inspection.store.ts'
import type { Inspection } from '@/types/inspection.ts'
import SelectInspectorModal from '@/components/ui/modals/SelectInspectorModal.vue'
import SelectShipModal from '@/components/ui/modals/SelectShipModal.vue'
import SelectResultModal from '@/components/ui/modals/SelectResultModal.vue'

const { success, err } = useNotification()

const route = useRoute()

interface Props {
  id?: string // Если id передан, то парсим владельца, иначе создаем нового
}
const props = defineProps<Props>()
const currentInspection = ref<Inspection | null>(null)

const sidebarStore = useSidebarStore()
const { selectedRoute } = storeToRefs(sidebarStore)

const inspectionStore = useInspectionStore()
const { fetchOne, Update, Create, Delete } = inspectionStore
const { isLoading, error } = storeToRefs(inspectionStore)

// Все input'ы
const ins_date = ref<Date | null>(null)
const result = ref<
  | 'Годно к эксплутации'
  | 'Годно с замечаниями'
  | 'Ограниченно годно'
  | 'Не годно к эксплутации'
  | null
>(null)
const next_ins_date = ref<Date | null>(null)
const inspectorID = ref('')
const inspectorSurname = ref('')
const shipID = ref('')
const shipNumber = ref('')

const isInspectorModalOpen = ref(false)
const isShipModalOpen = ref(false)
const isResultModalOpen = ref(false)
const toggleInspectorModal = () => {
  isInspectorModalOpen.value = !isInspectorModalOpen.value
}
const toggleShipModal = () => {
  isShipModalOpen.value = !isShipModalOpen.value
}
const toggleResultModal = () => {
  isResultModalOpen.value = !isResultModalOpen.value
}
const handleInspectorUpdate = (id: string, surname: string) => {
  inspectorID.value = id
  inspectorSurname.value = surname
  isInspectorModalOpen.value = false
}
const handleShipUpdate = (id: string, number: string) => {
  shipID.value = id
  shipNumber.value = number
  isShipModalOpen.value = false
}
const handleResultUpdate = (r: | 'Годно к эксплутации' | 'Годно с замечаниями' | 'Ограниченно годно' | 'Не годно к эксплутации') => {
  result.value = r
  isResultModalOpen.value = false
}

const isCalendarOpen = ref(false)
const container1Ref = ref<HTMLElement | null>(null)
const toggleCalendar = () => {
  isCalendarOpen.value = !isCalendarOpen.value
}
const handleDateSelect = (date: Date | null) => {
  if (date) {
    isCalendarOpen.value = false
    const nextYearDate = new Date(date)
    nextYearDate.setFullYear(nextYearDate.getFullYear() + 1)
    next_ins_date.value = nextYearDate
  }
}
const handleClickOutside = (event: MouseEvent) => {
  if (container1Ref.value && !container1Ref.value.contains(event.target as Node)) {
    isCalendarOpen.value = false
  }
}
// Проверки для кнопки Сохранить
const isCreateAvailable = () => {
  return (
    !props.id &&
    ins_date.value &&
    result.value &&
    next_ins_date.value &&
    inspectorID.value &&
    shipID.value
  )
}
const isUpdateAvailable = () => {
  return (
    ins_date.value &&
    result.value &&
    next_ins_date.value &&
    inspectorID.value &&
    shipID.value &&
    (inspectorID.value !== currentInspection.value?.Inspector?.id ||
      shipID.value !== currentInspection.value?.Ship?.id ||
      result.value !== currentInspection.value?.result ||
      formatDate(ins_date.value) !== formatDate(currentInspection.value.inspection_date) ||
      formatDate(next_ins_date.value) !== formatDate(currentInspection.value.next_inspection_date))
  )
}

const saveShip = async () => {
  if (props.id) {
    const req: Inspection = {
      id: props.id,
      inspector_id: inspectorID.value,
      ship_id: shipID.value,
      result: result.value!,
      inspection_date: ins_date.value!,
      next_inspection_date: next_ins_date.value!,
    }
    if (isUpdateAvailable()) {
      await Update(req)
      if (error.value) {
        err('Ошибка обновления записи', error.value)
      } else {
        success('Запись обновлена', 'Вы успешно обновили запись')
        currentInspection.value = await fetchOne(props.id)
      }
    }
  } else {
    if (isCreateAvailable()) {
      const req: InspectionCreateRequest = {
        inspector_id: inspectorID.value,
        ship_id: shipID.value,
        result: result.value!,
        inspection_date: ins_date.value!,
        next_inspection_date: next_ins_date.value!,
      }
      await Create(req)
      if (error.value) {
        err('Ошибка создание записи', error.value)
      } else {
        success('Запись добавлена', 'Вы успешно создали новую запись')
        await router.push('/')
      }
    }
  }
}
const deleteShip = async () => {
  if (props.id) {
    await Delete(props.id)

    if (error.value) {
      err('Ошибка при удалении', error.value)
    } else {
      success('Успешное удаление', 'Вы удалили запись об осмотре')
      await router.push('/')
    }
  }
}
onMounted(async () => {
  if (typeof route.meta.page_id === 'number')
    selectedRoute.value = { block: 'forms', id: route.meta.page_id }
  document.addEventListener('click', handleClickOutside)
  if (props.id) {
    currentInspection.value = await fetchOne(props.id)

    if (currentInspection.value) {
      inspectorID.value = currentInspection.value.Inspector!.id
      inspectorSurname.value = currentInspection.value.Inspector!.surname
      shipID.value = currentInspection.value.Ship!.id
      shipNumber.value = currentInspection.value.Ship!.ship_number
      ins_date.value = currentInspection.value.inspection_date
      result.value = currentInspection.value.result
      next_ins_date.value = currentInspection.value.next_inspection_date
    }
  }
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="input-view">
    <div class="title">
      <img src="/img/gims.png" alt="logo" />
      <div class="text">
        <h1>ГИМС РФ</h1>
        <p>
          Вы находитесь на странице ввода данных осмотра
          {{ currentInspection ? ' судна с номером «' + currentInspection.Ship!.ship_number + '»' : '' }}
        </p>
      </div>
    </div>
    <Skeleton v-if="isLoading && !error" height="300px" />
    <p v-else-if="error">Произошла ошибка: {{ error }}</p>
    <div class="container" v-else>
      <div class="item">
        <p>Инспектор:</p>
        <button @click="toggleInspectorModal" ref="containerRef">
          {{ inspectorSurname ? inspectorSurname : 'Инспектор' }}
        </button>
      </div>
      <div class="item">
        <p>Судно:</p>
        <button @click="toggleShipModal" ref="containerRef">
          {{ shipNumber ? shipNumber : 'Судно' }}
        </button>
      </div>
      <div class="item" :style="{ position: 'relative' }">
        <p>Дата проведения:</p>
        <button @click="toggleCalendar" ref="containerRef">
          {{ ins_date ? formatDate(ins_date) : 'Дата проведения' }}
          <img src="/icons/calendar.svg" alt="calendar" width="16px" />
        </button>
        <VDatePicker
          :style="{
            position: 'absolute',
            top: '85px',
            width: '100%',
            display: isCalendarOpen ? 'block' : 'none',
          }"
          @update:modelValue="handleDateSelect"
          v-model="ins_date"
          mode="date"
          :max-date="new Date()"
        />
      </div>
      <div class="item">
        <p>Результат:</p>
        <button @click="toggleResultModal" ref="containerRef">
          {{ result ? result : 'Результат' }}
        </button>
      </div>
      <div class="item">
        <p>Следующая дата:</p>
        <p class="next_date">{{next_ins_date ? formatDate(next_ins_date) : "Следующая дата"}}</p>
      </div>
    </div>
    <div class="actions">
      <button
        @click="saveShip"
        class="save"
        :style="{
          display: (id && isUpdateAvailable()) || isCreateAvailable() ? 'block' : 'none',
        }"
      >
        {{ id ? 'Сохранить изменения' : 'Добавить запись' }}
      </button>
      <button v-if="id" class="delete" @click="deleteShip">Удалить запись</button>
    </div>
  </div>

  <SelectInspectorModal
    :is-open="isInspectorModalOpen"
    :inspector-i-d="inspectorID"
    @close="isInspectorModalOpen = false"
    @inspector-updated="handleInspectorUpdate"
  />
  <SelectShipModal
    :is-open="isShipModalOpen"
    :ship-i-d="shipID"
    @close="isShipModalOpen = false"
    @ship-updated="handleShipUpdate"
  />
  <SelectResultModal
    :is-open="isResultModalOpen"
    :result="result"
    @close="isResultModalOpen = false"
    @result-updated="handleResultUpdate"
  />
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
    align-items: center;
    gap: 15px;

    margin-bottom: 20px;

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
      }
    }
  }
}
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;

  & > .item {
    display: flex;
    flex-direction: column;
    gap: 10px;

    & > p {
      font-size: 16px;
    }
    & > input,
    & > button, & > .next_date {
      font-size: 16px;
      padding: 15px 20px;
      width: 300px;
      background: rgba(gray, 0.1);
      border-radius: 4px;

      text-align: start;
      font-weight: 400;
    }

    & > button {
      display: flex;
      justify-content: space-between;
      align-items: center;
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
    &.delete {
      border-color: rgba(red, 1);
      background-color: rgba(red, 0.05);
      color: red;
      opacity: 0.6;

      &:hover {
        opacity: 0.99;
      }
    }
  }
}
</style>
