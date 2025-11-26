import config from '@/config'
import type { ErrorResponse, MessageResponse } from '@/types/dto/error.dto.ts'
import type { Ownership } from '@/types/ownership.ts'
import type { OwnershipCreateRequest } from '@/types/dto/request.dto.ts'

class OwnershipApi {
  private baseURL = config.apiUrl

  async fetchAll(): Promise<Ownership[] | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/ownership/all`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }

  async fetchOne(id: string): Promise<Ownership | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/ownership/${id}`, {
      method: 'GET',
    })
    return response.json()
  }

  async updateOwnership(req: Ownership): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/ownership`, {
      method: 'PUT',
      credentials: "include",
      body: JSON.stringify(req)
    })
    return response.json()
  }
  async createOwnership(req: OwnershipCreateRequest): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/ownership`, {
      method: 'POST',
      credentials: "include",
      body: JSON.stringify(req)
    })
    return response.json()
  }
  async deleteOwnership(id: string): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/ownership/${id}`, {
      method: 'DELETE',
    })
    return response.json()
  }
}

export const ownershipService = new OwnershipApi();