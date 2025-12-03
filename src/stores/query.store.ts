import { defineStore } from 'pinia'
import type { Query } from '@/types/query.ts'
import type { ErrorResponse, MessageResponse } from '@/types/dto/error.dto.ts'
import { isErrorResponse } from '@/utils/response_type.ts'
import { queryService } from '@/api/query.api.ts'

export const useQueryStore = defineStore('query', {
  state: () => ({
    queries: [] as Query[],
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchQueries(): Promise<Query[] | null> {
      try {
        this.isLoading = true;
        this.error = null

        const response: Query[] | ErrorResponse = await queryService.fetchAll()
        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        this.queries = response
        return response
      }
      catch {
        this.error = "Ошибка получения данных о запросах"
        return null
      }
      finally {
        this.isLoading = false
      }
    },

    async Update(req: Query): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await queryService.updateQuery(req)

        if (isErrorResponse(response)) {
          this.error = response.error
        }
      }
      catch (e) {
        this.error = `Неудачная попытка обновить запрос: ${e}`
      }
      finally {
        this.isLoading = false
      }
    },
  }
})