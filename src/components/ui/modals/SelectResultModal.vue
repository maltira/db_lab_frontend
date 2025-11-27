<script setup lang="ts">
import { useNotification } from '@/composables/useNotification.ts'
import { onMounted, onUnmounted } from 'vue'

const { err } = useNotification()

const results: (
  | 'Годно к эксплутации'
  | 'Годно с замечаниями'
  | 'Ограниченно годно'
  | 'Не годно к эксплутации'
)[] = ['Годно к эксплутации', 'Годно с замечаниями', 'Ограниченно годно', 'Не годно к эксплутации']

interface Props {
  isOpen: boolean
  result:
    | 'Годно к эксплутации'
    | 'Годно с замечаниями'
    | 'Ограниченно годно'
    | 'Не годно к эксплутации'
    | null // текущий result
}
const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  resultUpdated: [
    res:
      | 'Годно к эксплутации'
      | 'Годно с замечаниями'
      | 'Ограниченно годно'
      | 'Не годно к эксплутации',
  ]
}>()

const handleClose = () => {
  emit('close')
}

const handleResult = (
  res:
    | 'Годно к эксплутации'
    | 'Годно с замечаниями'
    | 'Ограниченно годно'
    | 'Не годно к эксплутации',
) => {
  if (res != props.result) {
    emit('resultUpdated', res)
  } else {
    err('Ошибка выбора результата', 'Этот результат уже выбран')
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}
onMounted(() => {
  document.addEventListener('keydown', handleEscape)
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
      <h1>Выберите результат осмотра</h1>
      <div class="modal-body">
        <button
          v-for="(s, i) in results"
          :key="i"
          class="role-item"
          :class="{ disabled: s === props.result }"
          @click="handleResult(s)"
        >
          <span>{{ s }}</span>
        </button>
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
    pointer-events: auto;
    opacity: 1;
  }
}
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 35px;
  background: $background;
  width: 500px;
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
