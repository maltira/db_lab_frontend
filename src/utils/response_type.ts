import type { ErrorResponse } from '@/types/dto/error.dto.ts'

export function isErrorResponse(response: any): response is ErrorResponse {
  return response && typeof response.error === 'string'
}
