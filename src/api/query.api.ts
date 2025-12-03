import config from '@/config'
import type { ErrorResponse, MessageResponse } from '@/types/dto/error.dto.ts'
import type { Query } from '@/types/query.ts'

class QueryApi {
  private baseURL = config.apiUrl

  async fetchAll(): Promise<Query[] | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/query/all`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }

  async updateQuery(req: Query): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/query`, {
      method: 'PUT',
      credentials: "include",
      body: JSON.stringify(req)
    })
    return response.json()
  }
}

export const queryService = new QueryApi();