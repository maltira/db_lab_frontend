import { defineStore } from 'pinia'
import type { ErrorResponse } from '@/types/dto/error.dto.ts'
import { isErrorResponse } from '@/utils/response_type.ts'
import type { Ownership } from '@/types/ownership.ts'
import { ownershipService } from '@/api/ownership.api.ts'

export const useOwnershipStore = defineStore('ownership', {
  state: () => ({
    ownerships: [] as Ownership[],
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
      async fetchOwnerships(): Promise<Ownership[] | null> {
      try {
        this.isLoading = true;
        this.error = null

        const response: Ownership[] | ErrorResponse = await ownershipService.fetchAll()
        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        this.ownerships = response
        return response
      }
      catch {
        this.error = "Ошибка получения данных об истории владения"
        return null
      }
      finally {
        this.isLoading = false
      }
    }
  }
})