# Bingoclaw 🦞

> 开发者的 AI 助手 - 一键部署，技能市场，多平台接入

## 特性

- 🚀 **一键部署** - Vercel/Railway/阿里云
- 🎯 **技能市场** - ClawHub 深度集成
- 🔗 **多平台接入** - 飞书/钉钉/Slack/Discord
- 💰 **成本优化** - 智能路由（本地 vs 云端）
- 🛠️ **开发者工具** - GitHub/CI/CD/代码审查

## 快速开始

### 前置要求

- Node.js 18+
- pnpm（推荐）或 npm
- BigModel API Key

### 安装

```bash
# 克隆仓库
git clone https://github.com/jiangbingo/bingoclaw.git
cd bingoclaw

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的 API Key

# 启动开发服务器
pnpm dev
```

### 部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jiangbingo/bingoclaw)

或使用一键部署脚本：

```bash
./scripts/deploy.sh
```

## 项目结构

```
bingoclaw/
├── apps/
│   ├── web/          # Web UI
│   └── api/          # Serverless API
├── packages/
│   ├── core/         # 核心逻辑
│   ├── skills/       # 技能包
│   └── adapters/     # 平台适配器
├── docs/             # 文档
└── scripts/          # 部署脚本
```

## 技术栈

- **前端**: React 19 + Vite 6 + TailwindCSS
- **后端**: Vercel Serverless Functions
- **数据库**: Supabase
- **AI**: BigModel GLM-4.7
- **部署**: Vercel

## 核心技能

1. **GitHub 操作** - Issue/PR/代码审查
2. **飞书集成** - 文档/多维表格/消息
3. **天气查询** - 实时天气和预报
4. **新闻摘要** - AI 行业动态
5. **翻译** - 多语言翻译

## 开发路线

### Phase 1: MVP（2 周）
- [x] 项目初始化
- [ ] 一键部署脚本
- [ ] 5 个核心技能
- [ ] 飞书接入
- [ ] 简单 Web UI

### Phase 2: 产品化（4 周）
- [ ] 技能市场
- [ ] 多平台接入（钉钉/Slack）
- [ ] 成本优化
- [ ] 文档网站

### Phase 3: 商业化（8 周）
- [ ] Pro 版本（云端）
- [ ] 企业版（私有部署）
- [ ] 技能创作者分成

## 贡献

欢迎贡献代码、技能包或文档！

## 许可证

MIT

---

**开发者**: jiangbingo  
**官网**: https://bingoclaw.com（待上线）  
**文档**: https://docs.bingoclaw.com（待上线）
