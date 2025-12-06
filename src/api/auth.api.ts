import config from '@/config'
import type { ErrorResponse, MessageResponse } from '@/types/dto/error.dto.ts'
import type { AuthRequest, AuthResponse } from '@/types/dto/request.dto.ts'

class AuthApi {
  private baseURL = config.apiUrl

  async login(req: AuthRequest): Promise<AuthResponse | ErrorResponse>  {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      credentials: "include",
      body: JSON.stringify(req)
    })

    return response.json()
  }

  async logout(): Promise<MessageResponse | ErrorResponse>  {
    const response = await fetch(`${this.baseURL}/auth/logout`, {
      method: 'POST',
      credentials: "include"
    })
    return response.json()
  }

  async status(): Promise<AuthResponse | ErrorResponse>  {
    const response = await fetch(`${this.baseURL}/auth/status`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }
}

export const authService = new AuthApi();