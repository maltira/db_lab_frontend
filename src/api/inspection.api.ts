
import config from '@/config'
import type { ErrorResponse } from '@/types/dto/error.dto.ts'
import type { Inspection } from '@/types/inspection.ts'

class InspectionApi {
  private baseURL = config.apiUrl

  async fetchAll(): Promise<Inspection[] | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/inspection/all`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }
}

export const inspectionService = new InspectionApi();