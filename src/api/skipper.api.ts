import config from '@/config'
import type { ErrorResponse, MessageResponse } from '@/types/dto/error.dto.ts'
import type { Skipper } from '@/types/skipper.ts'
import type { SkipperCreateRequest } from '@/types/dto/request.dto.ts'

class SkipperApi {
  private baseURL = config.apiUrl

  async fetchAll(): Promise<Skipper[] | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/skipper/all`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }

  async fetchOne(id: string): Promise<Skipper | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/skipper/${id}`, {
      method: 'GET',
    })
    return response.json()
  }

  async updateSkipper(req: Skipper): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/skipper`, {
      method: 'PUT',
      credentials: "include",
      body: JSON.stringify(req)
    })
    return response.json()
  }
  async createSkipper(req: SkipperCreateRequest): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/skipper`, {
      method: 'POST',
      credentials: "include",
      body: JSON.stringify(req)
    })
    return response.json()
  }
  async deleteSkipper(id: string): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/skipper/${id}`, {
      method: 'DELETE',
    })
    return response.json()
  }
}

export const skipperService = new SkipperApi();