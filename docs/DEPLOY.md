# Bingoclaw 部署指南

本指南将帮助你将 Bingoclaw 部署到 Vercel 平台。

## 目录

- [前置要求](#前置要求)
- [快速部署](#快速部署)
- [手动部署](#手动部署)
- [环境变量配置](#环境变量配置)
- [自定义域名](#自定义域名)
- [监控和日志](#监控和日志)
- [故障排查](#故障排查)

---

## 前置要求

### 必需

- **Node.js 18+** - [安装指南](https://nodejs.org)
- **pnpm** - 包管理器
  ```bash
  npm install -g pnpm
  ```
- **Vercel 账号** - [注册地址](https://vercel.com)
- **BigModel API Key** - [获取地址](https://open.bigmodel.cn)

### 可选

- **飞书开发者账号** - 用于飞书集成
- **自定义域名** - 用于绑定自己的域名

---

## 快速部署

### 方式 1: 一键部署按钮

点击下方按钮，自动克隆仓库并部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jiangbingo/bingoclaw)

### 方式 2: 使用部署脚本

```bash
# 1. 克隆仓库
git clone https://github.com/jiangbingo/bingoclaw.git
cd bingoclaw

# 2. 运行部署脚本
./scripts/deploy.sh
```

脚本会自动：
- ✅ 检查环境（Node.js, pnpm, Vercel CLI）
- ✅ 安装依赖
- ✅ 构建项目
- ✅ 部署到 Vercel

---

## 手动部署

### 1. 克隆仓库

```bash
git clone https://github.com/jiangbingo/bingoclaw.git
cd bingoclaw
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件
nano .env
```

填入必需的环境变量：

```env
# BigModel API Key（必需）
BIGMODEL_API_KEY=your_bigmodel_api_key_here

# 飞书配置（可选）
FEISHU_APP_ID=your_feishu_app_id
FEISHU_APP_SECRET=your_feishu_app_secret
```

### 4. 本地测试

```bash
# 启动开发服务器
pnpm dev

# 访问 http://localhost:5173
```

### 5. 部署到 Vercel

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署
vercel --prod
```

---

## 环境变量配置

### Vercel Dashboard 配置

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**
4. 添加以下变量：

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `BIGMODEL_API_KEY` | 智谱 AI API Key | ✅ |
| `FEISHU_APP_ID` | 飞书应用 ID | ❌ |
| `FEISHU_APP_SECRET` | 飞书应用密钥 | ❌ |

### 使用 CLI 配置

```bash
# 添加环境变量
vercel env add BIGMODEL_API_KEY

# 从 .env 文件拉取
vercel env pull .env.local
```

### 环境变量优先级

1. Vercel Dashboard 设置
2. `.env.local` 文件
3. `.env` 文件
4. `.env.example` 文件（仅作参考）

---

## 自定义域名

### 1. 添加域名

在 Vercel Dashboard 中：

1. 进入 **Settings** → **Domains**
2. 输入你的域名（如 `api.bingoclaw.com`）
3. 点击 **Add**

### 2. 配置 DNS

在你的域名服务商处添加 DNS 记录：

**A 记录**（推荐）
```
类型: A
名称: api
值: 76.76.21.21
```

**CNAME 记录**
```
类型: CNAME
名称: api
值: cname.vercel-dns.com
```

### 3. 等待生效

DNS 生效通常需要几分钟到几小时不等。

---

## 监控和日志

### Vercel Dashboard

- **Deployments**: 查看部署历史
- **Analytics**: 访问统计
- **Logs**: 实时日志

### 日志查看

```bash
# CLI 查看日志
vercel logs your-deployment-url
```

### 监控指标

关注以下指标：
- 响应时间
- 错误率
- 函数执行时间
- 带宽使用

---

## 故障排查

### 常见问题

#### 1. 部署失败：`Build Error`

**原因**: 依赖安装失败或构建错误

**解决**:
```bash
# 清除依赖缓存
rm -rf node_modules pnpm-lock.yaml
pnpm install

# 本地构建测试
pnpm build
```

#### 2. API 返回 500 错误

**原因**: 环境变量未配置或 API Key 无效

**解决**:
```bash
# 检查环境变量
vercel env ls

# 重新添加 API Key
vercel env rm BIGMODEL_API_KEY
vercel env add BIGMODEL_API_KEY
```

#### 3. 函数超时

**原因**: Vercel 免费版函数超时限制为 10 秒

**解决**:
- 优化代码性能
- 升级到 Vercel Pro（60 秒超时）
- 使用流式响应

#### 4. 飞书 Webhook 失败

**原因**: 签名验证失败或 URL 配置错误

**解决**:
- 检查飞书后台 Webhook URL 配置
- 验证 `FEISHU_APP_SECRET` 是否正确
- 查看 Vercel 日志排查错误

### 获取帮助

- **GitHub Issues**: https://github.com/jiangbingo/bingoclaw/issues
- **文档**: https://docs.bingoclaw.com
- **社区**: 加入我们的 Discord

---

## 高级配置

### 修改 Vercel 配置

编辑 `vercel.json`：

```json
{
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "regions": ["hkg1", "sfo1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}
```

### 多环境部署

```bash
# 预览环境
vercel

# 生产环境
vercel --prod

# 指定环境变量文件
vercel --env .env.production
```

---

## 成本估算

### Vercel 免费版

- 带宽: 100GB/月
- 函数调用: 无限制
- 构建时长: 6000 分钟/月
- 适用: 个人项目、测试

### Vercel Pro ($20/月)

- 带宽: 1TB/月
- 函数超时: 60 秒
- 团队协作
- 适用: 生产环境

---

## 安全建议

1. **API Key 保护**
   - 不要在代码中硬编码
   - 使用 Vercel 环境变量
   - 定期轮换密钥

2. **HTTPS**
   - Vercel 自动启用 HTTPS
   - 强制重定向 HTTP → HTTPS

3. **速率限制**
   - 实现请求限流
   - 防止滥用

4. **输入验证**
   - 验证所有用户输入
   - 防止注入攻击

---

**更新时间**: 2026-03-14  
**版本**: v0.1.0
