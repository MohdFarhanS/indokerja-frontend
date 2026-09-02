import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCompanyJobs } from '../../api/jobs.api'
import { CardSkeletons, ErrorState } from '../../components/AsyncStates'
import { EmptyState } from '../../components/EmptyState'
import { PageHeader } from '../../components/PageHeader'
import type { CompanyJob } from '../../types'
import { formatDate, formatJobType, formatSalary } from '../../utils/formatters'

export function CompanyJobsPage() {
  const [jobs, setJobs] = useState<CompanyJob[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')

  const loadJobs = useCallback(async () => {
    try { setJobs(await getCompanyJobs()); setState('ready') } catch { setState('error') }
  }, [])

  useEffect(() => { void Promise.resolve().then(loadJobs) }, [loadJobs])

  return <>
    <PageHeader eyebrow="Perusahaan" title="Lowongan Saya" description="Kelola lowongan pekerjaan yang telah Anda buat."
      action={<Link className="primary-button button-link" to="/company/jobs/new">+ Buat Lowongan</Link>} />
    {state === 'loading' && <><p className="sr-only" role="status">Memuat lowongan perusahaan...</p><CardSkeletons /></>}
    {state === 'error' && <ErrorState title="Gagal memuat lowongan" message="Lowongan perusahaan belum dapat dimuat." onRetry={() => { setState('loading'); void loadJobs() }} />}
    {state === 'ready' && jobs.length === 0 && <EmptyState title="Belum ada lowongan" message="Anda belum membuat lowongan pekerjaan."
      action={<Link className="primary-button button-link" to="/company/jobs/new">Buat Lowongan</Link>} />}
    {state === 'ready' && jobs.length > 0 && <div className="card-list">{jobs.map((job) => <article className="job-card company-job-card" key={job.id}>
      <div><h2>{job.title}</h2><p className="job-meta">{job.location} <span aria-hidden="true">·</span> {formatJobType(job.jobType)}</p>
        <p className="salary">{formatSalary(job.salary)}</p><p className="job-description company-job-description">{job.description}</p>
        <p className="date-text">Dibuat {formatDate(job.createdAt)}</p></div>
      <Link className="secondary-link" to={`/company/jobs/${job.id}/candidates`}>Lihat Kandidat</Link>
    </article>)}</div>}
  </>
}
