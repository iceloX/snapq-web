import { useState } from 'react'
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom'
import { Layout, Menu, Button, Avatar, Dropdown, message } from 'antd'
import {
  DashboardOutlined,
  UserOutlined,
  PictureOutlined,
  CloudServerOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons'
import { authService } from '../services/auth.service'
import Dashboard from './admin/Dashboard'
import Photos from './admin/Photos'
import Storage from './admin/Storage'
import UserManage from './admin/UserManage'

const { Sider, Header, Content } = Layout

const menuItems = [
  { key: '/admin/dashboard', icon: <DashboardOutlined />, label: '数据概览' },
  { key: '/admin/photos', icon: <PictureOutlined />, label: '照片管理' },
  { key: '/admin/storage', icon: <CloudServerOutlined />, label: '存储源' },
  { key: '/admin/users', icon: <UserOutlined />, label: '用户管理' }
]

function Admin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const currentUser = authService.getCurrentUser()

  const handleLogout = async () => {
    await authService.logout()
    navigate('/login')
    message.success('已成功退出登录')
  }

  const userMenuItems = [
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: handleLogout }
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        theme="dark"
        width={220}
      >
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: collapsed ? 16 : 20, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {collapsed ? 'SQ' : 'SnapQ'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar icon={<UserOutlined />} />
              <span>{currentUser?.username || '管理员'}</span>
            </div>
          </Dropdown>
        </Header>

        <Content style={{ margin: 24, padding: 24, background: '#fff', borderRadius: 8, minHeight: 280 }}>
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="photos" element={<Photos />} />
            <Route path="storage" element={<Storage />} />
            <Route path="users" element={<UserManage />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default Admin
