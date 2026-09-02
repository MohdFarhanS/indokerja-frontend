import axiosInstance from './axiosInstance'
import type { ApiResponse, ApplicationStatus, CandidateApplication, MyApplication, SubmittedApplication } from '../types'

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

export async function getJobApplications(jobId: string) {
  const response = await axiosInstance.get<ApiResponse<{ applications: CandidateApplication[] }>>(
    `/jobs/${jobId}/applications`,
  )
  return response.data.data.applications
}

export async function updateApplicationStatus(applicationId: string, status: ApplicationStatus) {
  const response = await axiosInstance.patch<ApiResponse<{ application: Omit<SubmittedApplication, 'status'> & { status: ApplicationStatus } }>>(
    `/applications/${applicationId}/status`,
    { status },
  )
  return response.data.data.application
}
