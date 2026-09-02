export function CardSkeletons() {
  return <div className="card-list" aria-hidden="true">
    {[0, 1, 2].map((item) => <div className="skeleton-card" key={item}>
      <span /><span /><span /><span />
    </div>)}
  </div>
}

export function ErrorState({ title, message, onRetry }: { title: string; message: string; onRetry: () => void }) {
  return <section className="state-card" role="alert">
    <h2>{title}</h2><p>{message}<br />Silakan coba lagi.</p>
    <button className="primary-button" type="button" onClick={onRetry}>Coba Lagi</button>
  </section>
}
