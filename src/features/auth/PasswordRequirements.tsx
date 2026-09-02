import { passwordRequirements } from './passwordValidation'

export function PasswordRequirements({ password }: { password: string }) {
  const checks = passwordRequirements(password)
  const items = [
    ['length', 'Minimal 12 karakter'], ['uppercase', 'Mengandung huruf besar'],
    ['lowercase', 'Mengandung huruf kecil'], ['digit', 'Mengandung angka'],
    ['symbol', 'Mengandung simbol'],
  ] as const
  return <div className="password-requirements">
    <p>Kata sandi harus memenuhi:</p>
    <ul>{items.map(([key, label]) => <li className={checks[key] ? 'met' : ''} key={key}>
      <span aria-hidden="true">{checks[key] ? '\u2713' : '\u25CB'}</span>{' '}
      <span className="sr-only">{checks[key] ? 'Terpenuhi: ' : 'Belum terpenuhi: '}</span>{label}
    </li>)}</ul>
  </div>
}
