import config from '@/config'
import type { ErrorResponse } from '@/types/dto/error.dto.ts'
import type { Violation } from '@/types/violation.ts'

class ViolationApi {
  private baseURL = config.apiUrl

  async fetchAll(): Promise<Violation[] | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/violation/all`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }
}

export const violationService = new ViolationApi();