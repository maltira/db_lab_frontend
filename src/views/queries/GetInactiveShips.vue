<script setup lang="ts">
import Skeleton from '@/components/ui/Skeleton.vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/ship.store.ts'
import { onMounted, ref } from 'vue'
import { formatDate } from '@/utils/date_format.ts'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { useRoute } from 'vue-router'
import type { Ship } from '@/types/ship.ts'
import router from '@/router'
const route = useRoute()
const sidebarStore = useSidebarStore()
const { selectedRoute } = storeToRefs(sidebarStore)

const shipStore = useShipStore()
const { fetchShips } = shipStore
const { ships, isLoading, error } = storeToRefs(shipStore)
const allShips = ref<Ship[]>([])

const reloadShips = async () => {
  await fetchShips()
  allShips.value = ships.value.filter(s => s.registration_status === 'Истёкший')
}
const goToOwner = async (id: string) => {
  await router.push(`/form/input/owner/${id}`)
}
const goToSkipper = async (id: string) => {
  await router.push(`/form/input/skipper/${id}`)
}
const goToShip = async (id: string) => {
  await router.push(`/form/input/ship/${id}`)
}
onMounted(async () => {
  await fetchShips()
  allShips.value = ships.value.filter(s => s.registration_status === 'Истёкший')
  if (typeof route.meta.page_id === 'number')
    selectedRoute.value = { block: 'queries', id: route.meta.page_id }
})
</script>

<template>
  <div class="input-view">
    <div class="title">
      <div class="text">
        <h1>Запрос «Истёкшая регистрация судов»</h1>
        <p>Вывод информации о суднах, статус регистрации которых истёк</p>
        <p>Найдено записей: {{allShips.length}}</p>
      </div>
    </div>
    <Skeleton v-if="isLoading && !error" height="300px" />
    <p v-if="error" class="mes-p">Произошла ошибка: {{ error }}</p>
    <div v-if="!isLoading && !error && allShips.length > 0" style="width: 100%">
      <table>
        <thead>
          <tr>
          <td>Тип</td>
          <td>Владелец</td>
          <td>Судоводитель</td>
          <td>Номер судна</td>
          <td>Дата регистрации</td>
          <td>Статус регистрации</td>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(ship, i) in allShips" :key="i" @click="goToShip(ship.id)">
            <td>{{ ship.Type!.name }}</td>
            <td class="active-td" @click.stop @click="goToOwner(ship.Owner!.id)">{{ ship.Owner!.surname }}</td>
            <td class="active-td" @click.stop @click="goToSkipper(ship.Skipper!.id)">{{ ship.Skipper!.surname }}</td>
            <td>{{ ship.ship_number }}</td>
            <td>{{ formatDate(ship.registration_date) }}</td>
            <td
              :style="{
                color: ship.registration_status
                  ? ship.registration_status === 'Истёкший'
                    ? 'red'
                    : 'rgb(112, 224, 0)'
                  : '',
              }"
            >
              {{ ship.registration_status }}
            </td>
          </tr>
        </tbody>
      </table>
      <p class="mes-p" > </p>
    </div>
    <p v-else-if="!isLoading && !error" class="mes-p">Ничего не найдено</p>

    <div class="actions">
      <button @click="reloadShips">
        <img src="/icons/reload.svg" alt="reload" />
        Обновить данные
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
    align-items: start;
    gap: 15px;

    & > img {
      width: 100px;
    }
    & > .text {
      & > h1,
      & > p {
        text-align: start;
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
        &.active-td:hover{
          background-color: rgba(gray, 0.08);
        }
      }
      &:last-child {
        & > td {
          border-bottom: none;
        }
      }
      &:hover {
        cursor: pointer;
        background-color: rgba(gray, 0.08);
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
.mes-p{
  font-size: 16px;
  opacity: 0.9;
}
</style>
