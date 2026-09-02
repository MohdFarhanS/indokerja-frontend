import { z } from 'zod'

export const passwordRequirements = (password: string) => ({
  length: password.length >= 12,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  digit: /[0-9]/.test(password),
  symbol: /[^A-Za-z0-9\s]/.test(password),
  bytes: new TextEncoder().encode(password).length <= 72,
})

export const registrationPasswordSchema = z.string()
  .min(12, 'Kata sandi minimal 12 karakter.')
  .refine((value) => new TextEncoder().encode(value).length <= 72, 'Kata sandi terlalu panjang (maksimal 72 byte UTF-8).')
  .regex(/[A-Z]/, 'Kata sandi harus mengandung huruf besar.')
  .regex(/[a-z]/, 'Kata sandi harus mengandung huruf kecil.')
  .regex(/[0-9]/, 'Kata sandi harus mengandung angka.')
  .regex(/[^A-Za-z0-9\s]/, 'Kata sandi harus mengandung simbol.')
