import { defineStore } from 'pinia'
import type { AuthRequest, AuthResponse } from '@/types/dto/request.dto.ts'
import type { ErrorResponse, MessageResponse } from '@/types/dto/error.dto.ts'
import { authService } from '@/api/auth.api.ts'
import { isErrorResponse } from '@/utils/response_type.ts'
import type { User } from '@/types/user.ts'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async login(req: AuthRequest): Promise<AuthResponse | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: AuthResponse | ErrorResponse = await authService.login(req)

        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        this.user = response.user
        this.isAuthenticated = true
        return response
      }
      catch {
        this.error = "Ошибка авторизации, повторите попытку"
        return null
      }
      finally {
        this.isLoading = false
      }
    },
    async logout(): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await authService.logout()

        if (isErrorResponse(response)) {
          this.error = response.error
        }

        this.user = null
        this.isAuthenticated = false
      }
      catch {
        this.error = "Ошибка выхода из профиля, повторите попытку"
      }
      finally {
        this.isLoading = false
      }
    },
    async status(): Promise<AuthResponse | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: AuthResponse | ErrorResponse = await authService.status()

        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        this.user = response.user
        this.isAuthenticated = true
        return response
      }
      catch {
        this.error = "Ошибка получения статуса, повторите попытку"
        return null
      }
      finally {
        this.isLoading = false
      }
    },
  }
})