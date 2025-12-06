import config from '@/config'
import type { User } from '@/types/user.ts'
import type { ErrorResponse } from '@/types/dto/error.dto.ts'

class UserApi {
  private baseURL = config.apiUrl

  async getByID(id: string): Promise<User | ErrorResponse>  {
    const response = await fetch(`${this.baseURL}/user/${id}`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }

  async getByEmail(email: string): Promise<User | ErrorResponse>  {
    const response = await fetch(`${this.baseURL}/user/email/${email}`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }

  async getCurrentUser(): Promise<User | ErrorResponse>  {
    const response = await fetch(`${this.baseURL}/user`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }
}

export const userService = new UserApi();