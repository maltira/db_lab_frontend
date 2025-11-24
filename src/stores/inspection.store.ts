import { defineStore } from 'pinia'
import type { ErrorResponse, MessageResponse } from '@/types/dto/error.dto.ts'
import { isErrorResponse } from '@/utils/response_type.ts'
import type { Inspection } from '@/types/inspection.ts'
import { inspectionService } from '@/api/inspection.api.ts'
import type { InspectionCreateRequest } from '@/types/dto/request.dto.ts'

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
    },

    async fetchOne(id: string): Promise<Inspection | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: Inspection | ErrorResponse = await inspectionService.fetchOne(id)

        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        return response
      }
      catch {
        this.error = "Не удалось получить информацию об осмотре"
        return null
      }
      finally {
        this.isLoading = false
      }
    },

    async Update(req: Inspection): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await inspectionService.update(req)

        if (isErrorResponse(response)) {
          this.error = response.error
        }
      }
      catch (e) {
        this.error = `Неудачная попытка обновить осмотр: ${e}`
      }
      finally {
        this.isLoading = false
      }
    },
    async Create(req: InspectionCreateRequest): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await inspectionService.create(req)

        if (isErrorResponse(response)) {
          this.error = response.error
        }
      }
      catch (e) {
        this.error = `Неудачная попытка добавить осмотр: ${e}`
      }
      finally {
        this.isLoading = false
      }
    },
    async Delete(id: string): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await inspectionService.delete(id)
        if (isErrorResponse(response)) {
          this.error = response.error
        }
      }
      catch (e) {
        this.error = `Неудачная попытка удалить осмотр: ${e}`
      }
      finally {
        this.isLoading = false
      }
    }
  }
})
