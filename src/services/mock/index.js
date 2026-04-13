/**
 * Mock Layer - Entry Point
 * Intercepts API requests in DEV environment with mock data
 */

import { authMocks } from './auth.mock'

/**
 * Mock route registry
 * Key format: "METHOD /path" (e.g. "POST /auth/login")
 */
const mockRoutes = {}

/**
 * Register mock routes from a module
 * @param {object} routes - { "METHOD /path": handler(data) => responseData }
 */
function registerRoutes(routes) {
  Object.assign(mockRoutes, routes)
}

// Register all mock modules
registerRoutes(authMocks)

/**
 * Mock interceptor - called by api.js in DEV mode
 * @param {string} method - HTTP method
 * @param {string} path - API path (e.g. '/auth/login')
 * @param {object} data - Request body
 * @returns {Promise<object>|null} Mock response data, or null if no mock matched
 */
export function mockInterceptor(method, path, data) {
  const key = `${method.toUpperCase()} ${path}`
  const handler = mockRoutes[key]

  if (!handler) return null

  // Simulate network delay (300-800ms)
  const delay = Math.floor(Math.random() * 500) + 300

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const result = handler(data)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    }, delay)
  })
}
