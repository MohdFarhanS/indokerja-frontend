import axiosInstance from './axiosInstance'
import type { ApiResponse, MyApplication, SubmittedApplication } from '../types'

export async function applyToJob(jobId: string) {
  const response = await axiosInstance.post<ApiResponse<{ application: SubmittedApplication }>>(
    `/jobs/${jobId}/applications`,
  )
  return response.data.data.application
}

export async function getMyApplications() {
  const response = await axiosInstance.get<ApiResponse<{ applications: MyApplication[] }>>('/applications/me')
  return response.data.data.applications
}
