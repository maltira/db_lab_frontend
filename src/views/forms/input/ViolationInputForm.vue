<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Skeleton from '@/components/ui/Skeleton.vue'
import { formatDate } from '@/utils/date_format.ts'
import type { ViolationCreateRequest } from '@/types/dto/request.dto.ts'
import { useNotification } from '@/composables/useNotification.ts'
import router from '@/router'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { useRoute } from 'vue-router'
import SelectInspectorModal from '@/components/ui/modals/SelectInspectorModal.vue'
import SelectShipModal from '@/components/ui/modals/SelectShipModal.vue'
import { useViolationStore } from '@/stores/violation.store.ts'
import type { Violation } from '@/types/violation.ts'
import SelectVStatusModal from '@/components/ui/modals/SelectVStatusModal.vue'

const { success, err } = useNotification()

const route = useRoute()

interface Props {
  id?: string // Если id передан, то парсим владельца, иначе создаем нового
}
const props = defineProps<Props>()
const currentViolation = ref<Violation | null>(null)

const sidebarStore = useSidebarStore()
const { selectedRoute } = storeToRefs(sidebarStore)

const violationStore = useViolationStore()
const { fetchOne, Update, Create, Delete } = violationStore
const { isLoading, error } = storeToRefs(violationStore)

// Все input'ы
const v_date = ref<Date | null>(null)
const amount = ref<string>()
const description = ref<string>('')
const status = ref<'Исполнено' | 'Не исполнено' | null>(null)
const inspectorID = ref('')
const inspectorSurname = ref('')
const shipID = ref('')
const shipNumber = ref('')

