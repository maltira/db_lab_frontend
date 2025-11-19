<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Owner } from '@/types/owner.ts'
import { useOwnerStore } from '@/stores/owner.store.ts'
import { storeToRefs } from 'pinia'
import Skeleton from '@/components/ui/Skeleton.vue'
import { formatDate } from '@/utils/date_format.ts'
interface Props {
  id?: string // Если id передан, то парсим владельца, иначе создаем нового
}
const props = defineProps<Props>()
const currentOwner = ref<Owner | null>(null)

const ownerStore = useOwnerStore()
const { fetchOne } = ownerStore
const { isLoading, error } = storeToRefs(ownerStore)

onMounted(async () => {
  console.log(props.id)
  if (props.id) {
    currentOwner.value = await fetchOne(props.id)
  }
})
</script>

<template>
  <div class="input-view">
    <div class="title">
      <img src="/img/gims.png" alt="logo" />
      <div class="text">
        <h1>ГИМС РФ</h1>
        <p>Вы находитесь на странице владельца</p>
      </div>
    </div>
    <Skeleton v-if="isLoading && !error" height="300px"/>
    <p v-else-if="error">Произошла ошибка: {{error}}</p>
    <div class="container" v-else>
      <div class="item">
        <p>Имя:</p>
        <p>{{currentOwner?.name}}</p>
      </div>
      <div class="item">
        <p>Фамилия:</p>
        <p>{{currentOwner?.surname}}</p>
      </div>
      <div class="item">
        <p>Отчество:</p>
        <p>{{currentOwner?.patronymic}}</p>
      </div>
      <div class="item">
        <p>Тип лица:</p>
        <p>{{currentOwner?.type_of_person}}</p>
      </div>
      <div class="item">
        <p>Дата рождения:</p>
        <p>{{currentOwner ? formatDate(currentOwner.birth_date) : ""}}</p>
      </div>
      <div class="item">
        <p>Телефон:</p>
        <p>{{currentOwner?.phone}}</p>
      </div>
      <div class="item">
        <p>Адрес:</p>
        <p>{{currentOwner?.address}}</p>
      </div>
    </div>
    <div class="actions">
      <button>
        <img src="/icons/add.svg" alt="add" />
        Новая запись
      </button>
      <button>К суднам</button>
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
.container{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;

  & > .item {
    display: flex;
    flex-direction: column;
    gap: 10px;

    & > p {
      font-size: 16px;

      &:last-child{
        padding: 15px 20px;
        width: 300px;
        background: rgba(gray, 0.1);
        border-radius: 4px;
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
