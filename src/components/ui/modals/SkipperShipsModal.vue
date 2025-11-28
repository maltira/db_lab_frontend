<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted } from 'vue'
import { useShipStore } from '@/stores/ship.store.ts'

const shipStore = useShipStore()
const { fetchShips } = shipStore
const { ships } = storeToRefs(shipStore)

interface Props {
  isOpen: boolean
  skipperID: string
}
const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const handleClose = () => {
  emit('close')
}

const skipperShips = computed(() => {
  return ships.value.filter((ship) => ship.skipper_id === props.skipperID)
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
      <div class="modal-body">
        <span v-if="skipperShips.length > 0" v-for="(s, i) in skipperShips" :key="i"
          >{{ s.Type!.name }} - {{ s.ship_number }}</span
        >
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
  }
}
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 35px;
  background: $background;
  width: 600px;
  position: relative;
  padding: 40px;
  border-radius: 8px;
}
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 10px;

  & > span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 48px;
    padding: 0 15px;
    border-radius: 12px;
    background: rgba(gray, 0.1);
    font-size: 16px;
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
