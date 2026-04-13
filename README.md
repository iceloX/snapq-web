# CatGallery Web

基于 React 19 + Vite + Ant Design 构建的现代化 Web 应用，提供用户登录认证功能。

## 技术栈

- **React 19** - 函数式组件 + Hooks
- **Vite 7** - 极速构建工具
- **Ant Design 6** - 企业级 UI 组件库
- **React Router 7** - 客户端路由
- **Vitest** - 单元测试框架

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview

# 运行测试
npm test
```

## 项目结构

```
src/
├── components/       # UI 组件
│   ├── Login.jsx     # 登录页（含 SVG 动画插画）
│   └── Login.module.css
├── views/            # 页面视图
│   ├── Index.jsx     # 首页（登录后）
│   └── Index.module.css
├── services/         # 服务层
│   └── auth.service.js  # 认证服务
├── App.jsx           # 根组件（路由配置）
├── main.jsx          # 应用入口
└── style.css         # 全局样式
```

## 功能特性

- 登录页：含 SVG 怪物插画（眼球追踪动画）+ Google 登录按钮
- 认证服务：Token 管理，支持 "Remember Me" 持久化登录
- 路由守卫：ProtectedRoute / GuestRoute 自动跳转
- 开发模式 Mock 登录（无需后端）

## 开发模式

开发环境默认使用 Mock 登录，无需配置后端 API：

| 用户名    | 密码      | 角色   |
|-----------|-----------|--------|
| admin     | admin123  | 管理员 |
| user      | user123   | 普通用户 |

## License

MIT