const isInspectorModalOpen = ref(false)
const isShipModalOpen = ref(false)
const isVStatusModalOpen = ref(false)
const toggleInspectorModal = () => {
  isInspectorModalOpen.value = !isInspectorModalOpen.value
}
const toggleShipModal = () => {
  isShipModalOpen.value = !isShipModalOpen.value
}
const toggleVStatusModal = () => {
  isVStatusModalOpen.value = !isVStatusModalOpen.value
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
const handleVStatusUpdate = (r: 'Исполнено' | 'Не исполнено') => {
  status.value = r
  isVStatusModalOpen.value = false
}

const isCalendarOpen = ref(false)
const toggleCalendar = () => {
  isCalendarOpen.value = !isCalendarOpen.value
}
const handleDateSelect = (date: Date | null) => {
  if (date) {
    isCalendarOpen.value = false
  }
}
const handleClickOutside = (event: MouseEvent) => {
  const calendarElement = document.getElementById('container4Ref')
  if (calendarElement && !calendarElement.contains(event.target as Node)) {
    isCalendarOpen.value = false
  }
}
// Проверки для кнопки Сохранить
const isCreateAvailable = () => {
  return (
    !props.id &&
    v_date.value &&
    amount.value &&
    description.value &&
    status.value &&
    inspectorID.value &&
    shipID.value
  )
}
const isUpdateAvailable = () => {
  return (
    v_date.value &&
    amount.value &&
    description.value &&
    status.value &&
    inspectorID.value &&
    shipID.value &&
    (inspectorID.value !== currentViolation.value?.Inspector?.id ||
      shipID.value !== currentViolation.value?.Ship?.id ||
      amount.value !== currentViolation.value?.amount ||
      status.value !== currentViolation.value?.status ||
      formatDate(v_date.value) !== formatDate(currentViolation.value.violation_date) ||
      description.value !== currentViolation.value?.description)
  )
}

const saveViolation = async () => {
  if (props.id) {
    const req: Violation = {
      id: props.id,
      inspector_id: inspectorID.value,
      ship_id: shipID.value,
      amount: amount.value!,
      description: description.value,
      status: status.value!,
      violation_date: v_date.value!,
    }
    console.log(req)
    if (isUpdateAvailable()) {
      await Update(req)
      if (error.value) {
        err('Ошибка обновления записи', error.value)
      } else {
        success('Запись обновлена', 'Вы успешно обновили запись')
        currentViolation.value = await fetchOne(props.id)
      }
    }
  } else {
    if (isCreateAvailable()) {
      const req: ViolationCreateRequest = {
        inspector_id: inspectorID.value,
        ship_id: shipID.value,
        status: status.value!,
        violation_date: v_date.value!,
        description: description.value,
        amount: amount.value!,
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
const deleteViolation = async () => {
  if (props.id) {
    await Delete(props.id)

    if (error.value) {
      err('Ошибка при удалении', error.value)
    } else {
      success('Успешное удаление', 'Вы удалили запись о нарушении')
      await router.push('/')
    }
  }
}
onMounted(async () => {
  if (typeof route.meta.page_id === 'number')
    selectedRoute.value = { block: 'forms', id: route.meta.page_id }
  document.addEventListener('click', handleClickOutside)
  if (props.id) {
    currentViolation.value = await fetchOne(props.id)

    if (currentViolation.value) {
      inspectorID.value = currentViolation.value.Inspector!.id
      inspectorSurname.value = currentViolation.value.Inspector!.surname
      shipID.value = currentViolation.value.Ship!.id
      shipNumber.value = currentViolation.value.Ship!.ship_number
      v_date.value = currentViolation.value.violation_date
      status.value = currentViolation.value.status
      description.value = currentViolation.value.description
      amount.value = currentViolation.value.amount
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
          Вы находитесь на странице ввода данных нарушения
          {{
            currentViolation ? ' судна с номером «' + currentViolation.Ship!.ship_number + '»' : ''
          }}
        </p>
      </div>
    </div>
    <Skeleton v-if="isLoading && !error" height="300px" />
    <p v-else-if="error">Произошла ошибка: {{ error }}</p>
    <div class="container" v-else>
      <div class="item">
        <p>Инспектор:</p>
        <button @click="toggleInspectorModal">
          {{ inspectorSurname ? inspectorSurname : 'Инспектор' }}
        </button>
      </div>
      <div class="item">
        <p>Судно:</p>
        <button @click="toggleShipModal">
          {{ shipNumber ? shipNumber : 'Судно' }}
        </button>
      </div>
      <div class="item" :style="{ position: 'relative' }" id="container4Ref">
        <p>Дата нарушения:</p>
        <button @click="toggleCalendar">
          {{ v_date ? formatDate(v_date) : 'Дата проведения' }}
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
          v-model="v_date"
          mode="date"
          :max-date="new Date()"
        />
      </div>
      <div class="item">
        <p>Сумма штрафа:</p>
        <input type="text" v-model="amount" placeholder="Сумма штрафа" />
      </div>
      <div class="item">
        <p>Описание:</p>
        <textarea type="text" v-model="description" placeholder="Описание нарушения" />
      </div>
      <div class="item">
        <p>Статус:</p>
        <button @click="toggleVStatusModal" :style="{color: status ? (status === 'Не исполнено' ? 'red' : 'rgb(112, 224, 0)') : ''}">
          {{ status ? status : 'Статус' }}
        </button>
      </div>
    </div>
    <div class="actions">
      <button
        @click="saveViolation"
        class="save"
        :style="{
          display: (id && isUpdateAvailable()) || isCreateAvailable() ? 'block' : 'none',
        }"
      >
        {{ id ? 'Сохранить изменения' : 'Добавить запись' }}
      </button>
      <button v-if="id" class="delete" @click="deleteViolation">Удалить запись</button>
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
  <SelectVStatusModal
    :is-open="isVStatusModalOpen"
    :status="status"
    @close="isVStatusModalOpen = false"
    @status-updated="handleVStatusUpdate"
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
    & > button,
    & > .next_date,
    & > textarea {
      font-size: 16px;
      padding: 15px 20px;
      width: 300px;
      background: rgba(gray, 0.1);
      border-radius: 4px;

      text-align: start;
      font-weight: 400;
    }

    & > textarea {
      width: 400px;
      height: min-content;
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
