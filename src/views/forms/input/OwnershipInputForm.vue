<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Skeleton from '@/components/ui/Skeleton.vue'
import { formatDate } from '@/utils/date_format.ts'
import type { OwnershipCreateRequest } from '@/types/dto/request.dto.ts'
import { useNotification } from '@/composables/useNotification.ts'
import router from '@/router'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { useRoute } from 'vue-router'
import SelectOwnerModal from '@/components/ui/modals/SelectOwnerModal.vue'
import { useOwnershipStore } from '@/stores/ownership.store.ts'
import type { Ownership } from '@/types/ownership.ts'
import SelectShipModal from '@/components/ui/modals/SelectShipModal.vue'

const { success, err } = useNotification()

const route = useRoute()

interface Props {
  id?: string // Если id передан, то парсим владельца, иначе создаем нового
}
const props = defineProps<Props>()
const currentOwnership = ref<Ownership | null>(null)

const sidebarStore = useSidebarStore()
const { selectedRoute } = storeToRefs(sidebarStore)

const ownershipStore = useOwnershipStore()
const { fetchOne, Update, Create, Delete } = ownershipStore
const { isLoading, error } = storeToRefs(ownershipStore)

// Все input'ы
const shipID = ref('')
const shipNumber = ref('')

const transferDate = ref<Date | null>(null)

const oldOwnerID = ref('')
const oldOwnerSurname = ref('')

const newOwnerID = ref('')
const newOwnerSurname = ref('')

const isNewOwnerModalOpen = ref(false)
const isOldOwnerModalOpen = ref(false)
const isShipModalOpen = ref(false)
const toggleNewOwnerModal = () => {
  isNewOwnerModalOpen.value = !isNewOwnerModalOpen.value
}
const toggleOldOwnerModal = () => {
  isOldOwnerModalOpen.value = !isOldOwnerModalOpen.value
}
const toggleShipModal = () => {
  isShipModalOpen.value = !isShipModalOpen.value
}

const handleNewOwnerUpdate = (id: string, surname: string) => {
  newOwnerID.value = id
  newOwnerSurname.value = surname
  isNewOwnerModalOpen.value = false
}
const handleOldOwnerUpdate = (id: string, surname: string) => {
  oldOwnerID.value = id
  oldOwnerSurname.value = surname
  shipID.value = ''
  shipNumber.value = ''
  isOldOwnerModalOpen.value = false
}
const handleShipUpdate = (id: string, number: string) => {
  shipID.value = id
  shipNumber.value = number
  isShipModalOpen.value = false
}

const isCalendarOpen = ref(false)
const container3Ref = ref<HTMLElement | null>(null)
const toggleCalendar = () => {
  isCalendarOpen.value = !isCalendarOpen.value
}
const handleDateSelect = (date: Date | null) => {
  if (date) {
    isCalendarOpen.value = false
  }
}
const handleClickOutside = (event: MouseEvent) => {
  if (container3Ref.value && !container3Ref.value.contains(event.target as Node)) {
    isCalendarOpen.value = false
  }
}
// Проверки для кнопки Сохранить
const isCreateAvailable = () => {
  return !props.id && oldOwnerID.value && newOwnerID.value && transferDate.value && shipID.value
}
const isUpdateAvailable = () => {
  return (
    oldOwnerID.value &&
    newOwnerID.value &&
    transferDate.value &&
    shipID.value &&
    (oldOwnerID.value !== currentOwnership.value?.ShipOldOwner?.id ||
      newOwnerID.value !== currentOwnership.value?.ShipNewOwner?.id ||
      shipID.value !== currentOwnership.value?.ship_id ||
      formatDate(transferDate.value) !== formatDate(currentOwnership.value.transfer_date))
  )
}

