import type { Ship, ShipType } from '@/types/ship.ts'
import { defineStore } from 'pinia'
import type { ErrorResponse, MessageResponse } from '@/types/dto/error.dto.ts'
import { shipService } from '@/api/ship.api.ts'
import { isErrorResponse } from '@/utils/response_type.ts'
import type { ShipCreateRequest } from '@/types/dto/request.dto.ts'


export const useShipStore = defineStore('ship', {
  state: () => ({
    ships: [] as Ship[],
    types: [] as ShipType[],
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchShips(): Promise<Ship[] | null> {
      try {
        this.isLoading = true;
        this.error = null

        const response: Ship[] | ErrorResponse = await shipService.fetchAllShips()
        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        this.ships = response
        return response
      }
      catch {
        this.error = "Ошибка получения данных о суднах"
        return null
      }
      finally {
        this.isLoading = false
      }
    },
    async fetchTypes(): Promise<ShipType[] | null> {
      try {
        this.isLoading = true;
        this.error = null

        const response: ShipType[] | ErrorResponse = await shipService.fetchAllTypes()
        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        this.types = response
        return response
      }
      catch {
        this.error = "Ошибка получения данных о типах"
        return null
      }
      finally {
        this.isLoading = false
      }
    },

    async fetchOne(id: string): Promise<Ship | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: Ship | ErrorResponse = await shipService.fetchOne(id)

        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        return response
      }
      catch {
        this.error = "Не удалось получить информацию о судне"
        return null
      }
      finally {
        this.isLoading = false
      }
    },

    async Update(req: Ship): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await shipService.updateShip(req)

        if (isErrorResponse(response)) {
          this.error = response.error
        }
      }
      catch (e) {
        this.error = `Неудачная попытка обновить судно: ${e}`
      }
      finally {
        this.isLoading = false
      }
    },
    async Create(req: ShipCreateRequest): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await shipService.createShip(req)

        if (isErrorResponse(response)) {
          this.error = response.error
        }
      }
      catch (e) {
        this.error = `Неудачная попытка добавить судно: ${e}`
      }
      finally {
        this.isLoading = false
      }
    },
    async Delete(id: string): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await shipService.deleteShip(id)
        if (isErrorResponse(response)) {
          this.error = response.error
        }
      }
      catch (e) {
        this.error = `Неудачная попытка удалить судно: ${e}`
      }
      finally {
        this.isLoading = false
      }
    }
  }
})