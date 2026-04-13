import { Row, Col, Card, Statistic, Progress, List, Tag, Avatar } from 'antd'
import {
  PictureOutlined,
  CloudServerOutlined,
  CloudOutlined,
  LaptopOutlined,
  UploadOutlined
} from '@ant-design/icons'

const storageSources = [
  { name: 'Google 云盘', icon: <CloudOutlined />, used: 12.5, total: 15, color: '#4285F4' },
  { name: '阿里云盘', icon: <CloudServerOutlined />, used: 8.2, total: 20, color: '#FF6A00' },
  { name: '本地服务器', icon: <LaptopOutlined />, used: 45.8, total: 100, color: '#52c41a' }
]

const recentUploads = [
  { name: '海滩日落.jpg', source: 'Google 云盘', time: '5 分钟前' },
  { name: '家庭聚会_01.png', source: '阿里云盘', time: '1 小时前' },
  { name: '旅行合照.jpg', source: '本地服务器', time: '3 小时前' },
  { name: '风景照_2026.jpg', source: 'Google 云盘', time: '昨天' }
]

function Dashboard() {
  return (
    <div>
      <h2 style={{ margin: '0 0 24px' }}>数据概览</h2>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="照片总数" value={2847} prefix={<PictureOutlined style={{ color: '#1890ff' }} />} suffix="张" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="存储总用量" value={66.5} precision={1} prefix={<CloudServerOutlined style={{ color: '#52c41a' }} />} suffix="GB" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="今日上传" value={23} prefix={<UploadOutlined style={{ color: '#faad14' }} />} suffix="张" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="相册数" value={18} prefix={<PictureOutlined style={{ color: '#722ed1' }} />} suffix="个" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="存储源用量">
            {storageSources.map(s => (
              <div key={s.name} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>{s.icon} {s.name}</span>
                  <span style={{ color: '#999' }}>{s.used} / {s.total} GB</span>
                </div>
                <Progress percent={Math.round(s.used / s.total * 100)} strokeColor={s.color} showInfo={false} />
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="最近上传">
            <List
              dataSource={recentUploads}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<PictureOutlined />} />}
                    title={item.name}
                    description={<span><Tag>{item.source}</Tag>{item.time}</span>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
