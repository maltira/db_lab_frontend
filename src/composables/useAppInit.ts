import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store.ts'
import type { AuthResponse } from '@/types/dto/request.dto.ts'
import router from '@/router'
import { useSidebarStore } from '@/stores/sidebar.store.ts'
import { useQueryStore } from '@/stores/query.store.ts'
import { storeToRefs } from 'pinia'

export function useAppInit() {
  const isAppReady = ref(false)
  const authStore = useAuthStore()
  const sidebarStore = useSidebarStore()
  const queryStore = useQueryStore()
  const { queries } = storeToRefs(queryStore)
  const { fetchQueries } = queryStore

  const initApp = async (): Promise<void> => {
    try {
      const auth: AuthResponse | null = await authStore.status()
      if (auth !== null && auth.token && auth.user) {
        authStore.user = auth.user
        authStore.isAuthenticated = true

        await fetchQueries()
        queries.value.forEach((el, i) => {
          sidebarStore.allQueries.push({id: i, name: el.name, route: el.route, access: el.access})
        })

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