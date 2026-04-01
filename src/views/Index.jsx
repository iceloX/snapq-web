import { useNavigate } from 'react-router-dom'
import { Card, Descriptions, Tag, Button, message } from 'antd'
import styles from './Index.module.css'

function Index() {
  const navigate = useNavigate()

  const user = {
    username: localStorage.getItem('username') || 'admin'
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    navigate('/login')
    message.success('已成功退出登录')
  }

  return (
    <div className={styles.indexContainer}>
      <Card className={styles.welcomeCard}>
        <div className={styles.welcomeHeader}>
          <h1>欢迎使用 SnapQ</h1>
          <p className={styles.subtitle}>登录成功！</p>
        </div>

        <div className={styles.userInfo}>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="用户名">
              <Tag color="blue">{user.username}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="登录状态">
              <Tag color="success">已认证</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="最后登录">
              <Tag>{new Date().toLocaleString()}</Tag>
            </Descriptions.Item>
          </Descriptions>
        </div>

        <div className={styles.actionButtons}>
          <Button type="primary" size="large" onClick={() => message.info('功能开发中...')}>
            开始使用
          </Button>
          <Button type="primary" danger size="large" onClick={handleLogout}>
            退出登录
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Index
