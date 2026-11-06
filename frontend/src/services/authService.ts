/**
 * Airtel Stadium360 - Authentication Service
 * Communicates with backend /auth endpoints and manages JWT persistence.
 */
import { apiClient } from './api'
import {
  AuthToken,
  DemoAccount,
  LoginCredentials,
  RegisterData,
  User,
} from '../types/auth'

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

export const login = async (credentials: LoginCredentials): Promise<AuthToken> => {
  const resp = await apiClient.post<AuthToken>('/auth/login', credentials)
  if (resp.data.access_token) {
    setToken(resp.data.access_token)
  }
  return resp.data
}

export const register = async (data: RegisterData): Promise<AuthToken> => {
  const resp = await apiClient.post<AuthToken>('/auth/register', data)
  if (resp.data.access_token) {
    setToken(resp.data.access_token)
  }
  return resp.data
}

export const getProfile = async (): Promise<User> => {
  const resp = await apiClient.get<User>('/auth/me')
  return resp.data
}

export const updateProfile = async (
  data: Partial<Pick<User, 'full_name' | 'department' | 'phone'>>
): Promise<User> => {
  const resp = await apiClient.put<User>('/auth/me', data)
  return resp.data
}

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout')
  } catch (err) {
    // Ignore error if already expired
  } finally {
    removeToken()
  }
}

export const getDemoAccounts = async (): Promise<DemoAccount[]> => {
  const resp = await apiClient.get<DemoAccount[]>('/auth/demo-accounts')
  return resp.data
}
