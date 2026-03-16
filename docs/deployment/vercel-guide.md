# bingoClaw Vercel 部署指南

> 从零开始部署到 Vercel 的完整流程

## 📋 前置要求

- ✅ GitHub 账号
- ✅ Vercel 账号（可用 GitHub 登录）
- ✅ BigModel API Key
- ⚠️ Supabase 账号（可选，用于数据持久化）

---

## 🚀 方式一：一键部署（推荐）

### 步骤 1: Fork 项目

1. 访问 https://github.com/jiangbingo/bingoclaw
2. 点击右上角 **Fork** 按钮
3. 等待 Fork 完成

### 步骤 2: 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jiangbingo/bingoclaw)

1. 点击上方按钮
2. 登录 Vercel（使用 GitHub）
3. 选择你 Fork 的仓库
4. 点击 **Import**

### 步骤 3: 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `BIGMODEL_API_KEY` | BigModel API 密钥 | https://open.bigmodel.cn |
| `SUPABASE_URL` | Supabase 项目 URL（可选） | https://supabase.com |
| `SUPABASE_ANON_KEY` | Supabase 匿名密钥（可选） | Supabase 项目设置 |

### 步骤 4: 部署

1. 点击 **Deploy**
2. 等待部署完成（约 2-3 分钟）
3. 访问生成的 URL

---

## 🛠️ 方式二：CLI 部署

### 步骤 1: 安装 Vercel CLI

```bash
# 使用 npm
npm install -g vercel

# 或使用 pnpm
pnpm add -g vercel
```

### 步骤 2: 登录 Vercel

```bash
vercel login
```

选择你的登录方式（推荐 GitHub）。

### 步骤 3: 部署

```bash
# 克隆项目
git clone https://github.com/jiangbingo/bingoclaw.git
cd bingoclaw

# 安装依赖
pnpm install

# 部署到生产环境
vercel --prod
```

### 步骤 4: 配置环境变量

```bash
# 设置环境变量
vercel env add BIGMODEL_API_KEY
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY

# 重新部署以应用环境变量
vercel --prod
```

---

## 📝 方式三：使用部署脚本

```bash
# 给脚本执行权限
chmod +x scripts/deploy.sh

# 部署到 Vercel
./scripts/deploy.sh vercel
```

---

## 🔧 配置说明

### vercel.json 配置

项目根目录的 `vercel.json` 文件：

```json
{
  "version": 2,
  "name": "bingoclaw",
  "builds": [
    {
      "src": "apps/web/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "apps/api/**/*.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/apps/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/apps/web/$1"
    }
  ]
}
```

### 环境变量说明

#### 必需变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `BIGMODEL_API_KEY` | BigModel API 密钥 | `zai_xxxxx` |

#### 可选变量

| 变量 | 说明 | 用途 |
|------|------|------|
| `SUPABASE_URL` | Supabase 项目 URL | 数据持久化 |
| `SUPABASE_ANON_KEY` | Supabase 匿名密钥 | 数据库访问 |
| `NODE_ENV` | 环境标识 | `production` |

---

## 🎯 部署后检查

### 1. 检查 API 端点

```bash
# 搜索技能
curl https://your-app.vercel.app/api/skills/search

# 获取技能详情
curl https://your-app.vercel.app/api/skills/weather-query
```

### 2. 检查前端页面

访问以下页面：
- 首页: `https://your-app.vercel.app`
- 技能市场: `https://your-app.vercel.app/market`
- 技能详情: `https://your-app.vercel.app/skill/weather-query`

### 3. 检查日志

在 Vercel Dashboard 中：
1. 进入项目
2. 点击 **Logs** 标签
3. 查看实时日志

---

## 🔄 自动部署

### GitHub 集成

1. 在 Vercel Dashboard 中导入 GitHub 仓库
2. 每次推送到 `main` 分支会自动部署
3. Pull Request 会生成预览链接

### 部署分支

```bash
# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod
```

---

## 🐛 常见问题

### 1. 构建失败

**问题**: `Build failed`

**解决**:
```bash
# 本地测试构建
pnpm build

# 检查 package.json 中的 scripts
```

### 2. 环境变量未生效

**问题**: API 返回 500 错误

**解决**:
```bash
# 检查环境变量
vercel env ls

# 重新部署
vercel --prod
```

### 3. 路由 404

**问题**: API 路由返回 404

**解决**:
- 检查 `vercel.json` 中的 `routes` 配置
- 确保 API 文件位于 `apps/api/` 目录

### 4. 函数超时

**问题**: API 响应超时

**解决**:
- 在 `vercel.json` 中增加超时时间：
```json
{
  "functions": {
    "apps/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

---

## 📊 监控和分析

### Vercel Analytics

1. 在 Vercel Dashboard 中启用 Analytics
2. 查看访问量、性能指标
3. 设置告警规则

### 日志聚合

```bash
# 实时查看日志
vercel logs --follow

# 查看特定部署的日志
vercel logs [deployment-url]
```

---

## 🔐 安全建议

1. **环境变量**: 永远不要将 API Key 提交到代码仓库
2. **CORS**: 在 API 中配置正确的 CORS 策略
3. **速率限制**: 实施速率限制防止滥用
4. **HTTPS**: Vercel 自动提供 HTTPS

---

## 💰 成本优化

### Vercel 免费套餐

- 带宽: 100GB/月
- 函数执行: 100GB-Hrs/月
- 构建时长: 6000 分钟/月

### 优化建议

1. 使用缓存减少 API 调用
2. 压缩静态资源
3. 使用 Edge Functions 减少延迟

---

## 📚 相关资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Vercel CLI 文档](https://vercel.com/docs/cli)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)

---

## 🆘 获取帮助

- **GitHub Issues**: https://github.com/jiangbingo/bingoclaw/issues
- **Email**: jiangbingo@hotmail.com
- **Discord**: https://discord.gg/clawd

---

_最后更新: 2026-03-16_
