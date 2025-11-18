import { defineStore } from 'pinia'
import type { ErrorResponse } from '@/types/dto/error.dto.ts'
import { isErrorResponse } from '@/utils/response_type.ts'
import type { Violation } from '@/types/violation.ts'
import { violationService } from '@/api/violation.api.ts'

export const useViolationStore = defineStore('violation', {
  state: () => ({
    violations: [] as Violation[],
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchViolations(): Promise<Violation[] | null> {
      try {
        this.isLoading = true;
        this.error = null

        const response: Violation[] | ErrorResponse = await violationService.fetchAll()
        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        this.violations = response
        return response
      }
      catch {
        this.error = "Ошибка получения данных о нарушениях"
        return null
      }
      finally {
        this.isLoading = false
      }
    }
  }
})