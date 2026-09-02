import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  if (!user) return null
  const seeker = user.role === 'JOB_SEEKER'
  function handleLogout() { logout(); navigate('/login', { replace: true }) }
  return <div className="dashboard-shell">
    <header><span className="brand">Indo<span>Kerja</span></span><div><span>{user.name}</span><button onClick={handleLogout}>Keluar</button></div></header>
    <main><p className="eyebrow">{seeker ? 'Pencari Kerja' : 'Perusahaan'}</p><h1>Halo, {user.name}!</h1>
      <h2>{seeker ? 'Akun Pencari Kerja Anda siap digunakan.' : 'Workspace perusahaan Anda siap digunakan.'}</h2>
      <p>{seeker ? 'Fitur pencarian pekerjaan akan tersedia di sini.' : 'Fitur pengelolaan lowongan dan kandidat akan tersedia di sini.'}</p>
    </main>
  </div>
}
