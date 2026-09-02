import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { PasswordField } from '../../components/PasswordField'
import { RequiredFieldsNote } from '../../components/RequiredField'
import { TextField } from '../../components/TextField'
import { useAuth } from '../../hooks/useAuth'
import { getAuthErrorMessage } from './apiError'

const schema = z.object({
  email: z.string().trim().email('Masukkan alamat email yang valid.'),
  password: z.string().min(1, 'Kata sandi wajib diisi.'),
})
type LoginValues = z.infer<typeof schema>

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [apiError, setApiError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: LoginValues) {
    setApiError('')
    try {
      const loggedInUser = await login(values)
      const requested = (location.state as { from?: string } | null)?.from
      const ownRoute = loggedInUser.role === 'JOB_SEEKER' ? '/job-seeker' : '/company'
      navigate(requested === ownRoute ? requested : ownRoute, { replace: true })
    } catch (error) { setApiError(getAuthErrorMessage(error, 'login')) }
  }

  return <main className="auth-layout login-layout">
    <section className="marketing-panel" aria-labelledby="brand-heading">
      <div><p className="brand brand-light">Indo<span>Kerja</span></p>
        <p id="brand-heading" className="marketing-heading">Temukan pekerjaan.<br />Kelola lamaran.</p>
        <p>Satu tempat untuk melihat peluang kerja dan mengikuti proses lamaran Anda.</p>
      </div><div className="brand-decoration" aria-hidden="true" />
    </section>
    <section className="auth-panel"><div className="auth-card">
      <p className="brand mobile-brand">Indo<span>Kerja</span></p>
      <h1>Masuk</h1><p className="auth-intro">Selamat datang kembali di IndoKerja</p>
      {apiError && <div className="api-error" role="alert">{apiError}</div>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <RequiredFieldsNote />
        <TextField label="Email" type="email" autoComplete="email" required {...register('email')} error={errors.email?.message} />
        <PasswordField label="Kata Sandi" autoComplete="current-password" required {...register('password')} error={errors.password?.message} />
        <button className="primary-button" disabled={isSubmitting}>{isSubmitting ? 'Sedang masuk...' : 'Masuk'}</button>
      </form>
      <p className="auth-switch">Belum punya akun? <Link to="/register">Buat akun</Link></p>
    </div></section>
  </main>
}
