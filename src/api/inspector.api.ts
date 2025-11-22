import config from '@/config'
import type { ErrorResponse, MessageResponse } from '@/types/dto/error.dto.ts'
import type { Inspector } from '@/types/inspector.ts'
import type { InspectorCreateRequest} from '@/types/dto/request.dto.ts'

class InspectorApi {
  private baseURL = config.apiUrl

  async fetchAll(): Promise<Inspector[] | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/inspector/all`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }

  async fetchOne(id: string): Promise<Inspector | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/inspector/${id}`, {
      method: 'GET',
    })
    return response.json()
  }

  async updateInspector(req: Inspector): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/inspector`, {
      method: 'PUT',
      credentials: "include",
      body: JSON.stringify(req)
    })
    return response.json()
  }
  async createInspector(req: InspectorCreateRequest): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/inspector`, {
      method: 'POST',
      credentials: "include",
      body: JSON.stringify(req)
    })
    return response.json()
  }
  async deleteInspector(id: string): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/inspector/${id}`, {
      method: 'DELETE',
    })
    return response.json()
  }
}

export const inspectorService = new InspectorApi();