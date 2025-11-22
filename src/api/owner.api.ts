import config from '@/config'
import type { ErrorResponse, MessageResponse } from '@/types/dto/error.dto.ts'
import type { Owner } from '@/types/owner.ts'
import type { OwnerCreateRequest } from '@/types/dto/request.dto.ts'

class OwnerApi {
  private baseURL = config.apiUrl

  async fetchAll(): Promise<Owner[] | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/owner/all`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }

  async fetchOne(id: string): Promise<Owner | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/owner/${id}`, {
      method: 'GET',
    })
    return response.json()
  }

  async updateOwner(req: Owner): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/owner`, {
      method: 'PUT',
      credentials: "include",
      body: JSON.stringify(req)
    })
    return response.json()
  }
  async createOwner(req: OwnerCreateRequest): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/owner`, {
      method: 'POST',
      credentials: "include",
      body: JSON.stringify(req)
    })
    return response.json()
  }
  async deleteOwner(id: string): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/owner/${id}`, {
      method: 'DELETE',
    })
    return response.json()
  }
}

export const ownerService = new OwnerApi();