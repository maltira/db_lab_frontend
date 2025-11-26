import { defineStore } from 'pinia'
import type { Skipper } from '@/types/skipper.ts'
import { skipperService } from '@/api/skipper.api.ts'
import type { ErrorResponse, MessageResponse } from '@/types/dto/error.dto.ts'
import { isErrorResponse } from '@/utils/response_type.ts'
import type { SkipperCreateRequest } from '@/types/dto/request.dto.ts'

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
    },
    async fetchOne(id: string): Promise<Skipper | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: Skipper | ErrorResponse = await skipperService.fetchOne(id)

        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        return response
      }
      catch {
        this.error = "Не удалось получить информацию о судоводителе"
        return null
      }
      finally {
        this.isLoading = false
      }
    },

    async Update(req: Skipper): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await skipperService.updateSkipper(req)

        if (isErrorResponse(response)) {
          this.error = response.error
        }
      }
      catch (e) {
        this.error = `Неудачная попытка обновить судоводителя: ${e}`
      }
      finally {
        this.isLoading = false
      }
    },
    async Create(req: SkipperCreateRequest): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await skipperService.createSkipper(req)

        if (isErrorResponse(response)) {
          this.error = response.error
        }
      }
      catch (e) {
        this.error = `Неудачная попытка добавить судоводителя: ${e}`
      }
      finally {
        this.isLoading = false
      }
    },
    async Delete(id: string): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await skipperService.deleteSkipper(id)
        if (isErrorResponse(response)) {
          this.error = response.error
        }
      }
      catch (e) {
        this.error = `Неудачная попытка удалить судоводителя: ${e}`
      }
      finally {
        this.isLoading = false
      }
    }
  }
})