import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { applyToJob, getMyApplications } from '../../api/applications.api'
import { getJobById } from '../../api/jobs.api'
import type { JobDetail } from '../../types'
import { formatDate, formatJobType, formatSalary } from '../../utils/formatters'

type LoadState = 'loading' | 'ready' | 'missing' | 'error'
type Feedback = { kind: 'success' | 'error'; title: string; message?: string } | null

export function JobDetailPage() {
  const { jobId } = useParams()
  const [job, setJob] = useState<JobDetail | null>(null)
  const [state, setState] = useState<LoadState>('loading')
  const [alreadyApplied, setAlreadyApplied] = useState(false)
  const [isCheckingApplication, setIsCheckingApplication] = useState(true)
  const [isApplying, setIsApplying] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const requestIdRef = useRef(0)

  useEffect(() => {
    const requestId = ++requestIdRef.current
    let active = true

    async function loadJob() {
      setJob(null)
      setState('loading')
      setAlreadyApplied(false)
      setIsCheckingApplication(true)
      setIsApplying(false)
      setFeedback(null)

      if (!jobId) {
        if (active && requestId === requestIdRef.current) setState('missing')
        return
      }

      try {
        const loadedJob = await getJobById(jobId)
        if (!active || requestId !== requestIdRef.current) return

        setJob(loadedJob)
        setState('ready')

        try {
          const applications = await getMyApplications()
          if (active && requestId === requestIdRef.current) {
            setAlreadyApplied(applications.some((application) => application.job.id === loadedJob.id))
          }
        } catch {
          // This check is auxiliary; the backend remains the duplicate-prevention source of truth.
        } finally {
          if (active && requestId === requestIdRef.current) setIsCheckingApplication(false)
        }
      } catch (error: unknown) {
        if (!active || requestId !== requestIdRef.current) return
        setIsCheckingApplication(false)
        if (axios.isAxiosError(error) && (error.response?.status === 400 || error.response?.status === 404)) setState('missing')
        else setState('error')
      }
    }

    void Promise.resolve().then(loadJob)
    return () => { active = false }
  }, [jobId, reloadKey])

  function retryLoadJob() {
    requestIdRef.current += 1
    setState('loading')
    setFeedback(null)
    setReloadKey((key) => key + 1)
  }

  async function handleApply() {
    if (!jobId || isCheckingApplication || isApplying || alreadyApplied) return
    const requestId = requestIdRef.current
    setIsApplying(true)
    setFeedback(null)
    try {
      await applyToJob(jobId)
      if (requestId !== requestIdRef.current) return
      setAlreadyApplied(true)
      setFeedback({ kind: 'success', title: 'Lamaran berhasil dikirim.', message: 'Perusahaan dapat mulai meninjau lamaran Anda.' })
    } catch (error: unknown) {
      if (requestId !== requestIdRef.current) return
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setAlreadyApplied(true)
        setFeedback({ kind: 'error', title: 'Anda sudah melamar lowongan ini.' })
      } else {
        setFeedback({ kind: 'error', title: 'Lamaran belum dapat dikirim.', message: 'Silakan coba lagi beberapa saat lagi.' })
      }
    } finally {
      if (requestId === requestIdRef.current) setIsApplying(false)
    }
  }

  if (state === 'loading' || (job !== null && job.id !== jobId)) return <>
    <p className="sr-only" role="status">Memuat detail lowongan...</p>
    <div className="detail-grid detail-skeleton" aria-hidden="true">
      <div className="detail-content"><div className="detail-skeleton-block"><span /><span /><span /></div><div className="detail-skeleton-block"><span /><span /><span /><span /></div></div>
      <div className="detail-skeleton-block detail-skeleton-panel"><span /><span /><span /><span /></div>
    </div>
  </>
  if (state === 'missing') return <section className="state-card"><h1>Lowongan tidak ditemukan</h1>
    <p>Lowongan yang Anda cari tidak tersedia atau sudah tidak dapat ditemukan.</p>
    <Link className="primary-button button-link" to="/job-seeker/jobs">Kembali ke Lowongan</Link></section>
  if (state === 'error' || !job) return <section className="state-card" role="alert"><h1>Gagal memuat lowongan</h1>
    <p>Detail lowongan belum dapat dimuat. Silakan coba lagi.</p>
    <button className="primary-button" type="button" onClick={retryLoadJob}>Coba Lagi</button></section>

  return <>
    <Link className="back-link" to="/job-seeker/jobs">← Kembali ke Lowongan</Link>
    <div className="detail-grid">
      <article className="detail-content">
        <header><p className="eyebrow">Detail Lowongan</p><h1>{job.title}</h1><p className="detail-company">{job.company.name}</p>
          <p className="job-meta">{job.location} <span aria-hidden="true">·</span> {formatJobType(job.jobType)} <span aria-hidden="true">·</span> Diposting {formatDate(job.createdAt)}</p></header>
        <section><h2>Tentang Pekerjaan</h2><p className="job-description">{job.description}</p></section>
      </article>
      <aside className="apply-panel" aria-labelledby="apply-panel-title">
        <h2 id="apply-panel-title">Ringkasan Lowongan</h2>
        <dl><div><dt>Gaji</dt><dd>{formatSalary(job.salary)}</dd></div><div><dt>Tipe pekerjaan</dt><dd>{formatJobType(job.jobType)}</dd></div>
          <div><dt>Lokasi</dt><dd>{job.location}</dd></div></dl>
        {feedback && <div className={`apply-feedback ${feedback.kind}`} role={feedback.kind === 'error' ? 'alert' : 'status'}>
          <strong>{feedback.title}</strong>{feedback.message && <p>{feedback.message}</p>}</div>}
        {isCheckingApplication ? <button className="primary-button applied-button" type="button" disabled>Memeriksa status lamaran...</button> : alreadyApplied ? <><button className="primary-button applied-button" type="button" disabled>Sudah Dilamar</button>
          <Link className="secondary-link full-width-link" to="/job-seeker/applications">Lihat Lamaran Saya</Link></> :
          <button className="primary-button apply-button" type="button" disabled={isApplying} onClick={() => void handleApply()}>
            {isApplying ? 'Sedang mengirim lamaran...' : 'Lamar Sekarang'}</button>}
      </aside>
    </div>
  </>
}
