import { useState } from 'react'
import { Table, Tag, Button, Input, Space, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const mockUsers = [
  { id: 1, username: 'admin', email: 'admin@snapq.com', role: 'admin', status: 'active', createdAt: '2026-03-25 10:00:00' },
  { id: 2, username: 'user1', email: 'user1@snapq.com', role: 'user', status: 'active', createdAt: '2026-04-01 14:30:00' },
  { id: 3, username: 'user2', email: 'user2@snapq.com', role: 'user', status: 'active', createdAt: '2026-04-03 09:15:00' },
  { id: 4, username: 'user3', email: 'user3@snapq.com', role: 'user', status: 'disabled', createdAt: '2026-04-05 16:45:00' },
  { id: 5, username: 'user4', email: 'user4@snapq.com', role: 'user', status: 'active', createdAt: '2026-04-08 11:20:00' }
]

const columns = [
  { title: 'ID', dataIndex: 'id', width: 60 },
  { title: '用户名', dataIndex: 'username' },
  { title: '邮箱', dataIndex: 'email' },
  {
    title: '角色',
    dataIndex: 'role',
    render: (role) => <Tag color={role === 'admin' ? 'orange' : 'blue'}>{role === 'admin' ? '管理员' : '用户'}</Tag>
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (status) => <Tag color={status === 'active' ? 'success' : 'error'}>{status === 'active' ? '正常' : '已禁用'}</Tag>
  },
  { title: '注册时间', dataIndex: 'createdAt' },
  {
    title: '操作',
    key: 'action',
    width: 180,
    render: (_, record) => (
      <Space>
        <Button size="small" onClick={() => message.info('功能开发中...')}>编辑</Button>
        <Button size="small" danger onClick={() => message.info('功能开发中...')}>
          {record.status === 'active' ? '禁用' : '启用'}
        </Button>
      </Space>
    )
  }
]

function UserManage() {
  const [search, setSearch] = useState('')

  const filtered = mockUsers.filter(u =>
    u.username.includes(search) || u.email.includes(search)
  )

  return (
    <div>
      <h2 style={{ margin: '0 0 24px' }}>用户管理</h2>
      <Input
        placeholder="搜索用户名或邮箱"
        prefix={<SearchOutlined />}
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: 300, marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}

export default UserManage
