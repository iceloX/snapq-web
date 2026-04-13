# CatGallery 认证模块 API 接口文档

> 版本: v1.0 | 更新日期: 2026-04-10

## 概述

本文档定义了 CatGallery 认证模块的 RESTful API 接口规范，供后端开发参考实现。

- **Base URL**: `/api`
- **认证方式**: Bearer Token (JWT)
- **请求格式**: `application/json`
- **响应格式**: `application/json`

---

## 统一响应格式

### 成功响应

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

### 失败响应

```json
{
  "code": 40101,
  "message": "用户名或密码错误",
  "data": null
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | `number` | 业务状态码，`0` 表示成功，非 `0` 表示失败 |
| `message` | `string` | 响应描述信息 |
| `data` | `object\|null` | 响应数据，失败时为 `null` |

---

## 错误码定义

| 错误码 | HTTP 状态码 | 含义 |
|--------|------------|------|
| `0` | 200 | 成功 |
| `40001` | 400 | 请求参数错误 |
| `40101` | 401 | 用户名或密码错误 |
| `40102` | 401 | 账号已被禁用 |
| `40103` | 401 | Token 已过期 |
| `40104` | 401 | Token 无效 |
| `42901` | 429 | 请求过于频繁 |
| `50001` | 500 | 服务器内部错误 |

---

## 接口列表

### 1. 用户登录

用户通过邮箱/用户名 + 密码进行登录认证。

- **URL**: `POST /api/auth/login`
- **认证**: 不需要

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `email` | `string` | 是 | 用户邮箱或用户名 |
| `password` | `string` | 是 | 用户密码 |
| `rememberMe` | `boolean` | 否 | 是否记住登录（延长 Token 有效期），默认 `false` |

#### 请求示例

```json
{
  "email": "admin@snapq.com",
  "password": "admin123",
  "rememberMe": true
}
```

#### 成功响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@snapq.com",
      "username": "admin",
      "role": "admin",
      "avatar": null,
      "loginTime": "2026-04-10T10:30:00.000Z"
    }
  }
}
```

#### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `data.token` | `string` | JWT 认证令牌 |
| `data.user.id` | `number` | 用户唯一标识 |
| `data.user.email` | `string` | 用户邮箱 |
| `data.user.username` | `string` | 用户名 |
| `data.user.role` | `string` | 用户角色：`admin` / `user` |
| `data.user.avatar` | `string\|null` | 头像 URL |
| `data.user.loginTime` | `string` | 登录时间 (ISO 8601) |

#### 失败响应示例

**参数缺失**:
```json
{
  "code": 40001,
  "message": "邮箱和密码不能为空",
  "data": null
}
```

**密码错误**:
```json
{
  "code": 40101,
  "message": "用户名或密码错误",
  "data": null
}
```

**账号禁用**:
```json
{
  "code": 40102,
  "message": "账号已被禁用",
  "data": null
}
```

---

### 2. 退出登录

退出当前用户会话，服务端使 Token 失效。

- **URL**: `POST /api/auth/logout`
- **认证**: 需要

#### 请求头

| Header | 值 |
|--------|------|
| `Authorization` | `Bearer <token>` |

#### 请求参数

无

#### 成功响应

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

---

### 3. 刷新 Token

当 Token 即将过期时，使用当前 Token 换取新 Token。

- **URL**: `POST /api/auth/refresh`
- **认证**: 需要

#### 请求头

| Header | 值 |
|--------|------|
| `Authorization` | `Bearer <token>` |

#### 请求参数

无

#### 成功响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

#### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `data.token` | `string` | 新的 JWT 认证令牌 |
| `data.expiresIn` | `number` | Token 有效期（秒） |

#### 失败响应示例

**Token 过期**:
```json
{
  "code": 40103,
  "message": "登录已过期，请重新登录",
  "data": null
}
```

---

### 4. 获取当前用户信息

获取当前已认证用户的详细信息。

- **URL**: `GET /api/auth/me`
- **认证**: 需要

#### 请求头

| Header | 值 |
|--------|------|
| `Authorization` | `Bearer <token>` |

#### 请求参数

无

#### 成功响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "email": "admin@snapq.com",
    "username": "admin",
    "role": "admin",
    "avatar": null,
    "loginTime": "2026-04-10T10:30:00.000Z"
  }
}
```

---

## 认证机制说明

### Token 规范

- **格式**: JWT (JSON Web Token)
- **传输方式**: 请求头 `Authorization: Bearer <token>`
- **默认有效期**: 1 小时
- **Remember Me 有效期**: 30 天
- **刷新机制**: Token 过期前可通过 `/auth/refresh` 换取新 Token

### JWT Payload 结构（建议）

```json
{
  "sub": 1,
  "email": "admin@snapq.com",
  "role": "admin",
  "iat": 1712743800,
  "exp": 1712747400
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `sub` | `number` | 用户 ID |
| `email` | `string` | 用户邮箱 |
| `role` | `string` | 用户角色 |
| `iat` | `number` | 签发时间 (Unix timestamp) |
| `exp` | `number` | 过期时间 (Unix timestamp) |

---

## 前端调用示例

```javascript
import { api } from '@/services/api'

// 登录
const { token, user } = await api.post('/auth/login', {
  email: 'admin@snapq.com',
  password: 'admin123',
  rememberMe: false
})

// 获取当前用户
const user = await api.get('/auth/me')

// 刷新 Token
const { token, expiresIn } = await api.post('/auth/refresh')

// 退出登录
await api.post('/auth/logout')
```

---

## Mock 测试账号

开发环境下内置以下测试账号：

| 邮箱 | 用户名 | 密码 | 角色 |
|------|--------|------|------|
| `admin@snapq.com` | admin | `admin123` | admin |
| `user@snapq.com` | user | `user123` | user |
