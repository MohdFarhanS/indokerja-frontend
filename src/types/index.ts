export type UserRole = 'JOB_SEEKER' | 'COMPANY'

export interface User { id: string; name: string; email: string; role: UserRole }
export interface LoginPayload { email: string; password: string }
export type RegisterPayload =
  | { name: string; email: string; password: string; role: 'JOB_SEEKER' }
  | { companyName: string; email: string; password: string; role: 'COMPANY'; companyDescription?: string }
export interface ApiResponse<T> { success: boolean; message?: string; data: T }

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP'
export type ApplicationStatus = 'APPLIED' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED'

export interface JobListItem {
  id: string
  title: string
  location: string
  salary: number
  jobType: JobType
  createdAt: string
  company: { name: string }
}

export interface JobDetail extends JobListItem { description: string }

export interface MyApplication {
  id: string
  status: ApplicationStatus
  createdAt: string
  job: {
    id: string
    title: string
    location: string
    jobType: JobType
    company: { name: string }
  }
}

export interface SubmittedApplication {
  id: string
  jobId: string
  status: 'APPLIED'
  createdAt: string
}

export type CompanyJob = JobDetail

export interface CreateJobPayload {
  title: string
  location: string
  salary: number
  jobType: JobType
  description: string
}

export interface CandidateApplication {
  id: string
  status: ApplicationStatus
  createdAt: string
  job: { id: string; title: string }
  jobSeeker: { name: string; email: string }
}
