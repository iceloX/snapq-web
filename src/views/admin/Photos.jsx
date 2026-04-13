import { useState } from 'react'
import { Row, Col, Card, Tag, Button, Upload, Select, Modal, message, Pagination } from 'antd'
import { UploadOutlined, DeleteOutlined, EyeOutlined, FolderOutlined, PictureOutlined } from '@ant-design/icons'

const mockPhotos = [
  { id: 1, name: '海滩日落.jpg', album: '旅行', tags: ['风景', '海边'], size: '3.2 MB', date: '2026-04-10' },
  { id: 2, name: '家庭聚会_01.png', album: '家庭', tags: ['聚会', '人物'], size: '5.1 MB', date: '2026-04-09' },
  { id: 3, name: '城市夜景.jpg', album: '旅行', tags: ['城市', '夜景'], size: '4.7 MB', date: '2026-04-08' },
  { id: 4, name: '猫咪照片.jpg', album: '宠物', tags: ['猫', '动物'], size: '2.8 MB', date: '2026-04-07' },
  { id: 5, name: '美食记录.png', album: '美食', tags: ['食物', '记录'], size: '1.9 MB', date: '2026-04-06' },
  { id: 6, name: '登山合照.jpg', album: '旅行', tags: ['登山', '人物'], size: '6.2 MB', date: '2026-04-05' },
  { id: 7, name: '樱花.jpg', album: '风景', tags: ['花', '春天'], size: '3.5 MB', date: '2026-04-04' },
  { id: 8, name: '生日蛋糕.jpg', album: '家庭', tags: ['生日', '食物'], size: '2.1 MB', date: '2026-04-03' },
  { id: 9, name: '办公室.jpg', album: '工作', tags: ['办公', '日常'], size: '1.8 MB', date: '2026-04-02' },
  { id: 10, name: '夕阳余晖.png', album: '风景', tags: ['夕阳', '风景'], size: '4.3 MB', date: '2026-04-01' },
  { id: 11, name: '咖啡拉花.jpg', album: '美食', tags: ['咖啡', '美食'], size: '1.5 MB', date: '2026-03-31' },
  { id: 12, name: '公园散步.jpg', album: '日常', tags: ['公园', '散步'], size: '2.9 MB', date: '2026-03-30' }
]

const albums = ['全部', '旅行', '家庭', '宠物', '美食', '风景', '工作', '日常']

// Generate placeholder color based on photo name for visual variety
function getColor(name) {
  const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#1890ff', '#52c41a', '#eb2f96', '#faad14']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function Photos() {
  const [selectedAlbum, setSelectedAlbum] = useState('全部')
  const [previewPhoto, setPreviewPhoto] = useState(null)

  const filtered = selectedAlbum === '全部'
    ? mockPhotos
    : mockPhotos.filter(p => p.album === selectedAlbum)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0 }}>照片管理</h2>
        <Upload showUploadList={false} beforeUpload={() => { message.info('上传功能开发中...'); return false }}>
          <Button type="primary" icon={<UploadOutlined />}>上传照片</Button>
        </Upload>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Select
          value={selectedAlbum}
          onChange={setSelectedAlbum}
          style={{ width: 160 }}
          options={albums.map(a => ({ value: a, label: a === '全部' ? '全部相册' : a }))}
        />
        <span style={{ marginLeft: 12, color: '#999' }}>共 {filtered.length} 张照片</span>
      </div>

      <Row gutter={[16, 16]}>
        {filtered.map(photo => (
          <Col xs={12} sm={8} md={6} lg={4} key={photo.id}>
            <Card
              hoverable
              bodyStyle={{ padding: 12 }}
              cover={
                <div
                  style={{
                    height: 160,
                    background: `linear-gradient(135deg, ${getColor(photo.name)}, ${getColor(photo.name)}88)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 32,
                    position: 'relative'
                  }}
                >
                  <PictureOutlined style={{ fontSize: 40, opacity: 0.6 }} />
                </div>
              }
              actions={[
                <EyeOutlined key="view" onClick={() => setPreviewPhoto(photo)} />,
                <DeleteOutlined key="delete" onClick={() => message.info('功能开发中...')} />
              ]}
            >
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{photo.name}</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <Tag color="blue" style={{ margin: 0, fontSize: 11 }}>{photo.album}</Tag>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Pagination defaultCurrent={1} total={filtered.length} pageSize={12} />
      </div>

      <Modal
        open={!!previewPhoto}
        title={previewPhoto?.name}
        onCancel={() => setPreviewPhoto(null)}
        footer={null}
        width={600}
      >
        {previewPhoto && (
          <div>
            <div
              style={{
                height: 300,
                background: `linear-gradient(135deg, ${getColor(previewPhoto.name)}, ${getColor(previewPhoto.name)}88)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                marginBottom: 16,
                color: '#fff',
                fontSize: 48
              }}
            >
              <PictureOutlined style={{ opacity: 0.6 }} />
            </div>
            <p><strong>相册：</strong>{previewPhoto.album}</p>
            <p><strong>标签：</strong>{previewPhoto.tags.map(t => <Tag key={t}>{t}</Tag>)}</p>
            <p><strong>大小：</strong>{previewPhoto.size}</p>
            <p><strong>日期：</strong>{previewPhoto.date}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Photos
