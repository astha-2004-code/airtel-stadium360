/**
 * Airtel Stadium360 - Authentication Service
 * Communicates with backend /api/v1/auth endpoints and manages JWT persistence.
 */
import axios from 'axios'
import {
  AuthToken,
  DemoAccount,
  LoginCredentials,
  RegisterData,
  User,
} from '../types/auth'

const API_BASE = '/api/v1/auth'
const TOKEN_KEY = 'airtel_stadium360_jwt'

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

// Global Axios Interceptor to attach JWT token
axios.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export const login = async (credentials: LoginCredentials): Promise<AuthToken> => {
  const resp = await axios.post<AuthToken>(`${API_BASE}/login`, credentials)
  if (resp.data.access_token) {
    setToken(resp.data.access_token)
  }
  return resp.data
}

export const register = async (data: RegisterData): Promise<AuthToken> => {
  const resp = await axios.post<AuthToken>(`${API_BASE}/register`, data)
  if (resp.data.access_token) {
    setToken(resp.data.access_token)
  }
  return resp.data
}

export const getProfile = async (): Promise<User> => {
  const resp = await axios.get<User>(`${API_BASE}/me`)
  return resp.data
}

export const updateProfile = async (
  data: Partial<Pick<User, 'full_name' | 'department' | 'phone'>>
): Promise<User> => {
  const resp = await axios.put<User>(`${API_BASE}/me`, data)
  return resp.data
}

export const logout = async (): Promise<void> => {
  try {
    await axios.post(`${API_BASE}/logout`)
  } catch (err) {
    // Ignore error if already expired
  } finally {
    removeToken()
  }
}

export const getDemoAccounts = async (): Promise<DemoAccount[]> => {
  const resp = await axios.get<DemoAccount[]>(`${API_BASE}/demo-accounts`)
  return resp.data
}