const saveOwnership = async () => {
  if (props.id) {
    const req: Ownership = {
      id: props.id,
      old_owner: oldOwnerID.value,
      new_owner: newOwnerID.value,
      transfer_date: transferDate.value!,
      ship_id: shipID.value,
    }
    if (isUpdateAvailable()) {
      await Update(req)
      if (error.value) {
        err('Ошибка обновления записи', error.value)
      } else {
        success('Запись обновлена', 'Вы успешно обновили запись')
        currentOwnership.value = await fetchOne(props.id)
      }
    }
  } else {
    if (isCreateAvailable()) {
      const req: OwnershipCreateRequest = {
        old_owner: oldOwnerID.value,
        new_owner: newOwnerID.value,
        transfer_date: transferDate.value!,
        ship_id: shipID.value,
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
const deleteOwnership = async () => {
  if (props.id) {
    await Delete(props.id)

    if (error.value) {
      err('Ошибка при удалении', error.value)
    } else {
      success('Успешное удаление', 'Вы удалили запись о передаче судна')
      await router.push('/')
    }
  }
}
onMounted(async () => {
  if (typeof route.meta.page_id === 'number')
    selectedRoute.value = { block: 'forms', id: route.meta.page_id }
  document.addEventListener('click', handleClickOutside)
  if (props.id) {
    currentOwnership.value = await fetchOne(props.id)

    if (currentOwnership.value) {
      oldOwnerID.value = currentOwnership.value.ShipOldOwner!.id
      oldOwnerSurname.value = currentOwnership.value.ShipOldOwner!.surname
      newOwnerID.value = currentOwnership.value.ShipNewOwner!.id
      newOwnerSurname.value = currentOwnership.value.ShipNewOwner!.surname
      transferDate.value = currentOwnership.value.transfer_date
      shipID.value = currentOwnership.value.ship_id
      shipNumber.value = currentOwnership.value.Ship!.ship_number
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
          Вы находитесь на странице ввода данных передачи судна
        </p>
      </div>
    </div>
    <Skeleton v-if="isLoading && !error" height="300px" />
    <p v-else-if="error">Произошла ошибка: {{ error }}</p>
    <div class="container" v-else>
      <div class="item">
        <p>Старый владелец:</p>
        <button @click="toggleOldOwnerModal">
          {{ oldOwnerSurname ? oldOwnerSurname : 'Старый владелец' }}
        </button>
      </div>
      <div class="item">
        <p>Новый владелец:</p>
        <button @click="toggleNewOwnerModal">
          {{ newOwnerSurname ? newOwnerSurname : 'Новый владелец' }}
        </button>
      </div>
      <div class="item" :style="{ position: 'relative' }">
        <p>Дата передачи:</p>
        <button @click="toggleCalendar" ref="container3Ref">
          {{ transferDate ? formatDate(transferDate) : 'Дата передачи' }}
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
          v-model="transferDate"
          mode="date"
          :max-date="new Date()"
        />
      </div>
      <div class="item">
        <p>Номер судна:</p>
        <button @click="toggleShipModal">
          {{ shipNumber ? shipNumber : 'Номер судна' }}
        </button>
      </div>
    </div>
    <div class="actions">
      <button
        @click="saveOwnership"
        class="save"
        :style="{
          display: (id && isUpdateAvailable()) || isCreateAvailable() ? 'block' : 'none',
        }"
      >
        {{ id ? 'Сохранить изменения' : 'Добавить запись' }}
      </button>
      <button v-if="id" class="delete" @click="deleteOwnership">Удалить запись</button>
    </div>
  </div>
  <SelectOwnerModal
    :is-open="isOldOwnerModalOpen"
    :owner-i-d="oldOwnerID"
    @close="isOldOwnerModalOpen = false"
    @owner-updated="handleOldOwnerUpdate"
  />
  <SelectOwnerModal
    :is-open="isNewOwnerModalOpen"
    :owner-i-d="newOwnerID"
    @close="isNewOwnerModalOpen = false"
    @owner-updated="handleNewOwnerUpdate"
  />
  <SelectShipModal
    :is-open="isShipModalOpen"
    :ship-i-d="shipID"
    :owner-i-d-filter="oldOwnerID"
    @close="isShipModalOpen = false"
    @ship-updated="handleShipUpdate"
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
