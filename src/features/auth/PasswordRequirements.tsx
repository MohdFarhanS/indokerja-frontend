import { passwordRequirements } from './passwordValidation'

export function PasswordRequirements({ password }: { password: string }) {
  const checks = passwordRequirements(password)
  const items = [
    ['length', 'Minimal 12 karakter'], ['uppercase', 'Mengandung huruf besar'],
    ['lowercase', 'Mengandung huruf kecil'], ['digit', 'Mengandung angka'],
    ['symbol', 'Mengandung simbol'], ['bytes', 'Maksimal 72 byte UTF-8'],
  ] as const
  return <div className="password-requirements" aria-live="polite">
    <p>Kata sandi harus memenuhi:</p>
    <ul>{items.map(([key, label]) => <li className={checks[key] ? 'met' : ''} key={key}>
      <span aria-hidden="true">{checks[key] ? '\u2713' : '\u25CB'}</span> {label}
    </li>)}</ul>
  </div>
}
