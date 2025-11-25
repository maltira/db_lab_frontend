import { defineStore } from 'pinia'
import type { ErrorResponse, MessageResponse } from '@/types/dto/error.dto.ts'
import { isErrorResponse } from '@/utils/response_type.ts'
import type { Violation } from '@/types/violation.ts'
import { violationService } from '@/api/violation.api.ts'
import type { ViolationCreateRequest } from '@/types/dto/request.dto.ts'

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
    },
    async fetchOne(id: string): Promise<Violation | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: Violation | ErrorResponse = await violationService.fetchOne(id)

        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        return response
      }
      catch {
        this.error = "Не удалось получить информацию о нарушении"
        return null
      }
      finally {
        this.isLoading = false
      }
    },

    async Update(req: Violation): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await violationService.updateViolation(req)

        if (isErrorResponse(response)) {
          this.error = response.error
        }
      }
      catch (e) {
        this.error = `Неудачная попытка обновить нарушение: ${e}`
      }
      finally {
        this.isLoading = false
      }
    },
    async Create(req: ViolationCreateRequest): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await violationService.createViolation(req)

        if (isErrorResponse(response)) {
          this.error = response.error
        }
      }
      catch (e) {
        this.error = `Неудачная попытка добавить нарушение: ${e}`
      }
      finally {
        this.isLoading = false
      }
    },
    async Delete(id: string): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await violationService.deleteViolation(id)
        if (isErrorResponse(response)) {
          this.error = response.error
        }
      }
      catch (e) {
        this.error = `Неудачная попытка удалить нарушение: ${e}`
      }
      finally {
        this.isLoading = false
      }
    }
  }
})