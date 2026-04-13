import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { authService } from '../services/auth.service'
import styles from './Login.module.css'

/* ── Closed-eye arc helper ── */
function ClosedEyes({ pairs }) {
  return pairs.map(([cx, cy, r], i) => (
    <path
      key={i}
      d={`M${cx - r * 0.35},${cy} Q${cx},${cy + r * 0.3} ${cx + r * 0.35},${cy}`}
      stroke="#2B2B2B"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
      className={styles.closedEye}
    />
  ))
}

/* ── Open-eye helper ── */
function OpenEyes({ pairs }) {
  return pairs.map(([cx, cy, r], i) => (
    <circle
      key={i}
      data-pupil
      cx={cx} cy={cy} r={r}
      fill="#2B2B2B"
      data-cx={cx} data-cy={cy}
      className={styles.pupil}
    />
  ))
}

/* ── Inline SVG Illustration with eye-tracking ── */
function Illustration({ eyesClosed }) {
  const svgRef = useRef(null)
  const rafRef = useRef(null)

  const movePupils = useCallback((mx, my) => {
    const svg = svgRef.current
    if (!svg) return

    const rect = svg.getBoundingClientRect()
    const scaleX = 756 / rect.width
    const scaleY = 857 / rect.height
    const svgX = (mx - rect.left) * scaleX
    const svgY = (my - rect.top) * scaleY

    const MAX_MOVE = 5
    const pupils = svg.querySelectorAll('[data-pupil]')

    pupils.forEach(pupil => {
      const cx = parseFloat(pupil.getAttribute('data-cx'))
      const cy = parseFloat(pupil.getAttribute('data-cy'))
      const group = pupil.closest('[data-tx]')
      const tx = parseFloat(group.getAttribute('data-tx'))
      const ty = parseFloat(group.getAttribute('data-ty'))

      const px = tx + cx
      const py = ty + cy
      const dx = svgX - px
      const dy = svgY - py
      const dist = Math.sqrt(dx * dx + dy * dy)
      const clampDist = Math.min(dist, 120)
      const ratio = (clampDist / 120) * MAX_MOVE
      const angle = Math.atan2(dy, dx)

      pupil.setAttribute('cx', cx + Math.cos(angle) * ratio)
      pupil.setAttribute('cy', cy + Math.sin(angle) * ratio)
    })
  }, [])

  useEffect(() => {
    if (eyesClosed) return
    const handleMouseMove = (e) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => movePupils(e.clientX, e.clientY))
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [eyesClosed, movePupils])

  // Reset pupils to center when eyes close
  useEffect(() => {
    if (!eyesClosed) return
    const svg = svgRef.current
    if (!svg) return
    const pupils = svg.querySelectorAll('[data-pupil]')
    pupils.forEach(p => {
      p.setAttribute('cx', p.getAttribute('data-cx'))
      p.setAttribute('cy', p.getAttribute('data-cy'))
    })
  }, [eyesClosed])

  const eye = eyesClosed ? 'closed' : 'open'

  return (
    <svg ref={svgRef} viewBox="0 0 756 857" xmlns="http://www.w3.org/2000/svg" className={styles.leftImage} aria-hidden="true">
      <rect width="756" height="857" fill="#F4C542" />

      <path d="M0,0 L756,0 L756,400 C600,600 350,200 0,450 Z" fill="#11B5A4" />
      <path d="M0,0 L400,0 C380,250 200,400 0,350 Z" fill="#349C73" />
      <path d="M756,200 C500,200 450,600 600,857 L756,857 Z" fill="#F18D3F" />
      <path d="M756,550 C550,550 500,750 650,857 L756,857 Z" fill="#8764F2" />
      <path d="M0,400 C300,350 450,600 400,857 L0,857 Z" fill="#E85B9E" />

      {/* Monster 1 */}
      <g transform="translate(90, 150) rotate(15)" data-tx="90" data-ty="150">
        {eye === 'open' ? (
          <>
            <path d="M-10,0 C10,-20 40,-20 50,0 C40,10 10,10 -10,0 Z" fill="#FFFFFF" />
            <path d="M60,-5 C80,-25 110,-25 120,-5 C110,5 80,5 60,-5 Z" fill="#FFFFFF" />
            <OpenEyes pairs={[[20, -3, 8], [95, -8, 8]]} />
          </>
        ) : (
          <ClosedEyes pairs={[[20, 0, 30], [95, -5, 30]]} />
        )}
        <path d="M30,35 Q57,48 85,32" stroke="#2B2B2B" strokeWidth="7" strokeLinecap="round" fill="none" />
      </g>

      {/* Monster 2 */}
      <g transform="translate(420, 120) rotate(20)" data-tx="420" data-ty="120">
        {eye === 'open' ? (
          <>
            <circle cx="0" cy="0" r="25" fill="#FFFFFF" />
            <circle cx="65" cy="-20" r="28" fill="#FFFFFF" />
            <OpenEyes pairs={[[-5, 5, 10], [60, -15, 10]]} />
          </>
        ) : (
          <ClosedEyes pairs={[[0, 0, 25], [65, -20, 28]]} />
        )}
        <path d="M42,18 C32,16 26,24 32,28 C26,32 32,40 42,38" stroke="#2B2B2B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* Monster 3 */}
      <g transform="translate(200, 600) rotate(-10)" data-tx="200" data-ty="600">
        {eye === 'open' ? (
          <>
            <circle cx="0" cy="0" r="32" fill="#FFFFFF" />
            <circle cx="75" cy="20" r="30" fill="#FFFFFF" />
            <OpenEyes pairs={[[10, 15, 12], [60, 25, 12]]} />
          </>
        ) : (
          <ClosedEyes pairs={[[0, 0, 32], [75, 20, 30]]} />
        )}
        <circle cx="20" cy="65" r="10" stroke="#2B2B2B" strokeWidth="8" fill="none" />
      </g>

      {/* Monster 4 */}
      <g transform="translate(400, 480) rotate(-5)" data-tx="400" data-ty="480">
        {eye === 'open' ? (
          <>
            <circle cx="0" cy="0" r="32" fill="#FFFFFF" />
            <circle cx="75" cy="15" r="34" fill="#FFFFFF" />
            <OpenEyes pairs={[[-15, -5, 12], [60, 10, 12]]} />
          </>
        ) : (
          <ClosedEyes pairs={[[0, 0, 32], [75, 15, 34]]} />
        )}
        <path d="M30,-45 C50,-55 70,-50 80,-35" stroke="#2B2B2B" strokeWidth="8" strokeLinecap="round" fill="none" />
      </g>

      {/* Monster 5 */}
      <g transform="translate(580, 400) rotate(-10)" data-tx="580" data-ty="400">
        {eye === 'open' ? (
          <>
            <circle cx="0" cy="0" r="25" fill="#FFFFFF" />
            <circle cx="60" cy="-20" r="26" fill="#FFFFFF" />
            <OpenEyes pairs={[[-6, 6, 10], [55, -14, 10]]} />
          </>
        ) : (
          <ClosedEyes pairs={[[0, 0, 25], [60, -20, 26]]} />
        )}
        <path d="M15,30 C25,50 55,40 60,15 C45,25 30,25 15,30 Z" fill="#2B2B2B" stroke="#2B2B2B" strokeWidth="6" />
      </g>

      {/* Monster 6 */}
      <g transform="translate(620, 700) rotate(5)" data-tx="620" data-ty="700">
        {eye === 'open' ? (
          <>
            <circle cx="0" cy="0" r="25" fill="#FFFFFF" />
            <circle cx="65" cy="-15" r="27" fill="#FFFFFF" />
            <OpenEyes pairs={[[-6, 6, 10], [60, -10, 10]]} />
          </>
        ) : (
          <ClosedEyes pairs={[[0, 0, 25], [65, -15, 27]]} />
        )}
        <path d="M10,40 Q25,30 35,40 T60,35" stroke="#2B2B2B" strokeWidth="8" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  )
}

