import { useId, type InputHTMLAttributes } from 'react'
import { RequiredIndicator } from './RequiredField'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> { label: string; error?: string }

export function TextField({ label, error, id, 'aria-describedby': describedBy, ...props }: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? props.name ?? generatedId
  const errorId = `${inputId}-error`
  const ariaDescribedBy = [describedBy, error ? errorId : undefined].filter(Boolean).join(' ') || undefined
  return <div className="form-field">
    <label htmlFor={inputId}>{label}{props.required && <RequiredIndicator />}</label>
    <input id={inputId} {...props} aria-invalid={Boolean(error)} aria-describedby={ariaDescribedBy} />
    {error && <p className="field-error" id={errorId} role="alert">{error}</p>}
  </div>
}
