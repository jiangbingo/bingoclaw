# MacBook Pro 开发环境迁移指南

**创建时间**: 2026-03-14 21:40 GMT+8
**目标**: 在 MacBook Pro 上继续开发 bingoClaw

---

## ✅ **Mac mini 当前状态**

### **Git 状态**
```
✅ 所有代码已提交
✅ 已推送到 GitHub
✅ 工作区干净

最新提交:
- cc97389: Phase 2.1 完成 - UI 测试 + 集成测试
- 7412d15: Phase 2 完成 - UI 组件 + API 文档
- 1fdf093: Phase 1 - UI 设计规范完成
```

---

### **代码统计**
```
✅ 总文件数: 34个
✅ 总代码量: 120.9KB（4,221行）
✅ Phase 2.1 进度: 100%
```

---

## 🚀 **MacBook Pro 环境配置**

### **步骤1: 克隆项目**（5分钟）

#### **在 MacBook Pro 上执行**
```bash
# 1. 进入工作目录
cd /Users/jiangbin/Documents/workspace

# 2. 克隆项目（如果还没有）
git clone git@github.com:jiangbingo/bingoclaw.git

# 或者如果已有项目，拉取最新代码
cd bingoclaw
git pull origin main

# 3. 检查 Git 状态
git status
git log --oneline -5
```

---

### **步骤2: 安装依赖**（3分钟）

```bash
# 1. 安装 pnpm（如果未安装）
npm install -g pnpm

# 2. 安装项目依赖
pnpm install

# 3. 验证安装
pnpm --version
node --version
```

---

### **步骤3: 配置环境变量**（2分钟）

#### **创建 .env 文件**
```bash
# 复制示例文件
cp .env.example .env

# 编辑 .env 文件
vim .env
```

#### **配置内容**
```env
# BigModel API 配置（从 Mac mini 复制）
BIGMODEL_API_KEY=2b4a8eb0a43548169757f6f7fb895b9d.9LMtXZ9gr56x4CGl

# 飞书配置（可选）
LARK_APP_ID=
LARK_APP_SECRET=

# 其他配置
NODE_ENV=development
LOG_LEVEL=info
```

---

### **步骤4: 验证环境**（2分钟）

```bash
# 1. 运行测试
pnpm test

# 2. 检查 TypeScript 编译
pnpm build

# 3. 查看项目结构
tree -L 2 -I 'node_modules'
```

---

## 📋 **快速开始**

### **在 MacBook Pro 上执行**
```bash
# 1. 进入项目目录
cd /Users/jiangbin/Documents/workspace/bingoclaw

# 2. 拉取最新代码
git pull origin main

# 3. 查看进度
cat PROGRESS.md
cat PHASE_2_1_FINAL_REPORT.md

# 4. 查看待完成任务
cat TODO.md

# 5. 开始开发
# ... 开始 Phase 2.2 ...
```

---

## 🔧 **MacBook Pro 特定配置**

### **1. Git 配置**
```bash
# 确保 Git 配置正确
git config --global user.name "bingo"
git config --global user.email "jiangbingo@hotmail.com"
git config --global init.defaultBranch main

# 验证配置
git config --list | grep user
```

---

### **2. SSH 配置**
```bash
# 检查 SSH Key
ls -la ~/.ssh/id_rsa.pub

# 测试 GitHub 连接
ssh -T git@github.com
```

---

### **3. 环境变量**
```bash
# 添加到 ~/.zshrc
export SKILLS_DIR="/Users/jiangbin/Documents/workspace/bingoclaw/skills"
export NODE_ENV="development"

# 生效配置
source ~/.zshrc
```

---

## 📊 **项目同步验证**

### **检查清单**
```bash
# 1. Git 状态
git status
# 应该显示: nothing to commit, clean working tree

# 2. 最新提交
git log --oneline -5
# 应该看到:
# cc97389 test: Phase 2.1 完成 - UI 测试 + 集成测试
# 7412d15 feat: Phase 2 完成 - UI 组件 + API 文档
# 1fdf093 docs: Phase 1 - UI 设计规范完成

# 3. 文件完整性
find . -name "*.ts" -o -name "*.tsx" | wc -l
# 应该看到: 16个 TypeScript 文件

# 4. 测试运行
pnpm test
# 应该看到: 所有测试通过
```

---

## 🚀 **下一步开发**

### **Phase 2.2: 多平台接入**（明天）
```
1. □ 钉钉适配器开发
2. □ Slack 适配器开发
3. □ Discord 适配器开发
4. □ 统一消息接口
5. □ 平台路由逻辑
```

---

## 💡 **开发建议**

### **在 MacBook Pro 上**
```
✅ 使用熟悉的开发环境
✅ 更好的性能（M4 Pro）
✅ 完整的 IDE 支持
✅ 更快的编译速度
```

---

### **协作流程**
```
MacBook Pro:
1. 开发新功能
2. git commit
3. git push

Mac mini:
1. git pull
2. 运行测试
3. 验证功能
```

---

## 🔄 **环境切换注意事项**

### **路径差异**
```
Mac mini:
- 工作区: /Users/bingo-macmini/workspace/bingoclaw
- Obsidian: /Users/bingo-macmini/Documents/macmini-obsidian

MacBook Pro:
- 工作区: /Users/jiangbin/Documents/workspace/bingoclaw
- Obsidian: /Users/jiangbin/Documents/bingoNotes
```

---

### **配置文件**
```
Mac mini:
- .openclaw/openclaw.json
- .env

MacBook Pro:
- 需要重新配置 .env
- 检查 OpenClaw 配置
```

---

## 📝 **快速命令**

### **MacBook Pro 常用命令**
```bash
# 进入项目
alias bc="cd /Users/jiangbin/Documents/workspace/bingoclaw"

# 拉取最新代码
alias gpl="git pull origin main"

# 运行测试
alias pt="pnpm test"

# 查看进度
alias vp="cat PROGRESS.md"

# 开始开发
alias start="cd /Users/jiangbin/Documents/workspace/bingoclaw && git pull && pnpm install"
```

---

## 🎯 **成功标志**

### **环境配置完成**
```
✅ Git 同步成功
✅ 依赖安装成功
✅ 测试运行成功
✅ TypeScript 编译成功
✅ .env 配置完成
```

---

## 📞 **遇到问题？**

### **常见问题**

#### **问题1: Git 拉取失败**
```bash
# 解决方案
git fetch origin
git reset --hard origin/main
```

---

#### **问题2: 依赖安装失败**
```bash
# 清理缓存
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

#### **问题3: 测试失败**
```bash
# 更新依赖
pnpm install
pnpm test
```

---

## 🚀 **准备好了吗？**

### **在 MacBook Pro 上执行**
```bash
# 一键配置
cd /Users/jiangbin/Documents/workspace/bingoclaw
git pull origin main
pnpm install
pnpm test

# 开始开发 Phase 2.2！
```

---

_创建时间: 2026-03-14 21:40_
_执行时间: 10分钟_
_目标: MacBook Pro 环境就绪_
