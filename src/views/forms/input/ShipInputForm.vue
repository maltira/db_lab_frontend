<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Skeleton from '@/components/ui/Skeleton.vue'
import { formatDate } from '@/utils/date_format.ts'
import type { ShipCreateRequest } from '@/types/dto/request.dto.ts'
import { useNotification } from '@/composables/useNotification.ts'
import router from '@/router'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { useRoute } from 'vue-router'
import type { Ship } from '@/types/ship.ts'
import { useShipStore } from '@/stores/ship.store.ts'
import SelectTypeModal from '@/components/ui/modals/SelectTypeModal.vue'
import SelectOwnerModal from '@/components/ui/modals/SelectOwnerModal.vue'
import SelectSkipperModal from '@/components/ui/modals/SelectSkipperModal.vue'
import SelectSStatusModal from '@/components/ui/modals/SelectSStatusModal.vue'

const { success, err } = useNotification()

const route = useRoute()

interface Props {
  id?: string // Если id передан, то парсим владельца, иначе создаем нового
}
const props = defineProps<Props>()
const currentShip = ref<Ship | null>(null)

const sidebarStore = useSidebarStore()
const { selectedRoute } = storeToRefs(sidebarStore)

const shipStore = useShipStore()
const { fetchOne, Update, Create, Delete } = shipStore
const { isLoading, error } = storeToRefs(shipStore)

// Все input'ы
const ship_number = ref('')
const reg_date = ref<Date | null>(null)
const reg_status = ref<'Активный' | 'Истёкший' | null>(null)
const typeID = ref('')
const typeName = ref('')
const ownerID = ref('')
const ownerSurname = ref('')
const skipperID = ref('')
const skipperSurname = ref('')

const isTypeModalOpen = ref(false)
const isOwnerModalOpen = ref(false)
const isSkipperModalOpen = ref(false)
const isStatusModalOpen = ref(false)
const toggleTypeModal = () => {
  isTypeModalOpen.value = !isTypeModalOpen.value
}
const toggleOwnerModal = () => {
  isOwnerModalOpen.value = !isOwnerModalOpen.value
}
const toggleSkipperModal = () => {
  isSkipperModalOpen.value = !isSkipperModalOpen.value
}
const toggleStatusModal = () => {
  isStatusModalOpen.value = !isStatusModalOpen.value
}
const handleTypeUpdate = (id: string, name: string) => {
  typeID.value = id
  typeName.value = name
  isTypeModalOpen.value = false
}
const handleOwnerUpdate = (id: string, surname: string) => {
  ownerID.value = id
  ownerSurname.value = surname
  isOwnerModalOpen.value = false
}
const handleSkipperUpdate = (id: string, surname: string) => {
  skipperID.value = id
  skipperSurname.value = surname
  isSkipperModalOpen.value = false
}
const handleStatusUpdate = (status: 'Активный' | 'Истёкший') => {
  reg_status.value = status
  isStatusModalOpen.value = false
}

const isCalendarOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const toggleCalendar = () => {
  isCalendarOpen.value = !isCalendarOpen.value
}
const handleDateSelect = (date: Date | null) => {
  if (date) {
    isCalendarOpen.value = false
  }
}
const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isCalendarOpen.value = false
  }
}
// Проверки для кнопки Сохранить
const isCreateAvailable = () => {
  return (
    !props.id &&
    typeID.value &&
    ownerID.value &&
    skipperID.value &&
    ship_number.value &&
    reg_date.value &&
    reg_status.value
  )
}
const isUpdateAvailable = () => {
  return (
    typeID.value &&
    ownerID.value &&
    skipperID.value &&
    ship_number.value &&
    reg_date.value &&
    reg_status.value &&
    (typeID.value!== currentShip.value?.Type?.id ||
      ownerID.value !== currentShip.value?.Owner?.id ||
      skipperID.value !== currentShip.value?.Skipper?.id ||
      ship_number.value !== currentShip.value?.ship_number ||
      formatDate(reg_date.value) !== formatDate(currentShip.value.registration_date) ||
      reg_status.value !== currentShip.value.registration_status)
  )
}

