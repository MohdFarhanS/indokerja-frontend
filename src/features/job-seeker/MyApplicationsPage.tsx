import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyApplications } from '../../api/applications.api'
import type { MyApplication } from '../../types'
import { ApplicationStatusBadge } from './ApplicationStatusBadge'
import { CardSkeletons, ErrorState } from './AsyncStates'
import { formatDate, formatJobType } from './formatters'

export function MyApplicationsPage() {
  const [applications, setApplications] = useState<MyApplication[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const loadApplications = useCallback(async () => {
    try { setApplications(await getMyApplications()); setState('ready') } catch { setState('error') }
  }, [])
  useEffect(() => { void Promise.resolve().then(loadApplications) }, [loadApplications])
  return <>
    <header className="page-heading"><p className="eyebrow">Perjalanan Karier</p><h1>Lamaran Saya</h1>
      <p>Pantau perkembangan lamaran pekerjaan Anda.</p></header>
    {state === 'loading' && <><p className="sr-only" role="status">Memuat lamaran...</p><CardSkeletons /></>}
    {state === 'error' && <ErrorState title="Gagal memuat lamaran" message="Data lamaran Anda belum dapat dimuat." onRetry={() => { setState('loading'); void loadApplications() }} />}
    {state === 'ready' && applications.length === 0 && <section className="state-card"><h2>Belum ada lamaran</h2>
      <p>Anda belum melamar pekerjaan apa pun.</p><Link className="primary-button button-link" to="/job-seeker/jobs">Cari Lowongan</Link></section>}
    {state === 'ready' && applications.length > 0 && <div className="card-list">{applications.map((application) => <article className="job-card application-card" key={application.id}>
      <div className="card-title-row"><div><h2>{application.job.title}</h2><p className="company-name">{application.job.company.name}</p></div>
        <ApplicationStatusBadge status={application.status} /></div>
      <p className="job-meta">{application.job.location} <span aria-hidden="true">·</span> {formatJobType(application.job.jobType)}</p>
      <p className="date-text">Dilamar {formatDate(application.createdAt)}</p>
      <Link className="secondary-link" to={`/job-seeker/jobs/${application.job.id}`}>Lihat Lowongan</Link>
    </article>)}</div>}
  </>
}
