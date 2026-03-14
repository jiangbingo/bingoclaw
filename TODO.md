# bingoclaw 任务清单

**最后更新**: 2026-03-14 14:30 GMT+8

---

## 🎯 当前优先任务

### 🔥 高优先级（本周）
1. ⏳ **Mac mini 开发环境配置**
   - git pull 项目
   - 安装依赖（pnpm install）
   - 配置环境变量（.env）
   - 测试本地运行

---

## 📋 项目计划

### ✅ Phase 1: MVP（已完成）
- [x] 项目初始化
- [x] 一键部署脚本
- [x] 5 个核心技能（翻译、天气、新闻、GitHub、飞书）
- [x] 飞书接入
- [x] 简单 Web UI
- [x] 完整测试覆盖（71 个测试，100% 通过）

### ⏳ Phase 2: 产品化（进行中）

#### 2.1 技能市场（ClawHub 集成）
- [ ] 研究 ClawHub API
- [ ] 实现技能发现接口
- [ ] 实现技能安装功能
- [ ] 实现技能更新机制
- [ ] 技能市场 UI 设计

#### 2.2 多平台接入
- [ ] 钉钉适配器
- [ ] Slack 适配器
- [ ] Discord 适配器
- [ ] 统一消息接口
- [ ] 平台路由逻辑

#### 2.3 成本优化
- [ ] 本地模型集成（Ollama）
- [ ] 智能路由算法
- [ ] 成本监控面板
- [ ] 使用统计分析

#### 2.4 文档网站
- [ ] VitePress 配置
- [ ] API 文档编写
- [ ] 技能开发指南
- [ ] 部署最佳实践

#### 2.5 监控和日志
- [ ] 日志收集系统
- [ ] 错误追踪（Sentry）
- [ ] 性能监控
- [ ] 告警机制

### 🔮 Phase 3: 商业化（未来）
- [ ] Pro 版本（云端托管）
- [ ] 企业版（私有部署）
- [ ] 技能创作者分成机制
- [ ] 高级分析功能

---

## 🚀 快速开始（给新协作者）

### 环境要求
- Node.js 18+
- pnpm（推荐）

### 开发步骤
```bash
# 1. 克隆项目
git clone https://github.com/jiangbingo/bingoclaw.git
cd bingoclaw

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env，填入 BIGMODEL_API_KEY

# 4. 运行测试
pnpm test

# 5. 启动开发服务器
pnpm dev
# 访问 http://localhost:5173
```

---

## 📊 项目状态

### 已完成功能
- ✅ 5 个核心技能
- ✅ 飞书适配器
- ✅ Webhook 接口
- ✅ 错误处理
- ✅ 测试覆盖（71 个测试）

### 技术栈
- 前端: React 19 + Vite 6 + TailwindCSS
- 后端: Vercel Serverless Functions
- AI: BigModel GLM-4.7
- 测试: Vitest

---

## 📁 相关文档

- [README.md](./README.md) - 项目介绍
- [docs/API.md](./docs/API.md) - API 文档
- [docs/DEPLOY.md](./docs/DEPLOY.md) - 部署指南
- [docs/feishu-adapter.md](./docs/feishu-adapter.md) - 飞书适配器

---

## 🤝 协作说明

### 如何认领任务
1. 在任务前加上你的名字：`[你的名字] 任务描述`
2. 完成后改为：`[✅ 你的名字] 任务描述`

### 如何添加新任务
1. 确定优先级（高/中/低）
2. 添加到对应的 Phase
3. 描述清楚任务目标

### 代码规范
- 使用 TypeScript
- 编写单元测试
- 更新相关文档

---

_最后更新: 2026-03-14 14:30 GMT+8_
