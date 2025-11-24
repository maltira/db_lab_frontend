<script setup lang="ts">

import { useNotification } from '@/composables/useNotification.ts'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useOwnerStore } from '@/stores/owner.store.ts'

const { err } = useNotification()

const ownerStore = useOwnerStore()
const { fetchOwners } = ownerStore
const { owners } = storeToRefs(ownerStore)

interface Props {
  isOpen: boolean
  ownerID: string // текущий тип
}
const props = defineProps<Props>()

const emit = defineEmits<{
  close: [],
  ownerUpdated: [id: string, surname: string]
}>()

const handleClose = () => {
  emit('close')
}

const handleType = (id: string, surname: string) => {
  if (id != props.ownerID) {
    emit('ownerUpdated', id, surname)
  } else {
    err("Ошибка выбора типа", "Судно уже имеет такого владельца")
  }
}

onMounted( async() => {
  await fetchOwners()
})
</script>

<template>
  <div class="modal-container" :class="{ active: isOpen }" @click="handleClose">
    <div class="modal-content" @click.stop>
      <div class="modal-close-button" @click="handleClose">
        <img src="/icons/close.svg" alt="close" width="28px" />
      </div>
      <h1>Выберите владельца</h1>
      <div class="modal-body">
        <button
          v-for="(o, i) in owners"
          :key="i"
          class="role-item"
          :class="{disabled: o.id === props.ownerID}"
          @click="handleType(o.id, o.surname)"
        >
          <span>{{o.surname}} {{o.name}} {{o.patronymic}}</span>
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
    background-color: rgba(black, 0.1);
    backdrop-filter: blur(4px);
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
  width: 500px;
  position: relative;
  padding: 40px;
  border-radius: 16px;

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
    &.disabled{
      opacity: 0.5;
      pointer-events: none;
    }
    &:hover{
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
  border-radius: 32px;
  background: $white;
  position: absolute;
  top: 0;
  right: calc(-36px - 12px);

  opacity: 0.6;
  &:hover {
    opacity: 0.8;
  }
  & > img {
    width: 28px;
    height: 28px;
  }
}
</style>
