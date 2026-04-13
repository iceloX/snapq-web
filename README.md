<div align="center">
  <img src="src/assets/sneezing-cat.svg" alt="Sneezing Cat" width="160" />
  <h1>CatGallery Web</h1>
  <p>
    <strong>A modern cat photo gallery built with React 19 + Ant Design</strong>
  </p>
  <p>
    <em>基于 React 19 + Ant Design 构建的现代化猫咪图片画廊</em>
  </p>
  <p>
    <a href="#english">English</a> | <a href="#中文">中文</a>
  </p>
</div>

---

<h2 id="english">Overview</h2>

CatGallery Web is a modern web application for browsing and managing cat photos. It features user authentication, role-based access control, a responsive waterfall-layout photo gallery, and an admin dashboard — all built with React 19, Ant Design 6, and Vite 7.

**Key Features:**

- 🐱 **Cat Photo Gallery** — Responsive waterfall layout with lazy loading
- 🔐 **Authentication** — Token-based login with "Remember Me" support
- 👤 **Role-based Access** — Admin dashboard and user views
- 🌙 **Dark / Light Mode** — Toggle theme in the header
- 📱 **Responsive Design** — Mobile-friendly layout
- 🚀 **Fast Dev Experience** — Vite HMR + mock login (no backend needed)

**Tech Stack:**

| Layer | Technology |
|-------|-----------|
| Framework | React 19 (Hooks) |
| UI Library | Ant Design 6 |
| Routing | React Router 7 |
| Build Tool | Vite 7 |
| Styling | CSS Modules |
| Testing | Vitest + React Testing Library |

**Quick Start:**

```bash
npm install
npm run dev      # → http://localhost:5173
npm run build    # production build
npm test         # run tests
```

**Mock Accounts (Dev Mode):**

| Email | Password | Role |
|-------|----------|------|
| admin | admin123 | Admin |
| user | user123 | User |

**Project Structure:**

```
src/
├── views/            # Page views
│   ├── Index.jsx     # Homepage (login + gallery)
│   └── Admin.jsx     # Admin dashboard
├── services/         # Service layer
│   ├── auth.service.js  # Auth & token management
│   └── api.js           # API request wrapper
├── assets/           # Static assets
│   └── sneezing-cat.svg
├── App.jsx           # Root component (routes)
└── main.jsx          # App entry
```

**License:** MIT

---

<h2 id="中文">项目简介</h2>

CatGallery Web 是一个现代化的猫咪图片画廊 Web 应用。支持用户登录认证、角色权限管理、响应式瀑布流图片浏览和管理员后台，基于 React 19、Ant Design 6 和 Vite 7 构建。

**主要功能：**

- 🐱 **猫咪图片画廊** — 响应式瀑布流布局，懒加载
- 🔐 **用户认证** — 基于 Token 的登录，支持"记住我"
- 👤 **角色权限** — 管理员后台与普通用户视图
- 🌙 **深色 / 浅色模式** — 顶部一键切换主题
- 📱 **响应式设计** — 适配移动端
- 🚀 **极速开发** — Vite 热更新 + Mock 登录（无需后端）

**技术栈：**

| 层级 | 技术 |
|------|------|
| 框架 | React 19（Hooks） |
| UI 组件库 | Ant Design 6 |
| 路由 | React Router 7 |
| 构建工具 | Vite 7 |
| 样式 | CSS Modules |
| 测试 | Vitest + React Testing Library |

**快速开始：**

```bash
npm install
npm run dev      # → http://localhost:5173
npm run build    # 生产构建
npm test         # 运行测试
```

**开发模式 Mock 账号：**

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | admin123 | 管理员 |
| user | user123 | 普通用户 |

**项目结构：**

```
src/
├── views/            # 页面视图
│   ├── Index.jsx     # 首页（登录 + 画廊）
│   └── Admin.jsx     # 管理员后台
├── services/         # 服务层
│   ├── auth.service.js  # 认证 & Token 管理
│   └── api.js           # API 请求封装
├── assets/           # 静态资源
│   └── sneezing-cat.svg
├── App.jsx           # 根组件（路由配置）
└── main.jsx          # 应用入口
```

**开源协议：** MIT
