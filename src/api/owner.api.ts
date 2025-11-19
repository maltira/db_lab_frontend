import config from '@/config'
import type { ErrorResponse } from '@/types/dto/error.dto.ts'
import type { Owner } from '@/types/owner.ts'

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
}

export const ownerService = new OwnerApi();