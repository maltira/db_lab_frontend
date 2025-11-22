<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Skeleton from '@/components/ui/Skeleton.vue'
import type { InspectorCreateRequest } from '@/types/dto/request.dto.ts'
import { useNotification } from '@/composables/useNotification.ts'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import type { Inspector } from '@/types/inspector.ts'
import { useInspectorStore } from '@/stores/inspector.store.ts'
import router from '@/router'

const { success, err } = useNotification()

interface Props {
  id?: string // Если id передан, то парсим инспектора, иначе создаем нового
}
const props = defineProps<Props>()
const currentInspector = ref<Inspector | null>(null)

const sidebarStore = useSidebarStore()
const { selectedRoute } = storeToRefs(sidebarStore)

const inspectorStore = useInspectorStore()
const { fetchOne, Update, Create, Delete } = inspectorStore
const { isLoading, error } = storeToRefs(inspectorStore)

// Все input'ы
const name = ref('')
const surname = ref('')
const patronymic = ref('')
const post = ref('')
const phone = ref('')

// Проверки для кнопки Сохранить
const isCreateAvailable = () => {
  return !props.id && name.value && surname.value && patronymic.value && phone.value && post.value
}
const isUpdateAvailable = () => {
  return (
    name.value &&
    surname.value &&
    patronymic.value &&
    phone.value &&
    post.value &&
    (name.value !== currentInspector.value?.name ||
      surname.value !== currentInspector.value?.surname ||
      patronymic.value !== currentInspector.value?.patronymic ||
      phone.value !== currentInspector.value.phone ||
      post.value !== currentInspector.value.post)
  )
}

const saveInspector = async () => {
  if (props.id) {
    const req: Inspector = {
      id: props.id,
      name: name.value,
      surname: surname.value,
      patronymic: patronymic.value,
      phone: phone.value,
      post: post.value,
    }
    if (isUpdateAvailable()) {
      await Update(req)
      if (error.value) {
        err('Ошибка обновления записи', error.value)
      } else {
        success('Запись обновлена', 'Вы успешно обновили запись')
        currentInspector.value = await fetchOne(props.id)
      }
    }
  } else {
    if (isCreateAvailable()) {
      const req: InspectorCreateRequest = {
        name: name.value,
        surname: surname.value,
        patronymic: patronymic.value,
        phone: phone.value,
        post: post.value,
      }
      await Create(req)
      if (error.value) {
        err('Ошибка создание записи', error.value)
      } else {
        success('Запись добавлена', 'Вы успешно создали новую запись')
        await router.push("/form/data/inspectors")
      }
    }
  }
}
const deleteInspector = async () => {
  if (props.id) {
    await Delete(props.id)

    if (error.value) {
      err("Ошибка при удалении", error.value)
    } else {
      success("Успешное удаление", "Вы удалили запись об инспекторе")
      await router.push("/form/data/inspectors")
    }
  }
}
onMounted(async () => {
  selectedRoute.value = { block: 'forms', id: 2 }
  if (props.id) {
    currentInspector.value = await fetchOne(props.id)

    if (currentInspector.value) {
      name.value = currentInspector.value.name
      surname.value = currentInspector.value.surname
      patronymic.value = currentInspector.value.patronymic || ''
      phone.value = currentInspector.value.phone
      post.value = currentInspector.value.post
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
          Вы находитесь на странице ввода данных инспектора
          {{ currentInspector ? '«' + currentInspector.surname + '»' : '' }}
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
        <p>Должность:</p>
        <input type="text" v-model="post" placeholder="Должность" />
      </div>
      <div class="item">
        <p>Телефон:</p>
        <input type="text" v-model="phone" placeholder="Номер телефона" />
      </div>
    </div>
    <div class="actions">
      <button v-if="id" @click="router.push(`/form/data/violation/inspector/${id}`)">Выявленные нарушения</button>
      <button v-if="id" @click="router.push(`/form/data/inspections/inspector/${id}`)">Проведённые осмотры</button>
      <button
        @click="saveInspector"
        class="save"
        :style="{
          display: (id && isUpdateAvailable()) || isCreateAvailable() ? 'block' : 'none',
        }"
      >
        {{ id ? 'Сохранить изменения' : 'Добавить запись' }}
      </button>
      <button v-if="id" class="delete" @click="deleteInspector">Удалить запись</button>
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
