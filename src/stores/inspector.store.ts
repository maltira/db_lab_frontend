import { defineStore } from 'pinia'
import type { ErrorResponse } from '@/types/dto/error.dto.ts'
import { isErrorResponse } from '@/utils/response_type.ts'
import type { Inspector } from '@/types/inspector.ts'
import { inspectorService } from '@/api/inspector.api.ts'

export const useInspectorStore = defineStore('inspector', {
  state: () => ({
    inspectors: [] as Inspector[],
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchInspectors(): Promise<Inspector[] | null> {
      try {
        this.isLoading = true;
        this.error = null

        const response: Inspector[] | ErrorResponse = await inspectorService.fetchAll()
        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        this.inspectors = response
        return response
      }
      catch {
        this.error = "Ошибка получения данных об инспекторах"
        return null
      }
      finally {
        this.isLoading = false
      }
    }
  }
})