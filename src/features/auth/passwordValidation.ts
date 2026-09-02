import { z } from 'zod'

export function isWithinPasswordByteLimit(password: string) {
  return new TextEncoder().encode(password).length <= 72
}

export const passwordRequirements = (password: string) => ({
  length: password.length >= 12,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  digit: /[0-9]/.test(password),
  symbol: /[^A-Za-z0-9\s]/.test(password),
  bytes: isWithinPasswordByteLimit(password),
})

export const registrationPasswordSchema = z.string()
  .min(12, 'Kata sandi minimal 12 karakter.')
  .refine(isWithinPasswordByteLimit, 'Kata sandi terlalu panjang (maksimal 72 byte UTF-8).')
  .regex(/[A-Z]/, 'Kata sandi harus mengandung huruf besar.')
  .regex(/[a-z]/, 'Kata sandi harus mengandung huruf kecil.')
  .regex(/[0-9]/, 'Kata sandi harus mengandung angka.')
  .regex(/[^A-Za-z0-9\s]/, 'Kata sandi harus mengandung simbol.')
