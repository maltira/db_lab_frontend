<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import router from '@/router'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { useInspectorStore } from '@/stores/inspector.store.ts'
import { useRoute } from 'vue-router'

const route = useRoute()

const sidebarStore = useSidebarStore()
const { selectedRoute } = storeToRefs(sidebarStore)

const insStore = useInspectorStore()
const { fetchInspectors } = insStore
const { inspectors, isLoading, error } = storeToRefs(insStore)

const reloadInspectors = async () => {
  await fetchInspectors()
}

const goToInspector = async (id: string) => {
  await router.push(`/form/input/inspector/${id}`)
}

onMounted(async () => {
  await fetchInspectors()
  if (typeof route.meta.page_id === 'number')
    selectedRoute.value = { block: "forms", id: route.meta.page_id}
})
</script>

<template>
  <div class="data-view">
    <div class="title">
      <img src="/img/gims.png" alt="logo">
      <div class="text">
        <h1>ГИМС РФ</h1>
        <p>Вы находитесь на странице с инспекторами</p>
      </div>
    </div>
    <Skeleton height="300px" v-if="isLoading && !error"/>
    <p v-else-if="error">Произошла ошибка: {{error}}</p>
    <table v-else-if="inspectors.length > 0">
      <thead>
      <tr>
        <td>Имя</td>
        <td>Фамилия</td>
        <td>Отчество</td>
        <td>Должность</td>
        <td>Номер телефона</td>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="(ins, i) in inspectors"
        :key="i"
        @click="goToInspector(ins.id)"
      >
        <td>{{ins.name}}</td>
        <td>{{ins.surname}}</td>
        <td>{{ins.patronymic || ""}}</td>
        <td>{{ins.post}}</td>
        <td>{{ins.phone}}</td>
      </tr>
      </tbody>
    </table>
    <p v-else>Инспекторы не найдены</p>
    <div class="actions">
      <button @click="router.push('/form/input/inspector')">
        <img src="/icons/add.svg" alt="add">
        Новая запись
      </button>
      <button v-if="inspectors.length > 0">
        <img src="/icons/search.svg" alt="search">
        Найти запись
      </button>
      <button @click="reloadInspectors" >
        <img src="/icons/reload.svg" alt="reload">
        Обновить данные
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
      & > h1, & > p {
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
}
table {
  background: rgba(gray, 0.07);
  padding: 5px 15px 15px 15px;
  border-radius: 16px;
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
      }
      &:last-child {

        & > td {
          border-bottom: none;
        }
      }
      &:hover{
        cursor: pointer;
        background-color: rgba(gray, 0.08);
      }
    }
  }
}
.actions{
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
    &:hover{
      border-color: rgba(#6378ff, 1);
      background-color: rgba(#6378ff, 0.05);
    }
  }
}
</style>
