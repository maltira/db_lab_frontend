import { defineStore } from 'pinia'
import type { ErrorResponse, MessageResponse } from '@/types/dto/error.dto.ts'
import { isErrorResponse } from '@/utils/response_type.ts'
import type { Inspector } from '@/types/inspector.ts'
import { inspectorService } from '@/api/inspector.api.ts'
import type { InspectorCreateRequest } from '@/types/dto/request.dto.ts'

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
    },
    async fetchOne(id: string): Promise<Inspector | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: Inspector | ErrorResponse = await inspectorService.fetchOne(id)

        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        return response
      }
      catch {
        this.error = "Не удалось получить информацию об инспекторе"
        return null
      }
      finally {
        this.isLoading = false
      }
    },

    async Update(req: Inspector): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await inspectorService.updateInspector(req)

        if (isErrorResponse(response)) {
          this.error = response.error
        }
      }
      catch (e) {
        this.error = `Неудачная попытка обновить инспектора: ${e}`
      }
      finally {
        this.isLoading = false
      }
    },
    async Create(req: InspectorCreateRequest): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await inspectorService.createInspector(req)

        if (isErrorResponse(response)) {
          this.error = response.error
        }
      }
      catch (e) {
        this.error = `Неудачная попытка добавить инспектора: ${e}`
      }
      finally {
        this.isLoading = false
      }
    },
    async Delete(id: string): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await inspectorService.deleteInspector(id)
        if (isErrorResponse(response)) {
          this.error = response.error
        }
      }
      catch (e) {
        this.error = `Неудачная попытка удалить инспектора: ${e}`
      }
      finally {
        this.isLoading = false
      }
    }
  }
})