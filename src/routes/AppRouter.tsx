import type { ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { LoginPage } from '../features/auth/LoginPage'
import { RegisterPage } from '../features/auth/RegisterPage'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { JobSeekerLayout } from '../components/layout/JobSeekerLayout'
import { JobListPage } from '../features/job-seeker/JobListPage'
import { JobDetailPage } from '../features/job-seeker/JobDetailPage'
import { MyApplicationsPage } from '../features/job-seeker/MyApplicationsPage'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../types'

function homeFor(role: UserRole) { return role === 'JOB_SEEKER' ? '/job-seeker/jobs' : '/company' }

function ProtectedRoute({ role, children }: { role: UserRole; children: ReactNode }) {
  const { user, isInitializing } = useAuth()
  const location = useLocation()
  if (isInitializing) return <div className="page-loading" role="status">Memuat sesi...</div>
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (user.role !== role) return <Navigate to={homeFor(user.role)} replace />
  return children
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { user, isInitializing } = useAuth()
  if (isInitializing) return <div className="page-loading" role="status">Memuat sesi...</div>
  if (user) return <Navigate to={homeFor(user.role)} replace />
  return children
}

function RootRoute() {
  const { user, isInitializing } = useAuth()
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
    <Route path="/company" element={<ProtectedRoute role="COMPANY"><DashboardPage /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
