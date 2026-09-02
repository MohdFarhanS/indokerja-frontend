import { AuthenticatedLayout } from './AuthenticatedLayout'

export function CompanyLayout() {
  return <AuthenticatedLayout homeTo="/company/jobs" navLabel="Navigasi perusahaan" navItems={[
    { to: '/company/jobs', label: 'Lowongan Saya', end: true },
    { to: '/company/jobs/new', label: 'Buat Lowongan' },
  ]} />
}
