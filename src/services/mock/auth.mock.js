/**
 * Auth Module Mock Data
 * Simulates RESTful API responses for authentication
 */

/**
 * Generate a mock JWT-like token
 */
function generateToken(userId) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({
    sub: userId,
    iat: Date.now(),
    exp: Date.now() + 3600 * 1000
  }))
  const signature = Math.random().toString(36).substr(2, 12)
  return `${header}.${payload}.${signature}`
}

/**
 * Mock user database
 */
const mockUsers = [
  {
    id: 1,
    email: 'admin@snapq.com',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    avatar: null,
    status: 'active'
  },
  {
    id: 2,
    email: 'user@snapq.com',
    username: 'user',
    password: 'user123',
    role: 'user',
    avatar: null,
    status: 'active'
  }
]

/**
 * Auth mock route handlers
 * Each handler receives request data and returns the `data` field of the response
 */
export const authMocks = {
  /**
   * POST /auth/login
   * Request: { email, password, rememberMe }
   * Response: { token, user }
   */
  'POST /auth/login': (data) => {
    const { email, password } = data

    if (!email || !password) {
      throw createError(40001, '邮箱和密码不能为空')
    }

    const user = mockUsers.find(u => u.email === email || u.username === email)

    if (!user) {
      throw createError(40101, '用户名或密码错误')
    }

    if (user.password !== password) {
      throw createError(40101, '用户名或密码错误')
    }

    if (user.status === 'disabled') {
      throw createError(40102, '账号已被禁用')
    }

    const token = generateToken(user.id)

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
        loginTime: new Date().toISOString()
      }
    }
  },

  /**
   * POST /auth/logout
   * Request: {} (Bearer Token in header)
   * Response: null
   */
  'POST /auth/logout': () => {
    return null
  },

  /**
   * POST /auth/refresh
   * Request: {} (Bearer Token in header)
   * Response: { token, expiresIn }
   */
  'POST /auth/refresh': () => {
    const newToken = generateToken(1)
    return {
      token: newToken,
      expiresIn: 3600
    }
  },

  /**
   * GET /auth/me
   * Request: (Bearer Token in header)
   * Response: { user }
   */
  'GET /auth/me': () => {
    // Return first mock user as current user
    const user = mockUsers[0]
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar: user.avatar,
      loginTime: new Date().toISOString()
    }
  }
}

/**
 * Create a mock error that api.js can handle
 */
function createError(code, message) {
  const error = new Error(message)
  error.code = code
  error.isMockError = true
  return error
}
