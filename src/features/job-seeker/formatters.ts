import type { ApplicationStatus, JobType } from '../../types'

const jobTypeLabels: Record<JobType, string> = {
  FULL_TIME: 'Penuh Waktu',
  PART_TIME: 'Paruh Waktu',
  CONTRACT: 'Kontrak',
  INTERNSHIP: 'Magang',
}

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  APPLIED: 'Dilamar',
  REVIEWING: 'Sedang Ditinjau',
  SHORTLISTED: 'Masuk Daftar Terpilih',
  REJECTED: 'Tidak Lolos',
  ACCEPTED: 'Diterima',
}

const salaryFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
})
const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric', month: 'long', year: 'numeric',
})

export function formatJobType(jobType: JobType) { return jobTypeLabels[jobType] }
export function formatSalary(salary: number) { return `${salaryFormatter.format(salary)} / bulan` }
export function formatDate(date: string) { return dateFormatter.format(new Date(date)) }
