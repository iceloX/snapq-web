// Test environment setup
import '@testing-library/jest-dom'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

global.localStorage = localStorageMock

// Mock ElMessage
global.ElMessage = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn()
}

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
  localStorageMock.clear()
})

// Cleanup after all tests
afterAll(() => {
  vi.resetAllMocks()
})