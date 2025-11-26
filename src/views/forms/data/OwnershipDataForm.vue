<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { formatDate } from '@/utils/date_format.ts'
import router from '@/router'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { useRoute } from 'vue-router'
import SearchFilterModal from '@/components/ui/modals/SearchFilterModal.vue'
import { useOwnershipStore } from '@/stores/ownership.store.ts'

const route = useRoute()
const sidebarStore = useSidebarStore()
const { selectedRoute } = storeToRefs(sidebarStore)

const ownershipStore = useOwnershipStore()
const { fetchOwnerships } = ownershipStore
const { ownerships, isLoading, error } = storeToRefs(ownershipStore)

const filter = ref("")
const isSearchModalOpen = ref(false)
const toggleSearchModal = () => {
  isSearchModalOpen.value = !isSearchModalOpen.value
}
const handleFilter = (res: string) => {
  filter.value = res
  isSearchModalOpen.value = false
}

const allOwnerships = computed(() => {
  if (filter.value) {
    return ownerships.value.filter(item =>
      item.ShipOldOwner!.surname.toLowerCase().includes(filter.value.toLowerCase()) ||
      item.ShipNewOwner!.surname.toLowerCase().includes(filter.value.toLowerCase()) ||
      item.Ship?.ship_number.toLowerCase().includes(filter.value.toLowerCase()) ||
      formatDate(item.transfer_date).includes(filter.value),
    )
  }
  else return ownerships.value
})

const reloadOwnerships = async () => {
  await fetchOwnerships()
}

const goToOwnership = async (id: string) => {
  await router.push(`/form/input/ownership/${id}`)
}

onMounted(async () => {
  await fetchOwnerships()
  if (typeof route.meta.page_id === 'number')
    selectedRoute.value = { block: 'forms', id: route.meta.page_id }
})
</script>

<template>
  <div class="data-view">
    <div class="title">
      <img src="/img/gims.png" alt="logo" />
      <div class="text">
        <h1>ГИМС РФ</h1>
        <p>Вы находитесь на странице с историей передачи судов</p>
      </div>
    </div>
    <div class="filter-block" v-if="filter">
      <button @click="filter = ''">← Вернуться</button>
      <p class="mes-p">Результаты по запросу «{{filter}}»:</p>
    </div>
    <Skeleton height="300px" v-if="isLoading && !error" />

    <p v-else-if="error" class="mes-p">Произошла ошибка: {{ error }}</p>

    <table v-else-if="allOwnerships.length > 0">
      <thead>
      <tr>
        <td>Старый владелец</td>
        <td>Новый владелец</td>
        <td>Номер судна</td>
        <td>Дата передачи</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(ownership, i) in allOwnerships" :key="i" @click="goToOwnership(ownership.id)">
        <td>{{ ownership.ShipOldOwner?.surname }}</td>
        <td>{{ ownership.ShipNewOwner?.surname }}</td>
        <td>{{ ownership.Ship?.ship_number }}</td>
        <td>{{ formatDate(ownership.transfer_date) }}</td>
      </tr>
      </tbody>
    </table>

    <p v-else class="mes-p">Ничего не найдено</p>

    <div class="actions">
      <button @click="router.push('/form/input/ownership')">
        <img src="/icons/add.svg" alt="add" />
        Новая запись
      </button>
      <button v-if="ownerships.length > 0" @click="toggleSearchModal">
        <img src="/icons/search.svg" alt="search" />
        Найти запись
      </button>
      <button @click="reloadOwnerships">
        <img src="/icons/reload.svg" alt="reload" />
        Обновить данные
      </button>
    </div>
  </div>

  <SearchFilterModal :is-open="isSearchModalOpen" @close="isSearchModalOpen = false" @filter-updated="handleFilter"/>
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
