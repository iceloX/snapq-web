/**
 * Authentication Service
 * Handles user authentication, token management, and session storage
 */

import { api } from './api'

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
 * Authentication service
 */
export const authService = {
  /**
   * Login user with credentials
   * @param {string} email - User's email or username
   * @param {string} password - User's password
   * @param {boolean} rememberMe - Whether to persist session
   * @returns {Promise<{ user: object, token: string }>}
   */
  async login(email, password, rememberMe = false) {
    const data = await api.post('/auth/login', { email, password, rememberMe })

    const { token, user } = data

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
      await api.post('/auth/logout')
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
    const data = await api.post('/auth/refresh')
    const { token } = data
    tokenStorage.setToken(token, tokenStorage.getRememberMe())
    return token
  }
}

export default authService
