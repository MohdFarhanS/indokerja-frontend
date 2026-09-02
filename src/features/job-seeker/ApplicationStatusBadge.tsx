import type { ApplicationStatus } from '../../types'
import { applicationStatusLabels } from './formatters'

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className={`status-badge status-${status.toLowerCase()}`}>{applicationStatusLabels[status]}</span>
}
