import { useState, type InputHTMLAttributes } from 'react'

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
}

export function PasswordField({ label, error, id, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const inputId = id ?? props.name
  return (
    <div className="form-field">
      <label htmlFor={inputId}>{label}</label>
      <div className="password-input">
        <input id={inputId} type={visible ? 'text' : 'password'} aria-invalid={Boolean(error)} {...props} />
        <button type="button" className="visibility-button" onClick={() => setVisible((value) => !value)}
          aria-label={visible ? `Sembunyikan ${label.toLowerCase()}` : `Tampilkan ${label.toLowerCase()}`}>
          <span className="visibility-label-full">{visible ? 'Sembunyikan' : 'Tampilkan'}</span>
          <span className="visibility-label-short" aria-hidden="true">{visible ? 'Tutup' : 'Lihat'}</span>
        </button>
      </div>
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  )
}
