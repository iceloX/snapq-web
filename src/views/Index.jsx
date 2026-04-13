import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Select, Avatar, Modal, Tag, Spin, message, notification } from 'antd'
import catLogo from '../assets/sneezing-cat.svg'
import { UserOutlined, LogoutOutlined, PictureOutlined, HeartOutlined, AppstoreOutlined, LoadingOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons'
import { authService } from '../services/auth.service'
import styles from './Index.module.css'

const initialPhotos = [
  { id: 10, name: '森林小屋', album: '风景', tags: ['森林', '建筑'], date: '2026-04-10', likes: 128, width: 400, height: 600, url: 'https://picsum.photos/id/10/400/600' },
  { id: 11, name: '河流', album: '风景', tags: ['自然', '河流'], date: '2026-04-09', likes: 86, width: 400, height: 267, url: 'https://picsum.photos/id/11/400/267' },
  { id: 15, name: '咖啡馆', album: '日常', tags: ['咖啡', '生活'], date: '2026-04-08', likes: 245, width: 400, height: 400, url: 'https://picsum.photos/id/15/400/400' },
  { id: 16, name: '时光隧道', album: '旅行', tags: ['建筑', '光影'], date: '2026-04-07', likes: 312, width: 400, height: 550, url: 'https://picsum.photos/id/16/400/550' },
  { id: 17, name: '海边木屋', album: '旅行', tags: ['海边', '木屋'], date: '2026-04-06', likes: 67, width: 400, height: 300, url: 'https://picsum.photos/id/17/400/300' },
  { id: 18, name: '音乐', album: '日常', tags: ['音乐', '乐器'], date: '2026-04-05', likes: 198, width: 400, height: 400, url: 'https://picsum.photos/id/18/400/400' },
  { id: 19, name: '海鸥', album: '动物', tags: ['鸟', '海边'], date: '2026-04-04', likes: 421, width: 400, height: 500, url: 'https://picsum.photos/id/19/400/500' },
  { id: 20, name: '云层', album: '风景', tags: ['天空', '云'], date: '2026-04-03', likes: 55, width: 400, height: 280, url: 'https://picsum.photos/id/20/400/280' },
  { id: 22, name: '山景', album: '旅行', tags: ['山', '自然'], date: '2026-04-02', likes: 23, width: 400, height: 640, url: 'https://picsum.photos/id/22/400/640' },
  { id: 24, name: '山顶', album: '旅行', tags: ['山顶', '风景'], date: '2026-04-01', likes: 376, width: 400, height: 320, url: 'https://picsum.photos/id/24/400/320' },
  { id: 28, name: '自然', album: '风景', tags: ['自然', '绿色'], date: '2026-03-31', likes: 142, width: 400, height: 500, url: 'https://picsum.photos/id/28/400/500' },
  { id: 29, name: '野花', album: '风景', tags: ['花', '自然'], date: '2026-03-30', likes: 89, width: 400, height: 350, url: 'https://picsum.photos/id/29/400/350' },
  { id: 36, name: '海岸线', album: '旅行', tags: ['海', '海岸'], date: '2026-03-29', likes: 203, width: 400, height: 580, url: 'https://picsum.photos/id/36/400/580' },
  { id: 37, name: '黄昏', album: '风景', tags: ['日落', '天空'], date: '2026-03-28', likes: 534, width: 400, height: 260, url: 'https://picsum.photos/id/37/400/260' },
  { id: 42, name: '城市建筑', album: '旅行', tags: ['城市', '建筑'], date: '2026-03-27', likes: 267, width: 400, height: 450, url: 'https://picsum.photos/id/42/400/450' }
]

const albums = ['全部', '旅行', '家庭', '宠物', '美食', '风景', '日常']

const photoNames = ['湖边小屋', '晨曦微露', '雨后彩虹', '星空银河', '古镇小巷', '海边礁石', '薰衣草田', '雪景', '瀑布', '竹林小径', '梯田风光', '草原日出', '沙漠驼影', '冰川湖', '热带雨林']

const photoIds = [10, 11, 15, 16, 17, 18, 19, 20, 22, 24, 28, 29, 36, 37, 42]

let nextId = 100

function generatePhotos(count) {
  const batch = []
  for (let i = 0; i < count; i++) {
    const picId = photoIds[(nextId + i) % photoIds.length]
    const h = [260, 300, 350, 400, 450, 500, 550, 600][(nextId + i) % 8]
    batch.push({
      id: nextId + i,
      name: photoNames[(nextId + i) % photoNames.length],
      album: albums[((nextId + i) % (albums.length - 1)) + 1],
      tags: ['风景', '自然'],
      date: new Date(Date.now() - (nextId + i) * 86400000).toISOString().split('T')[0],
      likes: Math.floor(Math.random() * 500) + 10,
      width: 400,
      height: h,
      url: `https://picsum.photos/id/${picId}/400/${h}`
    })
  }
  nextId += count
  return batch
}

function Index() {
  const navigate = useNavigate()
  const [photos, setPhotos] = useState(initialPhotos)
  const [selectedAlbum, setSelectedAlbum] = useState('全部')
  const [previewPhoto, setPreviewPhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [colCount, setColCount] = useState(5)
  const [darkMode, setDarkMode] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const sentinelRef = useRef(null)

  // Responsive column count
  useEffect(() => {
    const updateCols = () => {
      const w = window.innerWidth
      if (w <= 600) setColCount(2)
      else if (w <= 900) setColCount(3)
      else if (w <= 1200) setColCount(4)
      else setColCount(5)
    }
    updateCols()
    window.addEventListener('resize', updateCols)
    return () => window.removeEventListener('resize', updateCols)
  }, [])

  // Show test account notification (DEV only, not logged in)
  useEffect(() => {
    if (import.meta.env.DEV && !authService.isAuthenticated()) {
      notification.info({
        key: 'test-accounts-index',
        message: '测试账号',
        description: (
          <div style={{ lineHeight: '24px' }}>
            <div><strong>管理员：</strong>admin@snapq.com / admin123</div>
            <div><strong>用户：</strong>user@snapq.com / user123</div>
          </div>
        ),
        duration: 0,
        placement: 'bottomRight'
      })
    }
  }, [])

  // Distribute photos into columns (round-robin)
  const filtered = selectedAlbum === '全部'
    ? photos
    : photos.filter(p => p.album === selectedAlbum)

  const columns = useMemo(() => {
    const cols = Array.from({ length: colCount }, () => [])
    filtered.forEach((photo, i) => {
      cols[i % colCount].push(photo)
    })
    return cols
  }, [filtered, colCount])

  const currentUser = authService.getCurrentUser()
  const [authed, setAuthed] = useState(authService.isAuthenticated())
  const isLoggedIn = authed

  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出',
      content: '确定要退出登录吗？',
      okText: '退出',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: async () => {
        await authService.logout()
        setAuthed(false)
        navigate('/index')
        message.success('已成功退出登录')
      }
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!loginEmail || !loginPassword) {
      message.warning('请输入邮箱和密码')
      return
    }
    setLoginLoading(true)
    try {
      const { user } = await authService.login(loginEmail, loginPassword, false)
      message.success('登录成功')
      setAuthed(true)
      if (user.role === 'admin') {
        navigate('/admin')
      }
    } catch (err) {
      message.error(err.message || '登录失败')
    } finally {
      setLoginLoading(false)
    }
  }

  // Infinite scroll with Intersection Observer
  const handleLoadMore = useCallback(() => {
    if (loading) return
    setLoading(true)
    // Simulate API delay
    setTimeout(() => {
      setPhotos(prev => [...prev, ...generatePhotos(15)])
      setLoading(false)
    }, 800)
  }, [loading])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [handleLoadMore])

  return (
    <div className={`${styles.galleryPage} ${darkMode ? styles.dark : ''}`}>
      {/* Header hover trigger */}
      <div className={styles.headerTrigger} />
      {/* Header */}
      <header className={`${styles.header} ${isLoggedIn ? styles.headerCompact : ''} ${darkMode ? styles.headerDark : styles.headerLight}`}>
        {isLoggedIn ? (
          <>
            <img src={catLogo} alt="CatGallery Logo" className={styles.catLogo} />
            <div className={styles.headerRight}>
              <button className={styles.themeBtn} onClick={() => setDarkMode(v => !v)}>
                {darkMode ? <SunOutlined /> : <MoonOutlined />}
              </button>
              <Select
                value={selectedAlbum}
                onChange={setSelectedAlbum}
                variant="borderless"
                style={{ width: 130, color: darkMode ? '#fff' : '#1a1a1a' }}
                popupClassName={darkMode ? 'albumSelectDark' : ''}
                getPopupContainer={(trigger) => trigger.parentElement}
                options={albums.map(a => ({ value: a, label: a === '全部' ? '全部' : a }))}
              />
              <div className={styles.userArea} onClick={handleLogout} title="点击退出登录">
                <Avatar icon={<UserOutlined />} size={36} />
              </div>
            </div>
          </>
        ) : (
          <div className={styles.loginLayout}>
            <div className={styles.loginCatSide}>
              <img src={catLogo} alt="CatGallery" className={styles.loginCatImg} />
            </div>
            <form className={styles.loginForm} onSubmit={handleLogin}>
              <div className={styles.loginTitle}>
                CatGallery
              </div>
              <input
                className={styles.loginInput}
                type="email"
                placeholder="邮箱"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
              />
              <input
                className={styles.loginInput}
                type="password"
                placeholder="密码"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
              />
              <button className={styles.loginBtn} type="submit" disabled={loginLoading}>
                {loginLoading ? '登录中...' : '登 录'}
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Waterfall Grid */}
      <div className={styles.waterfall}>
        {columns.map((col, colIdx) => (
          <div key={colIdx} className={styles.waterfallCol}>
            {col.map((photo) => (
              <div
                key={photo.id}
                className={styles.photoItem}
                onClick={() => setPreviewPhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  className={styles.photoImg}
                  loading="lazy"
                />
                <div className={styles.photoOverlay}>
                  <span className={styles.likes}><HeartOutlined /> {photo.likes}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Loading sentinel */}
      <div ref={sentinelRef} className={styles.sentinel}>
        {loading && <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} />} />}
      </div>

      {/* Preview Modal */}
      <Modal
        open={!!previewPhoto}
        onCancel={() => setPreviewPhoto(null)}
        footer={null}
        width={680}
        centered
        closable
        styles={{ body: { padding: 0 } }}
      >
        {previewPhoto && (
          <div>
            <img
              src={previewPhoto.url.replace('/400/', '/800/')}
              alt={previewPhoto.name}
              className={styles.previewImg}
            />
            <div className={styles.previewInfo}>
              <div className={styles.previewHeader}>
                <Avatar icon={<UserOutlined />} />
                <div className={styles.previewMeta}>
                  <strong>{currentUser?.username || '用户'}</strong>
                  <span className={styles.previewDate}>{previewPhoto.date}</span>
                </div>
                <span className={styles.previewLikes}><HeartOutlined /> {previewPhoto.likes}</span>
              </div>
              <div className={styles.previewName}>{previewPhoto.name}</div>
              <div className={styles.previewTags}>
                {previewPhoto.tags.map(t => <Tag key={t} style={{ borderRadius: 20 }}>{t}</Tag>)}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Index
