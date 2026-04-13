import { Row, Col, Card, Tag, Button, Badge, Progress, Descriptions, Space, message } from 'antd'
import {
  CloudOutlined,
  CloudServerOutlined,
  LaptopOutlined,
  SyncOutlined,
  LinkOutlined,
  DisconnectOutlined
} from '@ant-design/icons'

const storageSources = [
  {
    id: 1,
    name: 'Google 云盘',
    icon: <CloudOutlined style={{ fontSize: 32, color: '#4285F4' }} />,
    status: 'connected',
    connected: '2026-03-25',
    lastSync: '2026-04-11 10:30',
    photos: 1250,
    used: 12.5,
    total: 15,
    unit: 'GB'
  },
  {
    id: 2,
    name: '阿里云盘',
    icon: <CloudServerOutlined style={{ fontSize: 32, color: '#FF6A00' }} />,
    status: 'connected',
    connected: '2026-04-01',
    lastSync: '2026-04-11 08:15',
    photos: 860,
    used: 8.2,
    total: 20,
    unit: 'GB'
  },
  {
    id: 3,
    name: '本地服务器',
    icon: <LaptopOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
    status: 'connected',
    connected: '2026-03-20',
    lastSync: '实时同步',
    photos: 737,
    used: 45.8,
    total: 100,
    unit: 'GB'
  }
]

const statusConfig = {
  connected: { text: '已连接', color: 'success' },
  syncing: { text: '同步中', color: 'processing' },
  disconnected: { text: '未连接', color: 'error' }
}

function Storage() {
  return (
    <div>
      <h2 style={{ margin: '0 0 24px' }}>存储源管理</h2>

      <Row gutter={[16, 16]}>
        {storageSources.map(source => {
          const status = statusConfig[source.status]
          return (
            <Col xs={24} md={12} lg={8} key={source.id}>
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  {source.icon}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{source.name}</div>
                    <Badge status={status.color} text={<span style={{ color: '#999' }}>{status.text}</span>} />
                  </div>
                </div>

                <Progress
                  percent={Math.round(source.used / source.total * 100)}
                  format={() => `${source.used} / ${source.total} ${source.unit}`}
                  style={{ marginBottom: 16 }}
                />

                <Descriptions column={1} size="small">
                  <Descriptions.Item label="照片数">{source.photos} 张</Descriptions.Item>
                  <Descriptions.Item label="连接时间">{source.connected}</Descriptions.Item>
                  <Descriptions.Item label="最后同步">{source.lastSync}</Descriptions.Item>
                </Descriptions>

                <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                  <Button size="small" icon={<SyncOutlined />} onClick={() => message.info('同步功能开发中...')}>
                    同步
                  </Button>
                  <Button size="small" danger icon={<DisconnectOutlined />} onClick={() => message.info('功能开发中...')}>
                    断开
                  </Button>
                </div>
              </Card>
            </Col>
          )
        })}

        <Col xs={24} md={12} lg={8}>
          <Card
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed #d9d9d9',
              cursor: 'pointer'
            }}
            bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 280 }}
            onClick={() => message.info('添加存储源功能开发中...')}
          >
            <LinkOutlined style={{ fontSize: 32, color: '#bbb', marginBottom: 12 }} />
            <span style={{ color: '#999', fontSize: 16 }}>添加存储源</span>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Storage
