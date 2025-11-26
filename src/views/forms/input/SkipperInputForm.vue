<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Skeleton from '@/components/ui/Skeleton.vue'
import type { SkipperCreateRequest } from '@/types/dto/request.dto.ts'
import { useNotification } from '@/composables/useNotification.ts'
import router from '@/router'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { useRoute } from 'vue-router'
import type { Skipper } from '@/types/skipper.ts'
import { useSkipperStore } from '@/stores/skipper.store.ts'

const { success, err } = useNotification()

const route = useRoute()

interface Props {
  id?: string // Если id передан, то парсим владельца, иначе создаем нового
}
const props = defineProps<Props>()
const currentSkipper = ref<Skipper | null>(null)

const sidebarStore = useSidebarStore()
const { selectedRoute } = storeToRefs(sidebarStore)

const skipperStore = useSkipperStore()
const { fetchOne, Update, Create, Delete } = skipperStore
const { isLoading, error } = storeToRefs(skipperStore)

// Все input'ы
const name = ref('')
const surname = ref('')
const patronymic = ref('')
const id_number = ref('')

// Проверки для кнопки Сохранить
const isCreateAvailable = () => {
  return !props.id && name.value && surname.value && patronymic.value && id_number.value
}
const isUpdateAvailable = () => {
  return (
    name.value &&
    surname.value &&
    patronymic.value &&
    id_number.value &&
    (name.value !== currentSkipper.value?.name ||
      surname.value !== currentSkipper.value?.surname ||
      patronymic.value !== currentSkipper.value?.patronymic ||
      id_number.value !== currentSkipper.value?.id_number)
  )
}

const saveSkipper = async () => {
  if (props.id) {
    const req: Skipper = {
      id: props.id,
      name: name.value,
      surname: surname.value,
      patronymic: patronymic.value,
      id_number: id_number.value,
    }
    if (isUpdateAvailable()) {
      await Update(req)
      if (error.value) {
        err('Ошибка обновления записи', error.value)
      } else {
        success('Запись обновлена', 'Вы успешно обновили запись')
        currentSkipper.value = await fetchOne(props.id)
      }
    }
  } else {
    if (isCreateAvailable()) {
      const req: SkipperCreateRequest = {
        name: name.value,
        surname: surname.value,
        patronymic: patronymic.value,
        id_number: id_number.value,
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
const deleteSkipper = async () => {
  if (props.id) {
    await Delete(props.id)

    if (error.value) {
      err('Ошибка при удалении', error.value)
    } else {
      success('Успешное удаление', 'Вы удалили запись о судоводителе')
      await router.push('/')
    }
  }
}
onMounted(async () => {
  if (typeof route.meta.page_id === 'number')
    selectedRoute.value = { block: 'forms', id: route.meta.page_id }
  if (props.id) {
    currentSkipper.value = await fetchOne(props.id)

    if (currentSkipper.value) {
      name.value = currentSkipper.value.name
      surname.value = currentSkipper.value.surname
      patronymic.value = currentSkipper.value.patronymic || ''
      id_number.value = currentSkipper.value.id_number
    }
  }
})
</script>

<template>
  <div class="input-view">
    <div class="title">
      <img src="/img/gims.png" alt="logo" />
      <div class="text">
        <h1>ГИМС РФ</h1>
        <p>
          Вы находитесь на странице ввода данных судоводителя
          {{ currentSkipper ? ' «' + currentSkipper.surname + '»' : '' }}
        </p>
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
        <p>Номер удостоверения:</p>
        <input type="text" v-model="id_number" placeholder="Номер удостоверения" />
      </div>
    </div>
    <div class="actions">
      <button
        @click="saveSkipper"
        class="save"
        :style="{
          display: (id && isUpdateAvailable()) || isCreateAvailable() ? 'block' : 'none',
        }"
      >
        {{ id ? 'Сохранить изменения' : 'Добавить запись' }}
      </button>
      <button v-if="id" class="delete" @click="deleteSkipper">Удалить запись</button>
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
