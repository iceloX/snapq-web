/**
 * API Request Layer
 * Unified fetch wrapper with auth, error handling, and mock support
 */

import { mockInterceptor } from './mock'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

/**
 * Error code → Chinese message mapping
 */
const ERROR_MESSAGES = {
  0: 'success',
  40001: '请求参数错误',
  40101: '用户名或密码错误',
  40102: '账号已被禁用',
  40103: '登录已过期，请重新登录',
  40104: '认证信息无效',
  42901: '请求过于频繁，请稍后再试',
  50001: '服务器内部错误'
}

/**
 * Get stored auth token
 */
function getStoredToken() {
  const rememberMe = localStorage.getItem('remember_me') === 'true'
  const storage = rememberMe ? localStorage : sessionStorage
  return storage.getItem('auth_token')
}

/**
 * Unified API request method
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {string} path - API path (e.g. '/auth/login')
 * @param {object} [data] - Request body (for POST/PUT)
 * @param {object} [options] - Additional fetch options
 * @returns {Promise<object>} Response data
 */
export async function request(method, path, data = null, options = {}) {
  // DEV environment: intercept with mock
  if (import.meta.env.DEV) {
    const mockResponse = mockInterceptor(method, path, data)
    if (mockResponse !== null) {
      return mockResponse
    }
  }

  const url = `${API_BASE_URL}${path}`

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  const token = getStoredToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const fetchOptions = {
    method,
    headers,
    ...options
  }

  if (data && method !== 'GET') {
    fetchOptions.body = JSON.stringify(data)
  }

  const response = await fetch(url, fetchOptions)

  // Handle non-OK responses
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const code = errorBody?.code || 50001
    const message = errorBody?.message || ERROR_MESSAGES[code] || `请求失败 (${response.status})`
    const error = new Error(message)
    error.code = code
    error.status = response.status
    throw error
  }

  const result = await response.json()

  // Business-level error (code !== 0)
  if (result.code !== 0) {
    const message = result.message || ERROR_MESSAGES[result.code] || '请求失败'
    const error = new Error(message)
    error.code = result.code
    error.data = result.data
    throw error
  }

  return result.data
}

/**
 * Shorthand methods
 */
export const api = {
  get: (path, options) => request('GET', path, null, options),
  post: (path, data, options) => request('POST', path, data, options),
  put: (path, data, options) => request('PUT', path, data, options),
  delete: (path, options) => request('DELETE', path, null, options)
}

export default api
