import axios from 'axios'

const TOKEN_KEY = 'token'
let sessionInvalidationHandler: (() => void) | null = null

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export function setSessionInvalidationHandler(handler: (() => void) | null) {
  sessionInvalidationHandler = handler
}

function isPublicAuthRequest(url?: string) {
  return url?.endsWith('/auth/login') || url?.endsWith('/auth/register')
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token && !isPublicAuthRequest(config.url)) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      if (!isPublicAuthRequest(error.config?.url) && tokenStorage.get()) {
        tokenStorage.clear()
        sessionInvalidationHandler?.()
      }
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
