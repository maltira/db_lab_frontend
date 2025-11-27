<script setup lang="ts">
import { useNotification } from '@/composables/useNotification.ts'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted } from 'vue'
import { useShipStore } from '@/stores/ship.store.ts'

const { err } = useNotification()

const shipStore = useShipStore()
const { fetchShips } = shipStore
const { ships } = storeToRefs(shipStore)

interface Props {
  isOpen: boolean
  shipID: string // текущий тип
  ownerIDFilter?: string
}
const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  shipUpdated: [id: string, number: string]
}>()

const handleClose = () => {
  emit('close')
}

const handleType = (id: string, number: string) => {
  if (id != props.shipID) {
    emit('shipUpdated', id, number)
  } else {
    err('Ошибка выбора судна', 'Это судно уже выбрано')
  }
}

const allShips = computed(() => {
  if (props.ownerIDFilter) {
    return ships.value.filter((ship) => ship.owner_id === props.ownerIDFilter)
  } else {
    return ships.value
  }
})

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}
onMounted(async () => {
  document.addEventListener('keydown', handleEscape)
  await fetchShips()
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <div class="modal-container" :class="{ active: isOpen }" @click="handleClose">
    <div class="modal-content" @click.stop>
      <div class="modal-close-button" @click="handleClose">
        <img src="/icons/close.svg" alt="close" width="28px" />
      </div>
      <h1>Выберите судно</h1>
      <div class="modal-body">
        <button
          v-for="(s, i) in allShips"
          :key="i"
          class="role-item"
          :class="{ disabled: s.id === props.shipID }"
          @click="handleType(s.id, s.ship_number)"
          v-if="allShips.length > 0"
        >
          <span>{{ s.Type!.name }} - {{ s.ship_number }} - {{ s.Owner!.surname }}</span>
        </button>
        <p v-else style="text-align: center">Ничего не найдено</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  visibility: hidden;
  pointer-events: none;
  opacity: 0;
  z-index: 1003;

  display: flex;
  align-items: center;
  justify-content: center;

  &.active {
    background-color: rgba(black, 0.2);
    visibility: visible;
    opacity: 1;
    pointer-events: auto;

    &.dark-theme {
      background: rgba(white, 0.1);
    }
  }
}
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 35px;
  background: $background;
  width: 800px;
  position: relative;
  padding: 40px;
  border-radius: 8px;

  & > h1 {
    font-size: 24px;
    text-align: center;
  }
}
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 10px;

  & > .role-item {
    width: 100%;
    height: 48px;
    padding: 0 15px;
    border-radius: 12px;
    background: rgba(gray, 0.1);
    & > span {
      font-weight: 400;
      opacity: 0.7;
    }
    &.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
    &:hover {
      background: rgba(gray, 0.15);

      & > span {
        opacity: 0.8;
      }
    }
  }
}
.modal-close-button {
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  background: $white;
  position: absolute;
  top: 0;
  right: calc(-36px - 12px);

  opacity: 0.8;
  &:hover {
    opacity: 0.9;
  }
  & > img {
    width: 28px;
    height: 28px;
  }
}
</style>
