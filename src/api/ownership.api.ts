import config from '@/config'
import type { ErrorResponse } from '@/types/dto/error.dto.ts'
import type { Ownership } from '@/types/ownership.ts'

class OwnershipApi {
  private baseURL = config.apiUrl

  async fetchAll(): Promise<Ownership[] | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/ownership/all`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }
}

export const ownershipService = new OwnershipApi();