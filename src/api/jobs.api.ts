import axiosInstance from './axiosInstance'
import type { ApiResponse, CompanyJob, CreateJobPayload, JobDetail, JobListItem } from '../types'

export async function getJobs() {
  const response = await axiosInstance.get<ApiResponse<{ jobs: JobListItem[] }>>('/jobs')
  return response.data.data.jobs
}

export async function getJobById(jobId: string) {
  const response = await axiosInstance.get<ApiResponse<{ job: JobDetail }>>(`/jobs/${jobId}`)
  return response.data.data.job
}

export async function getCompanyJobs() {
  const response = await axiosInstance.get<ApiResponse<{ jobs: CompanyJob[] }>>('/company/jobs')
  return response.data.data.jobs
}

export async function createJob(payload: CreateJobPayload) {
  const response = await axiosInstance.post<ApiResponse<{ job: CompanyJob }>>('/jobs', payload)
  return response.data.data.job
}
