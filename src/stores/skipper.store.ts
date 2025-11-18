import { defineStore } from 'pinia'
import type { Skipper } from '@/types/skipper.ts'
import { skipperService } from '@/api/skipper.api.ts'
import type { ErrorResponse } from '@/types/dto/error.dto.ts'
import { isErrorResponse } from '@/utils/response_type.ts'

export const useSkipperStore = defineStore('skipper', {
  state: () => ({
    skippers: [] as Skipper[],
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchSkippers(): Promise<Skipper[] | null> {
      try {
        this.isLoading = true;
        this.error = null

        const response: Skipper[] | ErrorResponse = await skipperService.fetchAll()
        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        this.skippers = response
        return response
      }
      catch {
        this.error = "Ошибка получения данных о судоводителях"
        return null
      }
      finally {
        this.isLoading = false
      }
    }
  }
})