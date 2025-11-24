<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { Owner } from '@/types/owner.ts'
import { useOwnerStore } from '@/stores/owner.store.ts'
import { storeToRefs } from 'pinia'
import Skeleton from '@/components/ui/Skeleton.vue'
import { formatDate } from '@/utils/date_format.ts'
import type { OwnerCreateRequest } from '@/types/dto/request.dto.ts'
import { useNotification } from '@/composables/useNotification.ts'
import router from '@/router'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { useRoute } from 'vue-router'

const { success, err } = useNotification()

const route = useRoute()

interface Props {
  id?: string // Если id передан, то парсим владельца, иначе создаем нового
}
const props = defineProps<Props>()
const currentOwner = ref<Owner | null>(null)

const sidebarStore = useSidebarStore()
const { selectedRoute } = storeToRefs(sidebarStore)

const ownerStore = useOwnerStore()
const { fetchOne, Update, Create, Delete } = ownerStore
const { isLoading, error } = storeToRefs(ownerStore)

// Все input'ы
const name = ref('')
const surname = ref('')
const patronymic = ref('')
const address = ref('')
const type_of_person = ref<'Физическое' | 'Юридическое' | null>(null)
const birthday = ref<Date | null>(null)
const phone = ref('')

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
  return !props.id &&
    name.value &&
    surname.value &&
    patronymic.value &&
    address.value &&
    type_of_person.value &&
    birthday.value &&
    phone.value
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
    (name.value !== currentOwner.value?.name ||
      surname.value !== currentOwner.value?.surname ||
      patronymic.value !== currentOwner.value?.patronymic ||
      address.value !== currentOwner.value?.address ||
      type_of_person.value !== currentOwner.value.type_of_person ||
      formatDate(birthday.value) !== formatDate(currentOwner.value.birth_date) ||
      phone.value !== currentOwner.value.phone)
  )
}

const saveOwner = async () => {
  if (props.id) {
    const req: Owner = {
      id: props.id,
      name: name.value,
      surname: surname.value,
      patronymic: patronymic.value,
      address: address.value,
      type_of_person: type_of_person.value!,
      birth_date: birthday.value!,
      phone: phone.value,
    }
    if (isUpdateAvailable()) {
      await Update(req)
      if (error.value) {
        err("Ошибка обновления записи", error.value)
      } else {
        success("Запись обновлена", "Вы успешно обновили запись")
        currentOwner.value = await fetchOne(props.id)
      }
    }
  } else {
    if (isCreateAvailable()) {
      const req: OwnerCreateRequest = {
        name: name.value,
        surname: surname.value,
        patronymic: patronymic.value,
        address: address.value,
        type_of_person: type_of_person.value!,
        birth_date: birthday.value!,
        phone: phone.value,
      }
      await Create(req)
      if (error.value) {
        err("Ошибка создание записи", error.value)
      } else {
        success("Запись добавлена", "Вы успешно создали новую запись")
        await router.push("/")
      }
    }
  }
}
const deleteOwner = async () => {
  if (props.id) {
    await Delete(props.id)

    if (error.value) {
      err("Ошибка при удалении", error.value)
    } else {
      success("Успешное удаление", "Вы удалили запись о владельце")
      await router.push("/")
    }
  }
}
onMounted(async () => {
  if (typeof route.meta.page_id === 'number')
    selectedRoute.value = { block: "forms", id: route.meta.page_id}
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
        <p>Вы находитесь на странице ввода данных владельца {{currentOwner ? "«" + currentOwner.surname + "»" : ""}}</p>
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
          :style="{
            position: 'absolute',
            top: '85px',
            width: '100%',
            display: isCalendarOpen ? 'block' : 'none',
          }"
          @update:modelValue="handleDateSelect"
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
      <button v-if="id" @click="router.push(`/form/data/ships/${id}`)">К суднам владельца</button>
      <button
        @click="saveOwner"
        class="save"
        :style="{
          display: id && isUpdateAvailable() || isCreateAvailable() ? 'block' : 'none',
        }"
      >
        {{id ? "Сохранить изменения" : "Добавить запись"}}
      </button>
      <button v-if="id" class="delete" @click="deleteOwner">Удалить запись</button>
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
    &.delete{
      border-color: rgba(red, 1);
      background-color: rgba(red, 0.05);
      color: red;
      opacity: 0.6;

      &:hover{
        opacity: 0.99;
      }
    }
  }
}
</style>
