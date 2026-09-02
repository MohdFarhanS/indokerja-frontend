import type { InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> { label: string; error?: string }

export function TextField({ label, error, id, ...props }: TextFieldProps) {
  const inputId = id ?? props.name
  return <div className="form-field">
    <label htmlFor={inputId}>{label}</label>
    <input id={inputId} aria-invalid={Boolean(error)} {...props} />
    {error && <p className="field-error" role="alert">{error}</p>}
  </div>
}
