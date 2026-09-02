import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getJobApplications, updateApplicationStatus } from '../../api/applications.api'
import { getCompanyJobs } from '../../api/jobs.api'
import { ApplicationStatusBadge } from '../../components/ApplicationStatusBadge'
import { CardSkeletons } from '../../components/AsyncStates'
import { EmptyState } from '../../components/EmptyState'
import { PageHeader } from '../../components/PageHeader'
import type { ApplicationStatus, CandidateApplication } from '../../types'
import { applicationStatusLabels, formatDate } from '../../utils/formatters'

const statuses = ['APPLIED', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'] satisfies ApplicationStatus[]
type LoadState = 'loading' | 'ready' | 'forbidden' | 'missing' | 'error'
type UpdateFeedback = { kind: 'success' | 'error'; message: string }

export function CandidatesPage() {
  const { jobId } = useParams()
  const [applications, setApplications] = useState<CandidateApplication[]>([])
  const [jobTitle, setJobTitle] = useState('')
  const [state, setState] = useState<LoadState>('loading')
  const [selected, setSelected] = useState<Record<string, ApplicationStatus>>({})
  const [updating, setUpdating] = useState<Record<string, boolean>>({})
  const [feedback, setFeedback] = useState<Record<string, UpdateFeedback>>({})
  const [reloadKey, setReloadKey] = useState(0)
  const requestIdRef = useRef(0)
  const mountedRef = useRef(true)

  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false } }, [])
  useEffect(() => {
    const requestId = ++requestIdRef.current
    let active = true
    async function load() {
      setState('loading'); setApplications([]); setJobTitle(''); setSelected({}); setUpdating({}); setFeedback({})
      if (!jobId) { setState('missing'); return }
      try {
        const loadedApplications = await getJobApplications(jobId)
        if (!active || requestId !== requestIdRef.current) return
        setApplications(loadedApplications)
        setJobTitle(loadedApplications[0]?.job.title ?? '')
        setSelected(Object.fromEntries(loadedApplications.map((application) => [application.id, application.status])))
        setState('ready')

        if (loadedApplications.length === 0) {
          try {
            const jobs = await getCompanyJobs()
            if (!active || requestId !== requestIdRef.current) return
            setJobTitle(jobs.find((job) => job.id === jobId)?.title ?? '')
          } catch {
            // Job title lookup is auxiliary; candidate data and ownership remain authoritative.
          }
        }
      } catch (error: unknown) {
        if (!active || requestId !== requestIdRef.current) return
        if (axios.isAxiosError(error) && error.response?.status === 403) setState('forbidden')
        else if (axios.isAxiosError(error) && (error.response?.status === 400 || error.response?.status === 404)) setState('missing')
        else setState('error')
      }
    }
    void Promise.resolve().then(load)
    return () => { active = false }
  }, [jobId, reloadKey])

  function retry() { requestIdRef.current += 1; setState('loading'); setReloadKey((key) => key + 1) }

  async function saveStatus(application: CandidateApplication) {
    const nextStatus = selected[application.id]
    if (!nextStatus || nextStatus === application.status || updating[application.id]) return
    const pageRequestId = requestIdRef.current
    setUpdating((current) => ({ ...current, [application.id]: true }))
    setFeedback((current) => { const copy = { ...current }; delete copy[application.id]; return copy })
    try {
      const updated = await updateApplicationStatus(application.id, nextStatus)
      if (!mountedRef.current || pageRequestId !== requestIdRef.current) return
      setApplications((current) => current.map((item) => item.id === application.id ? { ...item, status: updated.status } : item))
      setSelected((current) => ({ ...current, [application.id]: updated.status }))
      setFeedback((current) => ({ ...current, [application.id]: { kind: 'success', message: 'Status lamaran berhasil diperbarui.' } }))
    } catch (error: unknown) {
      if (!mountedRef.current || pageRequestId !== requestIdRef.current) return
      let message = 'Status lamaran belum dapat diperbarui. Silakan coba lagi.'
      if (axios.isAxiosError(error) && error.response?.status === 400) message = 'Status tersebut sudah digunakan pada lamaran ini.'
      else if (axios.isAxiosError(error) && error.response?.status === 403) message = 'Anda tidak memiliki akses untuk mengelola lamaran ini.'
      else if (axios.isAxiosError(error) && error.response?.status === 404) message = 'Lamaran tidak ditemukan.'
      setFeedback((current) => ({ ...current, [application.id]: { kind: 'error', message } }))
    } finally {
      if (mountedRef.current && pageRequestId === requestIdRef.current) setUpdating((current) => ({ ...current, [application.id]: false }))
    }
  }

  if (state === 'loading') return <><Link className="back-link" to="/company/jobs">← Kembali ke Lowongan Saya</Link>
    <p className="sr-only" role="status">Memuat kandidat...</p><CardSkeletons /></>
  if (state === 'forbidden') return <ResourceState title="Akses ditolak" message="Anda tidak memiliki akses ke kandidat lowongan ini." />
  if (state === 'missing') return <ResourceState title="Lowongan tidak ditemukan" message="Lowongan yang Anda cari tidak tersedia." />
  if (state === 'error') return <section className="state-card" role="alert"><h1>Gagal memuat kandidat</h1><p>Data kandidat belum dapat dimuat.<br />Silakan coba lagi.</p>
    <button className="primary-button" type="button" onClick={retry}>Coba Lagi</button></section>

  return <><Link className="back-link" to="/company/jobs">← Kembali ke Lowongan Saya</Link>
    <PageHeader eyebrow="Perusahaan" title="Kandidat" description="Kandidat yang telah melamar lowongan ini." />
    {jobTitle && <h2 className="candidate-job-title">{jobTitle}</h2>}
    {applications.length === 0 ? <EmptyState title="Belum ada kandidat" message="Belum ada pencari kerja yang melamar lowongan ini." /> :
      <div className="card-list">{applications.map((application) => {
        const isUpdating = Boolean(updating[application.id]); const chosen = selected[application.id] ?? application.status
        const itemFeedback = feedback[application.id]
        return <article className="candidate-card" key={application.id}>
          <div className="candidate-header"><div><h2>{application.jobSeeker.name}</h2><p className="candidate-email">{application.jobSeeker.email}</p></div>
            <ApplicationStatusBadge status={application.status} /></div>
          <p className="date-text">Dilamar {formatDate(application.createdAt)}</p>
          <div className="status-controls"><div className="form-field"><label htmlFor={`status-${application.id}`}>Status Lamaran {application.jobSeeker.name}</label>
            <select id={`status-${application.id}`} value={chosen} disabled={isUpdating} onChange={(event) => setSelected((current) => ({ ...current, [application.id]: event.target.value as ApplicationStatus }))}>
              {statuses.map((status) => <option key={status} value={status}>{applicationStatusLabels[status]}</option>)}</select></div>
            <button className="primary-button" type="button" disabled={isUpdating || chosen === application.status} onClick={() => void saveStatus(application)}>{isUpdating ? 'Menyimpan...' : 'Simpan Status'}</button></div>
          {itemFeedback && <p className={`status-feedback ${itemFeedback.kind}`} role={itemFeedback.kind === 'error' ? 'alert' : 'status'}>{itemFeedback.message}</p>}
        </article>
      })}</div>}
  </>
}

function ResourceState({ title, message }: { title: string; message: string }) {
  return <section className="state-card"><h1>{title}</h1><p>{message}</p><Link className="primary-button button-link" to="/company/jobs">Kembali ke Lowongan Saya</Link></section>
}
