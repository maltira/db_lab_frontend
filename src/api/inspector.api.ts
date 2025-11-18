import config from '@/config'
import type { ErrorResponse } from '@/types/dto/error.dto.ts'
import type { Inspector } from '@/types/inspector.ts'

class InspectorApi {
  private baseURL = config.apiUrl

  async fetchAll(): Promise<Inspector[] | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/inspector/all`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }
}

export const inspectorService = new InspectorApi();