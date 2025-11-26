import { defineStore } from 'pinia'
import type { ErrorResponse, MessageResponse } from '@/types/dto/error.dto.ts'
import { isErrorResponse } from '@/utils/response_type.ts'
import type { Ownership } from '@/types/ownership.ts'
import { ownershipService } from '@/api/ownership.api.ts'
import type { OwnershipCreateRequest } from '@/types/dto/request.dto.ts'

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
      },
    async fetchOne(id: string): Promise<Ownership | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: Ownership | ErrorResponse = await ownershipService.fetchOne(id)

        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        return response
      }
      catch {
        this.error = "Не удалось получить информацию о истории владения"
        return null
      }
      finally {
        this.isLoading = false
      }
    },

    async Update(req: Ownership): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await ownershipService.updateOwnership(req)

        if (isErrorResponse(response)) {
          this.error = response.error
        }
      }
      catch (e) {
        this.error = `Неудачная попытка обновить историю владения: ${e}`
      }
      finally {
        this.isLoading = false
      }
    },
    async Create(req: OwnershipCreateRequest): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await ownershipService.createOwnership(req)

        if (isErrorResponse(response)) {
          this.error = response.error
        }
      }
      catch (e) {
        this.error = `Неудачная попытка добавить историю владения: ${e}`
      }
      finally {
        this.isLoading = false
      }
    },
    async Delete(id: string): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await ownershipService.deleteOwnership(id)
        if (isErrorResponse(response)) {
          this.error = response.error
        }
      }
      catch (e) {
        this.error = `Неудачная попытка удалить историю владения: ${e}`
      }
      finally {
        this.isLoading = false
      }
    }
  }
})