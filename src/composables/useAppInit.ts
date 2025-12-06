import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store.ts'
import type { AuthResponse } from '@/types/dto/request.dto.ts'
import router from '@/router'

export function useAppInit() {
  const isAppReady = ref(false)
  const authStore = useAuthStore()

  const initApp = async (): Promise<void> => {
    try {
      const auth: AuthResponse | null = await authStore.status()
      if (auth !== null && auth.token && auth.user) {
        authStore.user = auth.user
        authStore.isAuthenticated = true
        await router.push('/')
      } else {
        await router.push('/auth')
      }
    }
    catch (error) {
      console.error("App initialization failed:", error)
    }
    finally {
      isAppReady.value = true
    }
  }
  return {
    isAppReady,
    initApp,
  }
}