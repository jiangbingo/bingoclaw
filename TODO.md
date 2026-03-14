# bingoclaw 任务清单

**最后更新**: 2026-03-14 16:40 GMT+8

---

## 🎯 当前优先任务

### 🔥 高优先级（今天）
1. ✅ **单元测试编写**
   - [x] clawhub-client.test.ts
   - [x] skill-manager.test.ts
   - [x] vitest 配置
   - [ ] 运行测试验证

2. ⏳ **代码验证**
   - [ ] 安装依赖
   - [ ] 运行测试
   - [ ] 修复问题（如果有）

3. ⏳ **Git 提交**
   - [ ] git add
   - [ ] git commit
   - [ ] git push

---

## 📋 Phase 2 进度（更新）

### ✅ 已完成（Day 1 - 3月14日）
- [x] 环境配置（Node.js, pnpm, .env）
- [x] ClawHub API 客户端（4.7KB）
- [x] 技能管理器（5.0KB）
- [x] 单元测试编写（12.4KB）
  - clawhub-client.test.ts（5.6KB）
  - skill-manager.test.ts（6.8KB）
- [x] Vitest 配置
- [x] TypeScript 配置
- [x] 代码推送到 GitHub

### ⏳ 进行中
- [ ] 安装依赖（pnpm install）
- [ ] 运行测试
- [ ] 验证代码运行

### 📋 待完成（Day 2 - 3月15日）
- [ ] 技能管理模块完善
  - 技能依赖管理
  - 技能冲突检测
  - 技能版本回滚
- [ ] 技能市场 UI 设计
  - 技能列表页布局
  - 技能详情页设计
  - 搜索和过滤功能

---

## 📊 项目计划

### ✅ Phase 1: MVP（已完成）
- [x] 项目初始化
- [x] 一键部署脚本
- [x] 5 个核心技能（翻译、天气、新闻、GitHub、飞书）
- [x] 飞书接入
- [x] 简单 Web UI
- [x] 完整测试覆盖（71 个测试，100% 通过）

### ⏳ Phase 2: 产品化（进行中 - 70% Day 1 完成）

#### 2.1 技能市场（ClawHub 集成）- 70% 完成
- [x] 研究 ClawHub API
- [x] 实现技能发现接口
- [x] 实现技能安装功能
- [x] 实现技能更新机制
- [x] 单元测试编写
- [ ] 技能市场 UI 设计
- [ ] 技能市场 UI 实现
- [ ] 集成测试

#### 2.2 多平台接入 - 0% 完成
- [ ] 钉钉适配器
- [ ] Slack 适配器
- [ ] Discord 适配器
- [ ] 统一消息接口
- [ ] 平台路由逻辑

#### 2.3 成本优化 - 0% 完成
- [ ] 本地模型集成（Ollama）
- [ ] 智能路由算法
- [ ] 成本监控面板
- [ ] 使用统计分析

#### 2.4 文档网站 - 0% 完成
- [ ] VitePress 配置
- [ ] API 文档编写
- [ ] 技能开发指南
- [ ] 部署最佳实践

#### 2.5 监控和日志 - 0% 完成
- [ ] 日志收集系统
- [ ] 错误追踪（Sentry）
- [ ] 性能监控
- [ ] 告警机制

---

## 📊 代码统计

### 已完成代码
```
packages/skills/
├── clawhub-client.ts (4.7KB, 178行)
├── skill-manager.ts (5.0KB, 195行)
└── __tests__/
    ├── clawhub-client.test.ts (5.6KB, 180行)
    └── skill-manager.test.ts (6.8KB, 205行)

配置文件:
├── vitest.config.ts (324B)
├── tsconfig.json (623B)
└── package.json (704B)

总计: 23.8KB（758行代码 + 配置）
```

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
- ✅ ClawHub API 客户端
- ✅ 技能管理器
- ✅ 单元测试（新增）

### 技术栈
- 前端: React 19 + Vite 6 + TailwindCSS
- 后端: Vercel Serverless Functions
- AI: BigModel GLM-4.7
- 测试: Vitest
- 语言: TypeScript

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

_最后更新: 2026-03-14 16:40 GMT+8_
