import config from '@/config'
import type { ErrorResponse } from '@/types/dto/error.dto.ts'
import type { Skipper } from '@/types/skipper.ts'

class SkipperApi {
  private baseURL = config.apiUrl

  async fetchAll(): Promise<Skipper[] | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/skipper/all`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }
}

export const skipperService = new SkipperApi();