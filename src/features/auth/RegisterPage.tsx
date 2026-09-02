import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { register as registerAccount } from '../../api/auth.api'
import { PasswordField } from '../../components/PasswordField'
import { TextField } from '../../components/TextField'
import type { UserRole } from '../../types'
import { getAuthErrorMessage } from './apiError'
import { PasswordRequirements } from './PasswordRequirements'
import { registrationPasswordSchema } from './passwordValidation'

const baseFields = { email: z.string().trim().email('Masukkan alamat email yang valid.'), password: registrationPasswordSchema, confirmPassword: z.string() }
const seekerSchema = z.object({ ...baseFields, name: z.string().trim().min(1, 'Nama lengkap wajib diisi.').max(100, 'Nama maksimal 100 karakter.') })
  .refine((data) => data.password === data.confirmPassword, { path: ['confirmPassword'], message: 'Kata sandi dan konfirmasi kata sandi tidak sama.' })
const companySchema = z.object({ ...baseFields, companyName: z.string().trim().min(1, 'Nama perusahaan wajib diisi.').max(100, 'Nama perusahaan maksimal 100 karakter.'), companyDescription: z.string().trim().max(2000, 'Deskripsi maksimal 2000 karakter.') })
  .refine((data) => data.password === data.confirmPassword, { path: ['confirmPassword'], message: 'Kata sandi dan konfirmasi kata sandi tidak sama.' })
type SeekerValues = z.infer<typeof seekerSchema>
type CompanyValues = z.infer<typeof companySchema>

export function RegisterPage() {
  const [role, setRole] = useState<UserRole>('JOB_SEEKER')
  const [success, setSuccess] = useState(false)
  if (success) return <main className="register-shell"><section className="success-card">
    <div className="success-icon" aria-hidden="true">{'\u2713'}</div><h1>Akun berhasil dibuat!</h1>
    <p>Akun IndoKerja Anda sudah siap.<br />Silakan masuk untuk melanjutkan.</p>
    <Link className="primary-button button-link" to="/login">Lanjut ke Masuk</Link>
  </section></main>
  return <main className="register-shell"><div className="register-header"><Link className="brand" to="/login">Indo<span>Kerja</span></Link></div>
    <section className="register-card"><h1>Buat akun Anda</h1>
      <>
        <div className="role-tabs" role="group" aria-label="Tipe akun">
          <button type="button" aria-pressed={role === 'JOB_SEEKER'} className={role === 'JOB_SEEKER' ? 'active' : ''} onClick={() => setRole('JOB_SEEKER')}>Pencari Kerja</button>
          <button type="button" aria-pressed={role === 'COMPANY'} className={role === 'COMPANY' ? 'active' : ''} onClick={() => setRole('COMPANY')}>Perusahaan</button>
        </div>
        {role === 'JOB_SEEKER' ? <SeekerForm onSuccess={() => setSuccess(true)} /> : <CompanyForm onSuccess={() => setSuccess(true)} />}
      </>
      <p className="auth-switch">Sudah punya akun? <Link to="/login">Masuk</Link></p>
    </section></main>
}

function SeekerForm({ onSuccess }: { onSuccess: () => void }) {
  const [apiError, setApiError] = useState('')
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<SeekerValues>({ resolver: zodResolver(seekerSchema), defaultValues: { password: '', confirmPassword: '' } })
  const password = useWatch({ control, name: 'password' })
  async function submit(values: SeekerValues) { setApiError(''); try { await registerAccount({ name: values.name.trim(), email: values.email.trim(), password: values.password, role: 'JOB_SEEKER' }); onSuccess() } catch (error) { setApiError(getAuthErrorMessage(error, 'register')) } }
  return <form onSubmit={handleSubmit(submit)} noValidate><FormError message={apiError} />
    <TextField label="Nama Lengkap" autoComplete="name" {...register('name')} error={errors.name?.message} />
    <TextField label="Email" type="email" autoComplete="email" {...register('email')} error={errors.email?.message} />
    <PasswordField label="Kata Sandi" autoComplete="new-password" {...register('password')} error={errors.password?.message} />
    <PasswordRequirements password={password} />
    <PasswordField label="Konfirmasi Kata Sandi" autoComplete="new-password" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
    <SubmitButton pending={isSubmitting} />
  </form>
}

function CompanyForm({ onSuccess }: { onSuccess: () => void }) {
  const [apiError, setApiError] = useState('')
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<CompanyValues>({ resolver: zodResolver(companySchema), defaultValues: { password: '', confirmPassword: '', companyDescription: '' } })
  const password = useWatch({ control, name: 'password' })
  async function submit(values: CompanyValues) { setApiError(''); try { await registerAccount({ companyName: values.companyName.trim(), email: values.email.trim(), password: values.password, role: 'COMPANY', ...(values.companyDescription.trim() ? { companyDescription: values.companyDescription.trim() } : {}) }); onSuccess() } catch (error) { setApiError(getAuthErrorMessage(error, 'register')) } }
  return <form onSubmit={handleSubmit(submit)} noValidate><FormError message={apiError} />
    <TextField label="Nama Perusahaan" autoComplete="organization" {...register('companyName')} error={errors.companyName?.message} />
    <TextField label="Email" type="email" autoComplete="email" {...register('email')} error={errors.email?.message} />
    <PasswordField label="Kata Sandi" autoComplete="new-password" {...register('password')} error={errors.password?.message} />
    <PasswordRequirements password={password} />
    <PasswordField label="Konfirmasi Kata Sandi" autoComplete="new-password" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
    <div className="form-field"><label htmlFor="companyDescription">Deskripsi Perusahaan <span>(Opsional)</span></label><textarea id="companyDescription" rows={4} {...register('companyDescription')} />{errors.companyDescription && <p className="field-error" role="alert">{errors.companyDescription.message}</p>}</div>
    <SubmitButton pending={isSubmitting} />
  </form>
}

function FormError({ message }: { message: string }) { return message ? <div className="api-error" role="alert">{message}</div> : null }
function SubmitButton({ pending }: { pending: boolean }) { return <button className="primary-button" disabled={pending}>{pending ? 'Sedang membuat akun...' : 'Buat Akun'}</button> }
