/**
 * Authentication Service
 * Handles user authentication, token management, and session storage
 */

// API base URL - configure based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// Token storage keys
const TOKEN_KEY = 'auth_token'
const USER_KEY = 'user_data'
const REMEMBER_ME_KEY = 'remember_me'

/**
 * Secure token storage utility
 * Uses sessionStorage by default, localStorage when "remember me" is enabled
 */
const tokenStorage = {
  getStorage() {
    return localStorage.getItem(REMEMBER_ME_KEY) === 'true' ? localStorage : sessionStorage
  },

  getToken() {
    return this.getStorage().getItem(TOKEN_KEY)
  },

  setToken(token, rememberMe = false) {
    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem(TOKEN_KEY, token)
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
  },

  getUser() {
    const userData = this.getStorage().getItem(USER_KEY)
    return userData ? JSON.parse(userData) : null
  },

  setUser(user, rememberMe = false) {
    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem(USER_KEY, JSON.stringify(user))
  },

  removeUser() {
    localStorage.removeItem(USER_KEY)
    sessionStorage.removeItem(USER_KEY)
  },

  setRememberMe(value) {
    localStorage.setItem(REMEMBER_ME_KEY, String(value))
  },

  getRememberMe() {
    return localStorage.getItem(REMEMBER_ME_KEY) === 'true'
  },

  clearAll() {
    this.removeToken()
    this.removeUser()
    localStorage.removeItem(REMEMBER_ME_KEY)
  }
}

/**
 * API request helper with authentication
 */
async function apiRequest(endpoint, options = {}) {
  const token = tokenStorage.getToken()

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Authentication service
 */
export const authService = {
  /**
   * Login user with credentials
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @param {boolean} rememberMe - Whether to persist session
   * @returns {Promise<{ user: object, token: string }>}
   */
  async login(username, password, rememberMe = false) {
    // In development, use mock authentication
    // TODO: Replace with actual API call in production
    if (import.meta.env.DEV) {
      return this.mockLogin(username, password, rememberMe)
    }

    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, rememberMe })
    })

    const { user, token } = response

    tokenStorage.setToken(token, rememberMe)
    tokenStorage.setUser(user, rememberMe)
    tokenStorage.setRememberMe(rememberMe)

    return { user, token }
  },

  /**
   * Mock login for development
   * TODO: Remove in production
   */
  async mockLogin(username, password, rememberMe = false) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock credentials (replace with actual API in production)
    const validCredentials = [
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'user', password: 'user123', role: 'user' }
    ]

    const validUser = validCredentials.find(
      cred => cred.username === username && cred.password === password
    )

    if (!validUser) {
      throw new Error('用户名或密码错误')
    }

    // Generate mock token
    const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const user = {
      id: validUser.username === 'admin' ? 1 : 2,
      username: validUser.username,
      role: validUser.role,
      loginTime: new Date().toISOString()
    }

    tokenStorage.setToken(token, rememberMe)
    tokenStorage.setUser(user, rememberMe)
    tokenStorage.setRememberMe(rememberMe)

    return { user, token }
  },

  /**
   * Logout current user
   */
  async logout() {
    try {
      // Call logout API if available
      if (!import.meta.env.DEV) {
        await apiRequest('/auth/logout', { method: 'POST' })
      }
    } catch (error) {
      console.warn('Logout API call failed:', error)
    } finally {
      tokenStorage.clearAll()
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!tokenStorage.getToken()
  },

  /**
   * Get current user data
   * @returns {object|null}
   */
  getCurrentUser() {
    return tokenStorage.getUser()
  },

  /**
   * Get current auth token
   * @returns {string|null}
   */
  getToken() {
    return tokenStorage.getToken()
  },

  /**
   * Refresh authentication token
   * @returns {Promise<string>}
   */
  async refreshToken() {
    if (import.meta.env.DEV) {
      const user = this.getCurrentUser()
      if (!user) throw new Error('No user session')
      const newToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      tokenStorage.setToken(newToken, tokenStorage.getRememberMe())
      return newToken
    }

    const response = await apiRequest('/auth/refresh', { method: 'POST' })
    const { token } = response
    tokenStorage.setToken(token, tokenStorage.getRememberMe())
    return token
  }
}

export default authService
