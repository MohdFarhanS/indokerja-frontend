import { useId, useState, type InputHTMLAttributes } from 'react'
import { RequiredIndicator } from './RequiredField'

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
}

export function PasswordField({ label, error, id, 'aria-describedby': describedBy, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const generatedId = useId()
  const inputId = id ?? props.name ?? generatedId
  const errorId = `${inputId}-error`
  const ariaDescribedBy = [describedBy, error ? errorId : undefined].filter(Boolean).join(' ') || undefined
  return (
    <div className="form-field">
      <label htmlFor={inputId}>{label}{props.required && <RequiredIndicator />}</label>
      <div className="password-input">
        <input id={inputId} type={visible ? 'text' : 'password'} {...props} aria-invalid={Boolean(error)} aria-describedby={ariaDescribedBy} />
        <button type="button" className="visibility-button" onClick={() => setVisible((value) => !value)}
          aria-label={visible ? `Sembunyikan ${label.toLowerCase()}` : `Tampilkan ${label.toLowerCase()}`}>
          <span className="visibility-label-full">{visible ? 'Sembunyikan' : 'Tampilkan'}</span>
          <span className="visibility-label-short" aria-hidden="true">{visible ? 'Tutup' : 'Lihat'}</span>
        </button>
      </div>
      {error && <p className="field-error" id={errorId} role="alert">{error}</p>}
    </div>
  )
}
