import config from '@/config'
import type { ErrorResponse, MessageResponse } from '@/types/dto/error.dto.ts'
import type { Violation } from '@/types/violation.ts'
import type { ViolationCreateRequest } from '@/types/dto/request.dto.ts'

class ViolationApi {
  private baseURL = config.apiUrl

  async fetchAll(): Promise<Violation[] | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/violation/all`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }

  async fetchOne(id: string): Promise<Violation | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/violation/${id}`, {
      method: 'GET',
    })
    return response.json()
  }

  async updateViolation(req: Violation): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/violation`, {
      method: 'PUT',
      credentials: "include",
      body: JSON.stringify(req)
    })
    return response.json()
  }
  async createViolation(req: ViolationCreateRequest): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/violation`, {
      method: 'POST',
      credentials: "include",
      body: JSON.stringify(req)
    })
    return response.json()
  }
  async deleteViolation(id: string): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/violation/${id}`, {
      method: 'DELETE',
    })
    return response.json()
  }
}

export const violationService = new ViolationApi();