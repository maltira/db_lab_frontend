<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import router from '@/router'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { useRoute } from 'vue-router'
import SearchFilterModal from '@/components/ui/modals/SearchFilterModal.vue'
import { useSkipperStore } from '@/stores/skipper.store.ts'
import SkipperShipsModal from '@/components/ui/modals/SkipperShipsModal.vue'

const route = useRoute()
const sidebarStore = useSidebarStore()
const { selectedRoute } = storeToRefs(sidebarStore)

const skipperStore = useSkipperStore()
const { fetchSkippers } = skipperStore
const { skippers, isLoading, error } = storeToRefs(skipperStore)

const isShipsModalOpen = ref(false)
const currentSkipperID = ref("")
const toggleShipsModal = (id: string) => {
  isShipsModalOpen.value = !isShipsModalOpen.value
  currentSkipperID.value = id
}

const filter = ref("")
const isSearchModalOpen = ref(false)
const toggleSearchModal = () => {
  isSearchModalOpen.value = !isSearchModalOpen.value
}
const handleFilter = (res: string) => {
  filter.value = res
  isSearchModalOpen.value = false
}

const allSkippers = computed(() => {
  if (filter.value) {
    return skippers.value.filter(item =>
      item.name.toLowerCase().includes(filter.value.toLowerCase()) ||
      item.surname.toLowerCase().includes(filter.value.toLowerCase()) ||
      item.patronymic!.toLowerCase().includes(filter.value.toLowerCase()) ||
      item.id_number.toLowerCase().includes(filter.value.toLowerCase()),
    )
  }
  else return skippers.value
})

const reloadSkippers = async () => {
  await fetchSkippers()
}

const goToSkipper = async (id: string) => {
  await router.push(`/form/input/skipper/${id}`)
}

onMounted(async () => {
  await fetchSkippers()
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

    <table v-else-if="allSkippers.length > 0">
      <thead>
      <tr>
        <td>Имя</td>
        <td>Фамилия</td>
        <td>Отчество</td>
        <td>Номер удостоверения</td>
        <td></td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(sk, i) in allSkippers" :key="i" @click="goToSkipper(sk.id)">
        <td>{{ sk.name }}</td>
        <td>{{ sk.surname }}</td>
        <td>{{ sk.patronymic! }}</td>
        <td>{{ sk.id_number }}</td>
        <td class="list-button" @click.stop @click="toggleShipsModal(sk.id)">Список судов →</td>
      </tr>
      </tbody>
    </table>

    <p v-else class="mes-p">Ничего не найдено</p>

    <div class="actions">
      <button @click="router.push('/form/input/skipper')">
        <img src="/icons/add.svg" alt="add" />
        Новая запись
      </button>
      <button v-if="skippers.length > 0" @click="toggleSearchModal">
        <img src="/icons/search.svg" alt="search" />
        Найти запись
      </button>
      <button @click="reloadSkippers">
        <img src="/icons/reload.svg" alt="reload" />
        Обновить данные
      </button>
    </div>
  </div>

  <SearchFilterModal :is-open="isSearchModalOpen" @close="isSearchModalOpen = false" @filter-updated="handleFilter"/>
  <SkipperShipsModal :is-open="isShipsModalOpen" :skipper-i-d="currentSkipperID" @close="isShipsModalOpen = false"/>
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
  }
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
