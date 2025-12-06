<script setup lang="ts">

import { useAuthStore } from '@/stores/auth.store.ts'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import type { AuthRequest } from '@/types/dto/request.dto.ts'
import { useNotification } from '@/composables/useNotification.ts'
import router from '@/router'

const { err } = useNotification()

const authStore = useAuthStore()
const { isLoading, error } = storeToRefs(authStore)
const { login } = authStore

const email = ref("")
const password = ref("")

const loginAccount = async () => {
  const req: AuthRequest = {
    email: email.value,
    password: password.value,
  }

  await login(req)

  if (error.value) {
    err("Ошибка авторизации", error.value)
  } else {
    await router.push('/')
  }
}
</script>

<template>
  <div class="auth-container">
    <h1>Войдите в систему</h1>
    <div class="input-data">
      <input type="email" v-model="email" placeholder="Введите почту">
      <input type="password" v-model="password" placeholder="Введите пароль">
    </div>
    <button @click="loginAccount" class="btn-continue" :class="{disabled: isLoading}">
      {{ isLoading ? "Проверка..." : "Войти в аккаунт" }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.auth-container {
  width: 100%;
  height: calc(100vh - 60px);

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 60px;
}
.btn-continue, input{
  width: 400px;
  padding: 10px;

  opacity: 0.8;
  background: rgba(gray, 0.05);
  border: 1px solid rgba(gray, 0.2);
  border-radius: 8px;

  &:hover{
    border-color: rgba(#6378ff, 1);
    background-color: rgba(#6378ff, 0.05);
  }

  &.disabled{
    opacity: 0.2;
    pointer-events: none;
  }
}

.input-data{
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 400px;

  & > input {
    width: 100%;

    &:hover, &:focus{
      border-color: rgba(#6378ff, 1);
      background-color: rgba(#6378ff, 0.05);
    }
  }
}
</style>
