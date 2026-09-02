import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function JobSeekerLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return <div className="job-seeker-shell">
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/job-seeker/jobs" className="brand">Indo<span>Kerja</span></NavLink>
        <nav aria-label="Navigasi pencari kerja">
          <NavLink to="/job-seeker/jobs">Lowongan</NavLink>
          <NavLink to="/job-seeker/applications">Lamaran Saya</NavLink>
        </nav>
        <div className="account-actions">
          <span title={user?.name}>{user?.name}</span>
          <button type="button" onClick={handleLogout}>Keluar</button>
        </div>
      </div>
    </header>
    <main className="job-seeker-main"><Outlet /></main>
  </div>
}
