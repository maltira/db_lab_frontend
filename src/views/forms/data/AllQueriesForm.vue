<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import router from '@/router'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { useRoute } from 'vue-router'
const route = useRoute()
const sidebarStore = useSidebarStore()
const { allQueries, selectedRoute } = storeToRefs(sidebarStore)

onMounted(async () => {
  if (typeof route.meta.page_id === 'number')
    selectedRoute.value = { block: 'forms', id: route.meta.page_id, access: false }
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
      <p v-if="allQueries.length > 0" class="mes-p">Количество записей: {{allQueries.length}}</p>
      <table v-if="allQueries.length > 0">
        <thead>
        <tr>
          <td>Название запроса</td>
          <td class="parent-input">Доступ</td>
          <td></td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(q, i) in allQueries" :key="i">
          <td>{{ q.name }}</td>
          <td class="parent-input">
            <input type="checkbox" v-model="q.access" class="input-checkbox">
          </td>
          <td class="list-button" @click="router.push(`${q.route}`)">Выполнить</td>
        </tr>
        </tbody>
      </table>
      <p v-else class="mes-p">Ничего не найдено</p>
    </div>
    <div class="actions">
      <button @click="">
        <img src="/icons/reload.svg" alt="reload" />
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

  &.list-button{
    background-color: rgba(gray, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;

    &:hover{
      cursor: pointer;
      background-color: rgba(gray, 0.2);
    }
  }

  &.parent-input{
    text-align: center;
    & > .input-checkbox {
      text-align: center;
      width: 20px;
      height: 20px;
    }
  }

}
.container-table{
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
        &.active-td:hover{
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
.filter-block{
  display: flex;
  align-items: start;
  flex-direction: column;
  gap: 10px;

  & > button {
    font-size: 16px;
    opacity: 0.7;

    &:hover{
      opacity: 9;
    }
  }
}
.mes-p{
  font-size: 16px;
  opacity: 0.9;
}
</style>
