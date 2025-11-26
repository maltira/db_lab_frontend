<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { formatDate } from '@/utils/date_format.ts'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { useInspectionStore } from '@/stores/inspection.store.ts'
import type { Inspection } from '@/types/inspection.ts'
import { useRoute } from 'vue-router'
import router from '@/router'
import SearchFilterModal from '@/components/ui/modals/SearchFilterModal.vue'

const route = useRoute()

// Может прийти ID инспектора, либо ID судна, либо ничего
interface Props {
  inspector_id?: string
  ship_id?: string
}
const props = defineProps<Props>()

const sidebarStore = useSidebarStore()
const { selectedRoute } = storeToRefs(sidebarStore)

const inspectionStore = useInspectionStore()
const { fetchInspections } = inspectionStore
const { inspections, isLoading, error } = storeToRefs(inspectionStore)
const filteredInspections = ref<Inspection[]>([])

const filter = ref('')
const isSearchModalOpen = ref(false)
const toggleSearchModal = () => {
  isSearchModalOpen.value = !isSearchModalOpen.value
}
const handleFilter = (res: string) => {
  filter.value = res
  isSearchModalOpen.value = false
}

const allInspections = computed(() => {
  if (filter.value) {
    return filteredInspections.value.filter(
      (item) =>
        item.Ship?.ship_number.toLowerCase().includes(filter.value.toLowerCase()) ||
        item.Inspector?.surname.toLowerCase().includes(filter.value.toLowerCase()) ||
        item.result.toLowerCase().includes(filter.value.toLowerCase()) ||
        formatDate(item.inspection_date).includes(filter.value) ||
        formatDate(item.next_inspection_date).includes(filter.value)
    )
  } else return filteredInspections.value
})

const currentInspector = ref<string>('')
const currentShip = ref<string>('')

const reloadInspections = async () => {
  await fetchInspections()
}

const goToInspection = async (id: string) => {
  await router.push(`/form/input/inspection/${id}`)
}

onMounted(async () => {
  await fetchInspections()

  if (typeof route.meta.page_id === 'number')
    selectedRoute.value = { block: 'forms', id: route.meta.page_id }
  if (props.inspector_id) {
    filteredInspections.value = inspections.value.filter(
      (ins) => ins.Inspector!.id === props.inspector_id,
    )
    if (filteredInspections.value[0])
      currentInspector.value = filteredInspections.value[0].Inspector!.surname
  } else if (props.ship_id) {
    filteredInspections.value = inspections.value.filter((ship) => ship.Ship!.id === props.ship_id)
    if (filteredInspections.value[0])
      currentShip.value = filteredInspections.value[0].Ship!.ship_number
  } else {
    filteredInspections.value = inspections.value
  }
})
</script>

<template>
  <div class="data-view">
    <div class="title">
      <img src="/img/gims.png" alt="logo" />
      <div class="text">
        <h1>ГИМС РФ</h1>
        <p>
          Вы находитесь на странице с тех. осмотрами{{
            currentInspector
              ? `, проведенными инспектором «${currentInspector}»`
              : currentShip
                ? ` судна ${currentShip}»`
                : ''
          }}
        </p>
      </div>
    </div>
    <div class="filter-block" v-if="filter">
      <button @click="filter = ''">← Вернуться</button>
      <p class="mes-p">Результаты по запросу «{{filter}}»:</p>
    </div>
    <Skeleton height="300px" v-if="isLoading && !error" />
    <p v-else-if="error" class="mes-p">Произошла ошибка: {{ error }}</p>
    <table v-else-if="allInspections.length > 0">
      <thead>
        <tr>
          <td>Инспектор</td>
          <td>Номер судна</td>
          <td>Дата осмотра</td>
          <td>Результат осмотра</td>
          <td>Следующая дата</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(ins, i) in allInspections" :key="i" @click="goToInspection(ins.id)">
          <td>{{ ins.Inspector!.surname }}</td>
          <td>{{ ins.Ship!.ship_number }}</td>
          <td>{{ formatDate(ins.inspection_date) }}</td>
          <td
            :style="{
              color: ins.result
                ? ins.result === 'Не годно к эксплутации'
                  ? 'red'
                  : ins.result === 'Годно к эксплутации'
                    ? 'rgb(112, 224, 0)'
                    : '#FFD032'
                : '',
            }"
          >
            {{ ins.result }}
          </td>
          <td>{{ formatDate(ins.next_inspection_date) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else class="mes-p">Не найдено проведенных осмотров</p>
    <div class="actions">
      <button @click="router.push('/form/input/inspection')">
        <img src="/icons/add.svg" alt="add" />
        Новая запись
      </button>
      <button v-if="filteredInspections.length > 0" @click="toggleSearchModal">
        <img src="/icons/search.svg" alt="search" />
        Найти запись
      </button>
      <button @click="reloadInspections">
        <img src="/icons/reload.svg" alt="reload" />
        Обновить данные
      </button>
    </div>
  </div>

  <SearchFilterModal
    :is-open="isSearchModalOpen"
    @close="isSearchModalOpen = false"
    @filter-updated="handleFilter"
  />
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
