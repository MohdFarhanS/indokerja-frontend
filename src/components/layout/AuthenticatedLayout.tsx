import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface NavItem { to: string; label: string; end?: boolean }

export function AuthenticatedLayout({ homeTo, navLabel, navItems }: { homeTo: string; navLabel: string; navItems: NavItem[] }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return <div className="app-shell">
    <header className="site-header">
      <div className="header-inner">
        <NavLink to={homeTo} className="brand">Indo<span>Kerja</span></NavLink>
        <nav aria-label={navLabel}>
          {navItems.map((item) => <NavLink key={item.to} to={item.to} end={item.end}>{item.label}</NavLink>)}
        </nav>
        <div className="account-actions">
          <span title={user?.name}>{user?.name}</span>
          <button type="button" onClick={handleLogout}>Keluar</button>
        </div>
      </div>
    </header>
    <main className="app-main"><Outlet /></main>
  </div>
}
