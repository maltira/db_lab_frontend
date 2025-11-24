import config from '@/config'
import type { ErrorResponse, MessageResponse } from '@/types/dto/error.dto.ts'
import type { Ship, ShipType } from '@/types/ship.ts'
import type { ShipCreateRequest } from '@/types/dto/request.dto.ts'

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

  async fetchOne(id: string): Promise<Ship | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/ship/${id}`, {
      method: 'GET',
    })
    return response.json()
  }

  async updateShip(req: Ship): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/ship`, {
      method: 'PUT',
      credentials: "include",
      body: JSON.stringify(req)
    })
    return response.json()
  }
  async createShip(req: ShipCreateRequest): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/ship`, {
      method: 'POST',
      credentials: "include",
      body: JSON.stringify(req)
    })
    return response.json()
  }
  async deleteShip(id: string): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/ship/${id}`, {
      method: 'DELETE',
    })
    return response.json()
  }
}

export const shipService = new ShipApi();