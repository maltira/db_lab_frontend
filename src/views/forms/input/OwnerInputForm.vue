<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { Owner } from '@/types/owner.ts'
import { useOwnerStore } from '@/stores/owner.store.ts'
import { storeToRefs } from 'pinia'
import Skeleton from '@/components/ui/Skeleton.vue'
import { formatDate } from '@/utils/date_format.ts'
interface Props {
  id?: string // Если id передан, то парсим владельца, иначе создаем нового
}
const props = defineProps<Props>()
const currentOwner = ref<Owner | null>(null)

const ownerStore = useOwnerStore()
const { fetchOne } = ownerStore
const { isLoading, error } = storeToRefs(ownerStore)

// Все input'ы
const name = ref('')
const surname = ref('')
const patronymic = ref('')
const address = ref('')
const type_of_person = ref('')
const birthday = ref<Date | null>(null)
const phone = ref('')

const isCalendarOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const toggleCalendar = () => {
  isCalendarOpen.value = !isCalendarOpen.value
}
const handleDateSelect = (date: Date | null) => {
  if (date) {
    // Закрываем календарь после выбора даты
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
    name.value &&
    surname.value &&
    address.value &&
    type_of_person.value &&
    birthday.value &&
    phone.value
  )
}
const isUpdateAvailable = () => {
  return (
    name.value &&
    surname.value &&
    patronymic.value &&
    address.value &&
    type_of_person.value &&
    birthday.value &&
    phone.value &&
    (name.value != currentOwner.value?.name ||
      surname.value != currentOwner.value?.surname ||
      patronymic.value != currentOwner.value.patronymic ||
      address.value != currentOwner.value.address ||
      type_of_person.value != currentOwner.value.type_of_person ||
      birthday.value != currentOwner.value.birth_date ||
      phone.value != currentOwner.value.phone)
  )
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  if (props.id) {
    currentOwner.value = await fetchOne(props.id)

    if (currentOwner.value) {
      name.value = currentOwner.value.name
      surname.value = currentOwner.value.surname
      patronymic.value = currentOwner.value.patronymic || ''
      address.value = currentOwner.value.address
      type_of_person.value = currentOwner.value.type_of_person
      birthday.value = currentOwner.value.birth_date
      phone.value = currentOwner.value.phone
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
        <p>Вы находитесь на странице владельца</p>
      </div>
    </div>
    <Skeleton v-if="isLoading && !error" height="300px" />
    <p v-else-if="error">Произошла ошибка: {{ error }}</p>
    <div class="container" v-else>
      <div class="item">
        <p>Имя:</p>
        <input type="text" v-model="name" placeholder="Имя" />
      </div>
      <div class="item">
        <p>Фамилия:</p>
        <input type="text" v-model="surname" placeholder="Фамилия" />
      </div>
      <div class="item">
        <p>Отчество:</p>
        <input type="text" v-model="patronymic" placeholder="Отчество" />
      </div>
      <div class="item">
        <p>Тип лица:</p>
        <input type="text" v-model="type_of_person" placeholder="Тип лица" />
      </div>
      <div class="item" :style="{ position: 'relative' }">
        <p>Дата рождения:</p>
        <button @click="toggleCalendar" ref="containerRef">
          {{ birthday ? formatDate(birthday) : 'Дата рождения' }}
          <img src="/icons/calendar.svg" alt="calendar" width="16px" />
        </button>
        <VDatePicker
          :style="{ position: 'absolute', top: '85px', width: '100%' }"
          v-if="isCalendarOpen"
          @update:modelValue="handleDateSelect"
          @close="isCalendarOpen = false"
          v-model="birthday"
          mode="date"
          :max-date="new Date()"
        />
      </div>
      <div class="item">
        <p>Телефон:</p>
        <input type="text" v-model="phone" placeholder="Номер телефона" />
      </div>
      <div class="item">
        <p>Адрес:</p>
        <textarea type="text" v-model="address" placeholder="Адрес владельца" />
      </div>
    </div>
    <div class="actions">
      <button v-if="id">К суднам владельца</button>
      <button
        class="save"
        :style="{
          display: (id && isUpdateAvailable()) || (!id && isCreateAvailable()) ? 'block' : 'none',
        }"
      >
        Сохранить
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
  }
}
</style>
