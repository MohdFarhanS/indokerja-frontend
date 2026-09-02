import type { ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { LoginPage } from '../features/auth/LoginPage'
import { RegisterPage } from '../features/auth/RegisterPage'
import { JobSeekerLayout } from '../components/layout/JobSeekerLayout'
import { CompanyLayout } from '../components/layout/CompanyLayout'
import { CandidatesPage } from '../features/company/CandidatesPage'
import { CompanyJobsPage } from '../features/company/CompanyJobsPage'
import { CreateJobPage } from '../features/company/CreateJobPage'
import { JobListPage } from '../features/job-seeker/JobListPage'
import { JobDetailPage } from '../features/job-seeker/JobDetailPage'
import { MyApplicationsPage } from '../features/job-seeker/MyApplicationsPage'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../types'

function homeFor(role: UserRole) { return role === 'JOB_SEEKER' ? '/job-seeker/jobs' : '/company/jobs' }

function SessionRecovery() {
  const { isInitializing, logout, retrySession } = useAuth()
  const navigate = useNavigate()

  function signInAgain() {
    logout()
    navigate('/login', { replace: true })
  }

  return <main className="page-loading"><section className="state-card" role="alert">
    <h1>Sesi belum dapat diverifikasi</h1>
    <p>Koneksi ke server bermasalah. Coba lagi untuk memulihkan sesi Anda.</p>
    <div className="form-actions">
      <button className="primary-button" type="button" disabled={isInitializing} onClick={() => void retrySession()}>
        {isInitializing ? 'Mencoba lagi...' : 'Coba Lagi'}
      </button>
      <button className="secondary-link" type="button" disabled={isInitializing} onClick={signInAgain}>Masuk Ulang</button>
    </div>
  </section></main>
}

function ProtectedRoute({ role, children }: { role: UserRole; children: ReactNode }) {
  const { user, isInitializing, sessionRestoreError } = useAuth()
  const location = useLocation()
  if (sessionRestoreError) return <SessionRecovery />
  if (isInitializing) return <div className="page-loading" role="status">Memuat sesi...</div>
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (user.role !== role) return <Navigate to={homeFor(user.role)} replace />
  return children
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { user, isInitializing, sessionRestoreError } = useAuth()
  if (sessionRestoreError) return <SessionRecovery />
  if (isInitializing) return <div className="page-loading" role="status">Memuat sesi...</div>
  if (user) return <Navigate to={homeFor(user.role)} replace />
  return children
}

function RootRoute() {
  const { user, isInitializing, sessionRestoreError } = useAuth()
  if (sessionRestoreError) return <SessionRecovery />
  if (isInitializing) return <div className="page-loading" role="status">Memuat sesi...</div>
  return <Navigate to={user ? homeFor(user.role) : '/login'} replace />
}

export function AppRouter() {
  return <Routes>
    <Route path="/" element={<RootRoute />} />
    <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
    <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
    <Route path="/job-seeker" element={<ProtectedRoute role="JOB_SEEKER"><JobSeekerLayout /></ProtectedRoute>}>
      <Route index element={<Navigate to="jobs" replace />} />
      <Route path="jobs" element={<JobListPage />} />
      <Route path="jobs/:jobId" element={<JobDetailPage />} />
      <Route path="applications" element={<MyApplicationsPage />} />
    </Route>
    <Route path="/company" element={<ProtectedRoute role="COMPANY"><CompanyLayout /></ProtectedRoute>}>
      <Route index element={<Navigate to="jobs" replace />} />
      <Route path="jobs" element={<CompanyJobsPage />} />
      <Route path="jobs/new" element={<CreateJobPage />} />
      <Route path="jobs/:jobId/candidates" element={<CandidatesPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
