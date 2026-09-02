import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { createJob } from '../../api/jobs.api'
import { RequiredFieldsNote, RequiredIndicator } from '../../components/RequiredField'
import { PageHeader } from '../../components/PageHeader'
import type { CreateJobPayload, JobType } from '../../types'
import { formatJobType } from '../../utils/formatters'

const jobTypes: JobType[] = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']
const createJobSchema = z.object({
  title: z.string().trim().min(1, 'Judul lowongan wajib diisi.').max(150, 'Judul lowongan maksimal 150 karakter.'),
  location: z.string().trim().min(1, 'Lokasi wajib diisi.').max(150, 'Lokasi maksimal 150 karakter.'),
  salary: z.number({ error: 'Gaji wajib diisi.' }).int('Gaji harus berupa angka bulat.').positive('Gaji harus lebih dari Rp0.').max(2_147_483_647, 'Gaji melebihi batas yang diperbolehkan.'),
  jobType: z.enum(jobTypes, { error: 'Pilih tipe pekerjaan.' }),
  description: z.string().trim().min(1, 'Deskripsi pekerjaan wajib diisi.').max(10_000, 'Deskripsi maksimal 10.000 karakter.'),
})
type CreateJobValues = z.infer<typeof createJobSchema>

export function CreateJobPage() {
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState<{ title: string; message: string } | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateJobValues>({
    resolver: zodResolver(createJobSchema),
    defaultValues: { title: '', location: '', description: '' },
  })

  async function submit(values: CreateJobValues) {
    setApiError(null)
    const payload: CreateJobPayload = {
      title: values.title.trim(), location: values.location.trim(), salary: values.salary,
      jobType: values.jobType, description: values.description.trim(),
    }
    try { await createJob(payload); setSuccess(true) } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 400) setApiError({ title: 'Data lowongan belum valid.', message: 'Periksa kembali field yang Anda isi.' })
      else setApiError({ title: 'Lowongan belum dapat dibuat.', message: 'Silakan periksa data dan coba lagi.' })
    }
  }

  if (success) return <section className="success-card company-success-card"><div className="success-icon" aria-hidden="true">✓</div>
    <h1>Lowongan berhasil dibuat.</h1><p>Lowongan Anda sudah tersedia untuk pencari kerja.</p>
    <Link className="primary-button button-link" to="/company/jobs">Lihat Lowongan Saya</Link></section>

  return <><PageHeader eyebrow="Perusahaan" title="Buat Lowongan" description="Publikasikan peluang kerja baru untuk kandidat." />
    <section className="company-form-card">
      {apiError && <div className="api-error" role="alert"><strong>{apiError.title}</strong><p>{apiError.message}</p></div>}
      <form onSubmit={handleSubmit(submit)} noValidate>
        <RequiredFieldsNote />
        <Field label="Judul Lowongan" id="title" required error={errors.title?.message}><input id="title" autoComplete="off" required aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'title-error' : undefined} {...register('title')} /></Field>
        <Field label="Lokasi" id="location" required error={errors.location?.message}><input id="location" autoComplete="address-level2" required aria-invalid={Boolean(errors.location)} aria-describedby={errors.location ? 'location-error' : undefined} {...register('location')} /></Field>
        <Field label="Gaji per Bulan" id="salary" required error={errors.salary?.message} help="Gaji bulanan dalam Rupiah. Contoh: 8000000">
          <input id="salary" type="number" min="1" max="2147483647" step="1" inputMode="numeric" required aria-invalid={Boolean(errors.salary)} aria-describedby={errors.salary ? 'salary-error salary-help' : 'salary-help'} {...register('salary', { valueAsNumber: true })} />
        </Field>
        <Field label="Tipe Pekerjaan" id="jobType" required error={errors.jobType?.message}><select id="jobType" defaultValue="" required aria-invalid={Boolean(errors.jobType)} aria-describedby={errors.jobType ? 'jobType-error' : undefined} {...register('jobType')}>
          <option value="" disabled>Pilih tipe pekerjaan</option>{jobTypes.map((type) => <option key={type} value={type}>{formatJobType(type)}</option>)}</select></Field>
        <Field label="Deskripsi Pekerjaan" id="description" required error={errors.description?.message}><textarea id="description" rows={8} required aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? 'description-error' : undefined} {...register('description')} /></Field>
        <div className="form-actions"><Link className="secondary-link" to="/company/jobs">Batal</Link>
          <button className="primary-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Membuat lowongan...' : 'Buat Lowongan'}</button></div>
      </form>
    </section>
  </>
}

function Field({ label, id, required, error, help, children }: { label: string; id: string; required?: boolean; error?: string; help?: string; children: ReactNode }) {
  return <div className="form-field"><label htmlFor={id}>{label}{required && <RequiredIndicator />}</label>{children}
    {help && <p className="field-help" id={`${id}-help`}>{help}</p>}{error && <p className="field-error" id={`${id}-error`} role="alert">{error}</p>}</div>
}
