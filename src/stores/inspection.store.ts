import { defineStore } from 'pinia'
import type { ErrorResponse } from '@/types/dto/error.dto.ts'
import { isErrorResponse } from '@/utils/response_type.ts'
import type { Inspection } from '@/types/inspection.ts'
import { inspectionService } from '@/api/inspection.api.ts'

export const useInspectionStore = defineStore('inspection', {
  state: () => ({
    inspections: [] as Inspection[],
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchInspections(): Promise<Inspection[] | null> {
      try {
        this.isLoading = true;
        this.error = null

        const response: Inspection[] | ErrorResponse = await inspectionService.fetchAll()
        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        this.inspections = response
        return response
      }
      catch {
        this.error = "Ошибка получения данных о технических освидетельствованиях"
        return null
      }
      finally {
        this.isLoading = false
      }
    }
  }
})
