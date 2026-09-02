export type UserRole = 'JOB_SEEKER' | 'COMPANY'

export interface User { id: string; name: string; email: string; role: UserRole }
export interface LoginPayload { email: string; password: string }
export type RegisterPayload =
  | { name: string; email: string; password: string; role: 'JOB_SEEKER' }
  | { companyName: string; email: string; password: string; role: 'COMPANY'; companyDescription?: string }
export interface ApiResponse<T> { success: boolean; message?: string; data: T }
