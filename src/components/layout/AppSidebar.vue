<script setup lang="ts">
import { ref } from 'vue'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { storeToRefs } from 'pinia'

const sidebarStore = useSidebarStore()
const { allTables, allForms, allQueries, selectedRoute } = storeToRefs(sidebarStore)

const isTablesOpen = ref(false)
const isQueriesOpen = ref(false)
const isFormsOpen = ref(true)

const toggleTables = () => {
  isTablesOpen.value = !isTablesOpen.value
}
const toggleQueries = () => {
  isQueriesOpen.value = !isQueriesOpen.value
}
const toggleForms = () => {
  isFormsOpen.value = !isFormsOpen.value
}

const selectElement = (block: 'tables' | 'queries' | 'forms', id: number) => {
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
        <div class="item" v-for="query in allQueries" :key="query.id" @click="selectElement('queries', query.id)" :class="{active: selectedRoute.block === 'queries' && selectedRoute.id === query.id}">
          <p>{{ query }}</p>
        </div>
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
      background: transparent;
      cursor: pointer;
      opacity: 0.7;
      border-radius: 34px;

      &.active{
        background: #ccff6c !important;
        opacity: 0.99;
        pointer-events: none !important;
        cursor: default !important;
      }

      &:hover {
        opacity: 0.99;
        background: rgba(#ccff6c, 0.25);
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
