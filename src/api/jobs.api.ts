import axiosInstance from './axiosInstance'
import type { ApiResponse, JobDetail, JobListItem } from '../types'

export async function getJobs() {
  const response = await axiosInstance.get<ApiResponse<{ jobs: JobListItem[] }>>('/jobs')
  return response.data.data.jobs
}

export async function getJobById(jobId: string) {
  const response = await axiosInstance.get<ApiResponse<{ job: JobDetail }>>(`/jobs/${jobId}`)
  return response.data.data.job
}
