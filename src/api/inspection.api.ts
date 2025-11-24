
import config from '@/config'
import type { ErrorResponse, MessageResponse } from '@/types/dto/error.dto.ts'
import type { Inspection } from '@/types/inspection.ts'
import type { InspectionCreateRequest } from '@/types/dto/request.dto.ts'

class InspectionApi {
  private baseURL = config.apiUrl

  async fetchAll(): Promise<Inspection[] | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/inspection/all`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }

  async fetchOne(id: string): Promise<Inspection | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/inspection/${id}`, {
      method: 'GET',
    })
    return response.json()
  }

  async update(req: Inspection): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/inspection`, {
      method: 'PUT',
      credentials: "include",
      body: JSON.stringify(req)
    })
    return response.json()
  }
  async create(req: InspectionCreateRequest): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/inspection`, {
      method: 'POST',
      credentials: "include",
      body: JSON.stringify(req)
    })
    return response.json()
  }
  async delete(id: string): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/inspection/${id}`, {
      method: 'DELETE',
    })
    return response.json()
  }
}

export const inspectionService = new InspectionApi();