import { defineStore } from 'pinia'
import type { ErrorResponse, MessageResponse } from '@/types/dto/error.dto.ts'
import { isErrorResponse } from '@/utils/response_type.ts'
import type { Owner } from '@/types/owner.ts'
import { ownerService } from '@/api/owner.api.ts'

export const useOwnerStore = defineStore('owner', {
  state: () => ({
    owners: [] as Owner[],
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchOwners(): Promise<Owner[] | null> {
      try {
        this.isLoading = true;
        this.error = null

        const response: Owner[] | ErrorResponse = await ownerService.fetchAll()
        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        this.owners = response
        return response
      }
      catch {
        this.error = "Ошибка получения данных о владельцах"
        return null
      }
      finally {
        this.isLoading = false
      }
    },
    async fetchOne(id: string): Promise<Owner | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: Owner | ErrorResponse = await ownerService.fetchOne(id)

        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        return response
      }
      catch {
        this.error = "Не удалось получить информацию о пользователе"
        return null
      }
      finally {
        this.isLoading = false
      }
    },
    async update(req: Owner): Promise<boolean | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await ownerService.updateOwner(req)

        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        return true
      }
      catch (e) {
        this.error = `Неудачная попытка обновить владельца: ${e}`
        return null
      }
      finally {
        this.isLoading = false
      }
    }
  }
})