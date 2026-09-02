import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getJobs } from '../../api/jobs.api'
import { CardSkeletons, ErrorState } from '../../components/AsyncStates'
import { EmptyState } from '../../components/EmptyState'
import { PageHeader } from '../../components/PageHeader'
import type { JobListItem } from '../../types'
import { formatDate, formatJobType, formatSalary } from '../../utils/formatters'

export function JobListPage() {
  const [jobs, setJobs] = useState<JobListItem[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const loadJobs = useCallback(async () => {
    try { setJobs(await getJobs()); setState('ready') } catch { setState('error') }
  }, [])
  useEffect(() => { void Promise.resolve().then(loadJobs) }, [loadJobs])

  return <>
    <PageHeader eyebrow="Peluang Karier" title="Lowongan Pekerjaan" description="Temukan peluang kerja yang sesuai untuk Anda." />
    {state === 'loading' && <><p className="sr-only" role="status">Memuat lowongan...</p><CardSkeletons /></>}
    {state === 'error' && <ErrorState title="Gagal memuat lowongan" message="Lowongan pekerjaan belum dapat dimuat." onRetry={() => { setState('loading'); void loadJobs() }} />}
    {state === 'ready' && jobs.length === 0 && <EmptyState title="Belum ada lowongan" message={<>Saat ini belum ada lowongan pekerjaan yang tersedia.<br />Silakan periksa kembali nanti.</>} />}
    {state === 'ready' && jobs.length > 0 && <div className="card-list">{jobs.map((job) => <article className="job-card" key={job.id}>
      <div><h2>{job.title}</h2><p className="company-name">{job.company.name}</p>
        <p className="job-meta">{job.location} <span aria-hidden="true">·</span> {formatJobType(job.jobType)}</p>
        <p className="salary">{formatSalary(job.salary)}</p><p className="date-text">Diposting {formatDate(job.createdAt)}</p></div>
      <Link className="secondary-link" to={`/job-seeker/jobs/${job.id}`}>Lihat Detail</Link>
    </article>)}</div>}
  </>
}
