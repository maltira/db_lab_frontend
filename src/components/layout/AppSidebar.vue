<script setup lang="ts">
import { ref } from 'vue'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { storeToRefs } from 'pinia'

const sidebarStore = useSidebarStore()
const { allTables, allForms, allQueries, allReports, selectedRoute } = storeToRefs(sidebarStore)

const isTablesOpen = ref(false)
const isQueriesOpen = ref(false)
const isFormsOpen = ref(false)
const isReportsOpen = ref(false)

const toggleTables = () => {
  isTablesOpen.value = !isTablesOpen.value
}
const toggleQueries = () => {
  isQueriesOpen.value = !isQueriesOpen.value
}
const toggleForms = () => {
  isFormsOpen.value = !isFormsOpen.value
}
const toggleReports = () => {
  isReportsOpen.value = !isReportsOpen.value
}
const selectElement = (block: 'tables' | 'queries' | 'forms' | 'reports', id: number) => {
  selectedRoute.value = { block: block, id: id }
}
</script>

<template>
  <div id="sidebar">
    <div class="sidebar_block">
      <div class="title" @click="toggleTables">
        <h1>Таблицы</h1>
        <img
          src="/icons/arrow.png"
          alt="arrow"
          :style="{ transform: isTablesOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }"
        />
      </div>
      <div class="block_items" v-if="isTablesOpen && allTables.length > 0">
        <RouterLink :to="table.route" class="item" v-for="table in allTables" :key="table.id" @click="selectElement('tables', table.id)" :class="{active: selectedRoute.block === 'tables' && selectedRoute.id === table.id}">
          <p>{{ table.name }}</p>
        </RouterLink>
      </div>
      <p v-else-if="isTablesOpen && allTables.length === 0" class="empty_block">Здесь пусто</p>
    </div>
    <div class="sidebar_block">
      <div class="title" @click="toggleQueries">
        <h1>Запросы</h1>
        <img
          src="/icons/arrow.png"
          alt="arrow"
          :style="{ transform: isQueriesOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }"
        />
      </div>
      <div class="block_items" v-if="isQueriesOpen && allQueries.length > 0">
        <RouterLink :to="query.route" class="item" v-for="query in allQueries" :key="query.id" @click="selectElement('queries', query.id)" :class="{active: selectedRoute.block === 'queries' && selectedRoute.id === query.id}">
          <p>{{ query.name }}</p>
        </RouterLink>
      </div>
      <p v-else-if="isQueriesOpen && allQueries.length === 0" class="empty_block">Здесь пусто</p>
    </div>
    <div class="sidebar_block">
      <div class="title" @click="toggleForms">
        <h1>Формы</h1>
        <img
          src="/icons/arrow.png"
          alt="arrow"
          :style="{ transform: isFormsOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }"
        />
      </div>
      <div class="block_items" v-if="isFormsOpen && allForms.length > 0">
        <RouterLink :to="form.route" class="item" v-for="form in allForms" :key="form.id" @click="selectElement('forms', form.id)" :class="{active: selectedRoute.block === 'forms' && selectedRoute.id === form.id}">
          <p>{{ form.name }}</p>
        </RouterLink>
      </div>
      <p v-else-if="isFormsOpen && allForms.length === 0" class="empty_block">Здесь пусто</p>
    </div>
    <div class="sidebar_block">
      <div class="title" @click="toggleReports">
        <h1>Отчёты</h1>
        <img
          src="/icons/arrow.png"
          alt="arrow"
          :style="{ transform: isReportsOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }"
        />
      </div>
      <div class="block_items" v-if="isReportsOpen && allReports.length > 0">
        <RouterLink :to="r.route" class="item" v-for="r in allReports" :key="r.id" @click="selectElement('reports', r.id)" :class="{active: selectedRoute.block === 'reports' && selectedRoute.id === r.id}">
          <p>{{ r.name }}</p>
        </RouterLink>
      </div>
      <p v-else-if="isReportsOpen && allReports.length === 0" class="empty_block">Здесь пусто</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
#sidebar {
  display: flex;
  flex-direction: column;
  gap: 25px;

  min-width: 300px;
  height: 100vh;

  padding: 30px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);

  overflow-y: scroll;
  scrollbar-width: none;
}
.sidebar_block {
  display: flex;
  flex-direction: column;
  gap: 15px;
  cursor: pointer;

  & > .title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > h1 {
      font-size: 28px;
      font-weight: 400;
    }
    & > img {
      width: 16px;
      height: 20px;
      opacity: 0.5;
    }
  }
  & > .block_items {
    display: flex;
    flex-direction: column;
    gap: 4px;

    & > .item {
      padding: 12px 20px;
      border-left: 4px solid transparent;
      cursor: pointer;
      opacity: 0.7;

      &.active{
        border-left: 4px solid #ccff6c;
        opacity: 0.99;
        pointer-events: none !important;
        cursor: default !important;

        transform: translateX(5px);
      }

      &:hover {
        opacity: 0.99;
        background: rgba(gray, 0.05);
      }

      & > p {
        font-size: 16px;
      }
    }
  }

  &:hover {
    & > .title > img {
      opacity: 1;
    }
  }
}
.empty_block {
  font-size: 16px;
  opacity: 0.7;
  cursor: default;
}
</style>
