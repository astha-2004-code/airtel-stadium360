import axios from 'axios'

// Normalize API base URL: handles both relative paths ("/api/v1") and absolute backend URLs (e.g. Render)
const rawUrl = (import.meta.env.VITE_API_URL || '/api/v1').trim()
export const API_BASE_URL = rawUrl.endsWith('/api/v1')
  ? rawUrl
  : rawUrl.endsWith('/')
    ? `${rawUrl.slice(0, -1)}/api/v1`
    : rawUrl.startsWith('http')
      ? `${rawUrl}/api/v1`
      : rawUrl

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('airtel_stadium360_jwt')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for clear errors & session handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('airtel_stadium360_jwt')
      window.dispatchEvent(new Event('auth:unauthorized'))
    }
    console.error('API Error:', error?.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default apiClient
