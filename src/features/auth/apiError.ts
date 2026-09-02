import axios from 'axios'

export function getAuthErrorMessage(error: unknown, flow: 'login' | 'register') {
  if (!axios.isAxiosError(error)) return 'Terjadi kesalahan. Silakan coba lagi.'
  if (flow === 'login' && error.response?.status === 401) return 'Email atau kata sandi salah.'
  if (flow === 'register' && error.response?.status === 409) return 'Email tersebut sudah terdaftar.'
  return 'Terjadi kesalahan. Silakan coba lagi.'
}