const saveShip = async () => {
  if (props.id) {
    const req: Ship = {
      id: props.id,
      type_id: typeID.value,
      owner_id: ownerID.value,
      skipper_id: skipperID.value,
      ship_number: ship_number.value,
      registration_date: reg_date.value!,
      registration_status: reg_status.value!,
    }
    if (isUpdateAvailable()) {
      await Update(req)
      if (error.value) {
        err('Ошибка обновления записи', error.value)
      } else {
        success('Запись обновлена', 'Вы успешно обновили запись')
        currentShip.value = await fetchOne(props.id)
      }
    }
  } else {
    if (isCreateAvailable()) {
      const req: ShipCreateRequest = {
        type_id: typeID.value,
        owner_id: ownerID.value,
        skipper_id: skipperID.value,
        ship_number: ship_number.value,
        registration_date: reg_date.value!,
        registration_status: reg_status.value!,
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
      success('Успешное удаление', 'Вы удалили запись о судне')
      await router.push('/')
    }
  }
}
onMounted(async () => {
  if (typeof route.meta.page_id === 'number')
    selectedRoute.value = { block: 'forms', id: route.meta.page_id }
  document.addEventListener('click', handleClickOutside)
  if (props.id) {
    currentShip.value = await fetchOne(props.id)

    if (currentShip.value) {
      typeID.value = currentShip.value.Type!.id
      typeName.value = currentShip.value.Type!.name
      ownerID.value = currentShip.value.Owner!.id
      ownerSurname.value = currentShip.value.Owner!.surname
      skipperID.value = currentShip.value.Skipper!.id
      skipperSurname.value = currentShip.value.Skipper!.surname
      ship_number.value = currentShip.value.ship_number
      reg_date.value = currentShip.value.registration_date
      reg_status.value = currentShip.value.registration_status
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
          Вы находитесь на странице ввода данных судна
          {{ currentShip ? ' с номером «' + currentShip.ship_number + '»' : '' }}
        </p>
      </div>
    </div>
    <Skeleton v-if="isLoading && !error" height="300px" />
    <p v-else-if="error">Произошла ошибка: {{ error }}</p>
    <div class="container" v-else>
      <div class="item">
        <p>Тип судна:</p>
        <button @click="toggleTypeModal">
          {{ typeName ? typeName : "Тип судна" }}
        </button>
      </div>
      <div class="item">
        <p>Владелец:</p>
        <button @click="toggleOwnerModal">
          {{ ownerSurname ? ownerSurname : "Владелец"}}
        </button>
      </div>
      <div class="item">
        <p>Судоводитель:</p>
        <button @click="toggleSkipperModal">
          {{ skipperSurname ? skipperSurname : "Судоводитель"}}
        </button>
      </div>
      <div class="item">
        <p>Номер судна:</p>
        <input type="text" v-model="ship_number" placeholder="Номер судна" />
      </div>
      <div class="item" :style="{ position: 'relative' }">
        <p>Дата регистрации:</p>
        <button @click="toggleCalendar" ref="containerRef">
          {{ reg_date ? formatDate(reg_date) : 'Дата регистрации' }}
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
          v-model="reg_date"
          mode="date"
          :max-date="new Date()"
        />
      </div>
      <div class="item">
        <p>Статус регистрации:</p>
        <button @click="toggleStatusModal" :style="{color: reg_status ? (reg_status === 'Истёкший' ? 'red' : 'rgb(112, 224, 0)') : ''}">
          {{ reg_status ? reg_status : "Статус регистрации"}}
        </button>
      </div>
    </div>
    <div class="actions">
      <button v-if="id" @click="router.push(`/form/data/violation/ship/${id}`)">Нарушения</button>
      <button v-if="id" @click="router.push(`/form/data/inspections/ship/${id}`)">Осмотры</button>
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
  <SelectTypeModal :is-open="isTypeModalOpen" :type-i-d="typeID" @close="isTypeModalOpen = false" @type-updated="handleTypeUpdate"/>
  <SelectOwnerModal :is-open="isOwnerModalOpen" :owner-i-d="ownerID" @close="isOwnerModalOpen = false" @owner-updated="handleOwnerUpdate"/>
  <SelectSkipperModal :is-open="isSkipperModalOpen" :skipper-i-d="skipperID" @close="isSkipperModalOpen = false" @skipper-updated="handleSkipperUpdate"/>
  <SelectSStatusModal :is-open="isStatusModalOpen" :status="reg_status" @close="isStatusModalOpen = false" @status-updated="handleStatusUpdate"/>
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
