<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import router from '@/router'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { useRoute } from 'vue-router'
import { useQueryStore } from '@/stores/query.store.ts'
import Skeleton from '@/components/ui/Skeleton.vue'
import type { Query } from '@/types/query.ts'
import { useNotification } from '@/composables/useNotification.ts'

const route = useRoute()

const { err, success } = useNotification()

const queryStore = useQueryStore()
const { queries, isLoading, error } = storeToRefs(queryStore)
const { fetchQueries, update } = queryStore

const sidebarStore = useSidebarStore()
const { selectedRoute } = storeToRefs(sidebarStore)

const allAccess = ref<Array<boolean | null>>([])
const modifiedElements = ref<Array<Query | null>>([])
const isUpdateAvailable = ref<boolean>(false)

watch(allAccess.value, (newValue) => {
  console.log('newValue', newValue)
  newValue.forEach((query, i) => {
    if (queries.value[i] && queries.value[i].access !== query) {
      modifiedElements.value[i] = {
        id: queries.value[i].id,
        name: queries.value[i].name,
        route: queries.value[i].route,
        access: query!,
      }
    } else if (queries.value[i] && queries.value[i].access === query) {
      modifiedElements.value[i] = null
    }
  })
  console.log('modifiedElements', modifiedElements.value)
  isUpdateAvailable.value = modifiedElements.value.filter((el) => el).length > 0
})

const UpdateQueries = async () => {
  console.log(modifiedElements.value)
  for (let el of modifiedElements.value) {
    if (el) await update(el)

    if (el && error.value) {
      err('Не удалось обновить запрос', `${el.name}. ${error.value}`)
    }
  }
  modifiedElements.value.forEach((el, i) => {
    modifiedElements.value[i] = null
    allAccess.value[i] = null
  })
  await reloadElements()

  success('Выбранные запрос обновлены', 'Вы успешно обновили выбранные запросы')
}

const reloadElements = async () => {
  await fetchQueries()
  queries.value.forEach((query, i) => {
    allAccess.value[i] = query.access
  })
}
onMounted(async () => {
  if (typeof route.meta.page_id === 'number')
    selectedRoute.value = { block: 'forms', id: route.meta.page_id, access: false }

  await fetchQueries()
  queries.value.forEach((query, i) => {
    allAccess.value[i] = query.access
  })
  console.log('allAccess onMounted', allAccess.value)
})
</script>

<template>
  <div class="data-view">
    <div class="title">
      <img src="/img/gims.png" alt="logo" />
      <div class="text">
        <h1>ГИМС РФ</h1>
        <p>Вы находитесь на странице запросов</p>
      </div>
    </div>
    <div class="container-table">
      <Skeleton height="20px" width="200px" v-if="isLoading && !error" />
      <Skeleton height="300px" v-if="isLoading && !error" />

      <p v-if="!isLoading && !error && queries.length > 0" class="mes-p">
        Количество записей: {{ queries.length }}
      </p>
      <table v-if="!isLoading && !error && queries.length > 0">
        <thead>
          <tr>
            <td>Название запроса</td>
            <td class="parent-input">Доступ</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(q, i) in queries" :key="i">
            <td>{{ q.name }}</td>
            <td class="parent-input">
              <input type="checkbox" v-model="allAccess[i]" class="input-checkbox" />
            </td>
            <td class="list-button" @click="router.push(`${q.route}`)">Выполнить</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="mes-p">Ничего не найдено</p>
    </div>
    <div class="actions">
      <button v-if="isUpdateAvailable" @click="UpdateQueries">
        <img src="/icons/research.png" alt="save" />
        Сохранить изменения
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.data-view {
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
td {
  font-size: 16px;
  align-content: start;
  padding-left: 6px !important;

  border-bottom: 1px solid rgba(gray, 0.15);

  &.list-button {
    background-color: rgba(gray, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;

    &:hover {
      cursor: pointer;
      background-color: rgba(gray, 0.2);
    }
  }

  &.parent-input {
    text-align: center;
    & > .input-checkbox {
      text-align: center;
      width: 20px;
      height: 20px;
    }
  }
}
.container-table {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
table {
  background: rgba(gray, 0.07);
  padding: 5px 15px 15px 15px;
  border-radius: 16px;
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

        &.address {
          max-width: 250px;
        }
        &.active-td:hover {
          background-color: rgba(gray, 0.08);
        }
      }
      &:last-child {
        & > td {
          border-bottom: none;
        }
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
.filter-block {
  display: flex;
  align-items: start;
  flex-direction: column;
  gap: 10px;

  & > button {
    font-size: 16px;
    opacity: 0.7;

    &:hover {
      opacity: 9;
    }
  }
}
.mes-p {
  font-size: 16px;
  opacity: 0.9;
}
</style>
