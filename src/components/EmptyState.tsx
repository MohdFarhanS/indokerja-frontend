import type { ReactNode } from 'react'

export function EmptyState({ title, message, action }: { title: string; message: ReactNode; action?: ReactNode }) {
  return <section className="state-card">
    <h2>{title}</h2>
    <p>{message}</p>
    {action}
  </section>
}
