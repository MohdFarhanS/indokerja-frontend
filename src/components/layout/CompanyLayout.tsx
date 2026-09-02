import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function CompanyLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return <div className="job-seeker-shell company-shell">
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/company/jobs" className="brand">Indo<span>Kerja</span></NavLink>
        <nav aria-label="Navigasi perusahaan">
          <NavLink to="/company/jobs" end>Lowongan Saya</NavLink>
          <NavLink to="/company/jobs/new">Buat Lowongan</NavLink>
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
