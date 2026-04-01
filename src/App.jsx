import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Index from './views/Index'
import styles from './App.module.css'

function App() {
  return (
    <div className={styles.appContainer}>
      <Routes>
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

// Protected Route - 需要登录才能访问
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isLoggedIn')
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Guest Route - 已登录用户重定向到首页
function GuestRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isLoggedIn')
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return children
}

export default App