/* ── Google Logo SVG ── */
function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  )
}

/* ── Eye Icon SVG ── */
function EyeIcon({ visible }) {
  if (visible) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    )
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

/* ── Main Login Component ── */
function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [emailError, setEmailError] = useState('')

  const validateEmail = (value) => {
    if (!value) return ''
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(value) ? '' : '请输入有效的邮箱地址'
  }

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email))
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (emailError) setEmailError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      message.warning('请输入邮箱')
      return
    }
    if (!password) {
      message.warning('请输入密码')
      return
    }
    const emailErr = validateEmail(email)
    if (emailErr) {
      setEmailError(emailErr)
      return
    }
    setLoading(true)
    try {
      const { user } = await authService.login(
        email,
        password,
        rememberMe
      )
      navigate(user.role === 'admin' ? '/admin' : '/index')
    } catch (error) {
      console.error('Login failed:', error)
      message.error(error.message || '登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginWrapper}>
      {/* ── Left Panel: Illustration ── */}
      <div className={styles.leftPanel}>
        <Illustration eyesClosed={passwordFocused} />
      </div>

      {/* ── Right Panel: Login Form ── */}
      <div className={styles.rightPanel}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h1 className={styles.title}>欢迎回来！</h1>
          <p className={styles.subtitle}>请输入您的登录信息</p>

          {/* Email */}
          <div className={styles.field}>
            <label className={styles.label}>邮箱</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              placeholder="请输入邮箱"
            />
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label className={styles.label}>密码</label>
            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder="请输入密码"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
              >
                <EyeIcon visible={!showPassword} />
              </button>
            </div>
          </div>

          {/* Remember / Forgot */}
          <div className={styles.helpers}>
            <label className={styles.remember}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              <span>记住我 30 天</span>
            </label>
            <a className={styles.forgotLink}>忘记密码？</a>
          </div>

          {/* Buttons */}
          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? '登录中...' : '登 录'}
          </button>
          <button type="button" className={styles.googleBtn}>
            <GoogleLogo />
            <span>使用 Google 登录</span>
          </button>

          {/* Footer */}
          <p className={styles.footer}>
            还没有账号？<a className={styles.signUpLink}>立即注册</a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
