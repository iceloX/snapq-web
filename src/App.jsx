import { Routes, Route, Navigate } from 'react-router-dom'
import { authService } from './services/auth.service'
import Index from './views/Index'
import Admin from './views/Admin'
import styles from './App.module.css'

function getHomePath() {
  const user = authService.getCurrentUser()
  if (!user) return '/index'
  return user.role === 'admin' ? '/admin' : '/index'
}

function App() {
  return (
    <div className={styles.appContainer}>
      <Routes>
        <Route path="/index" element={<Index />} />
        <Route path="/admin/*" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={getHomePath()} replace />} />
      </Routes>
    </div>
  )
}

// Protected Route - 需要登录才能访问，且校验角色权限
function ProtectedRoute({ children, role }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/index" replace />
  }
  if (role) {
    const user = authService.getCurrentUser()
    if (user?.role !== role) {
      return <Navigate to={getHomePath()} replace />
    }
  }
  return children
}

export default App
