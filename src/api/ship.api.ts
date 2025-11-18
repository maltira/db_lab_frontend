import config from '@/config'
import type { ErrorResponse } from '@/types/dto/error.dto.ts'
import type { Ship, ShipType } from '@/types/ship.ts'

class ShipApi {
  private baseURL = config.apiUrl

  async fetchAllShips(): Promise<Ship[] | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/ship/all`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }
  async fetchAllTypes(): Promise<ShipType[] | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/ship/type/all`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }
}

export const shipService = new ShipApi();