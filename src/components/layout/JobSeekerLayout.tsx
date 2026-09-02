import { AuthenticatedLayout } from './AuthenticatedLayout'

export function JobSeekerLayout() {
  return <AuthenticatedLayout homeTo="/job-seeker/jobs" navLabel="Navigasi pencari kerja" navItems={[
    { to: '/job-seeker/jobs', label: 'Lowongan' },
    { to: '/job-seeker/applications', label: 'Lamaran Saya' },
  ]} />
}
