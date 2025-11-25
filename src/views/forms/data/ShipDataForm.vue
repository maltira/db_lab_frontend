<script setup lang="ts">
import Skeleton from '@/components/ui/Skeleton.vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/ship.store.ts'
import router from '@/router'
import { onMounted, ref } from 'vue'
import { formatDate } from '@/utils/date_format.ts'
import type { Ship } from '@/types/ship.ts'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { useRoute } from 'vue-router'
const route = useRoute()
const sidebarStore = useSidebarStore()
const { selectedRoute } = storeToRefs(sidebarStore)

const currentOwner = ref<string>("")

interface Props {
  id?: string // Если id передан, то парсим судна владельца, иначе все
}
const props = defineProps<Props>()

const shipStore = useShipStore()
const { fetchShips } = shipStore
const { ships, isLoading, error } = storeToRefs(shipStore)
const filteredShips = ref<Ship[]>([])

const reloadShips = async () => {
  await fetchShips()
  if (props.id) {
    filteredShips.value = ships.value.filter((ship) => ship.Owner!.id === props.id)
  } else {
    filteredShips.value = ships.value
  }
}

const goToShip = async (id: string) => {
  await router.push(`/form/input/ship/${id}`)
}

onMounted(async () => {
  await fetchShips()
  if (typeof route.meta.page_id === 'number')
    selectedRoute.value = { block: "forms", id: route.meta.page_id}

  if (props.id) {
    filteredShips.value = ships.value.filter((ship) => ship.Owner!.id === props.id)
    if (filteredShips.value[0]) currentOwner.value = filteredShips.value[0].Owner!.surname
  } else {
    filteredShips.value = ships.value
  }
})
</script>

<template>
  <div class="input-view">
    <div class="title">
      <img src="/img/gims.png" alt="logo" />
      <div class="text">
        <h1>ГИМС РФ</h1>
        <p>Вы находитесь на странице суден {{currentOwner ? "владельца «" + currentOwner + "»" : ""}}</p>
      </div>
    </div>
    <Skeleton v-if="isLoading && !error" height="300px" />
    <p v-else-if="error">Произошла ошибка: {{ error }}</p>
    <table v-else-if="filteredShips.length > 0">
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
        <tr v-for="(ship, i) in filteredShips" :key="i" @click="goToShip(ship.id)">
          <td>{{ ship.Type!.name }}</td>
          <td>{{ ship.Owner!.surname }}</td>
          <td>{{ ship.Skipper!.surname }}</td>
          <td>{{ ship.ship_number }}</td>
          <td>{{ formatDate(ship.registration_date) }}</td>
          <td :style="{color: ship.registration_status ? (ship.registration_status === 'Истёкший' ? 'red' : 'rgb(112, 224, 0)') : ''}">{{ ship.registration_status }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>У владельца нет суден</p>
    <div class="actions">
      <button @click="router.push('/form/input/ship')">
        <img src="/icons/add.svg" alt="add" />
        Новая запись
      </button>
      <button v-if="filteredShips.length > 0">
        <img src="/icons/search.svg" alt="search" />
        Найти запись
      </button>
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
</style>
