import axiosInstance from './axiosInstance'
import type { ApiResponse, LoginPayload, RegisterPayload, User } from '../types'

interface LoginData { accessToken: string; user: User }

export async function login(payload: LoginPayload) {
  const response = await axiosInstance.post<ApiResponse<LoginData>>('/auth/login', payload)
  return response.data.data
}

export async function register(payload: RegisterPayload) {
  const response = await axiosInstance.post<ApiResponse<{ user: User }>>('/auth/register', payload)
  return response.data.data.user
}

export async function getCurrentUser() {
  const response = await axiosInstance.get<ApiResponse<{ user: User }>>('/auth/me')
  return response.data.data.user
}
