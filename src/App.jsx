import { Routes, Route, Navigate } from 'react-router-dom'
import { authService } from './services/auth.service'
import Login from './components/Login'
import Index from './views/Index'
import Admin from './views/Admin'
import styles from './App.module.css'

/**
 * Get the home path for the current user based on their role
 */
function getHomePath() {
  const user = authService.getCurrentUser()
  return user?.role === 'admin' ? '/admin' : '/index'
}

function App() {
  return (
    <div className={styles.appContainer}>
      <Routes>
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/index" element={<ProtectedRoute role="user"><Index /></ProtectedRoute>} />
        <Route path="/admin/*" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={getHomePath()} replace />} />
      </Routes>
    </div>
  )
}

// Protected Route - 需要登录才能访问，且校验角色权限
function ProtectedRoute({ children, role }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  if (role) {
    const user = authService.getCurrentUser()
    if (user?.role !== role) {
      return <Navigate to={getHomePath()} replace />
    }
  }
  return children
}

// Guest Route - 已登录用户重定向到对应首页
function GuestRoute({ children }) {
  if (authService.isAuthenticated()) {
    return <Navigate to={getHomePath()} replace />
  }
  return children
}

export default App
