# 飞书适配器部署指南

## 📋 前置要求

1. 飞书开发者账号
2. Vercel 账号
3. Node.js 18+
4. pnpm 9+

## 🚀 部署步骤

### 1. 创建飞书应用

1. 访问 [飞书开放平台](https://open.feishu.cn/app)
2. 点击"创建企业自建应用"
3. 填写应用信息：
   - 应用名称：Bingoclaw
   - 应用描述：AI 助手
   - 应用图标：上传图标

### 2. 获取应用凭证

1. 进入应用详情页
2. 点击"凭证与基础信息"
3. 复制以下信息：
   - App ID
   - App Secret
   - Verification Token（在事件订阅中）

### 3. 配置应用权限

在"权限管理"中启用以下权限：

- `im:message` - 获取与发送消息
- `im:message:receive_as_bot` - 接收群聊消息
- `im:chat` - 获取群组信息
- `im:chat:readonly` - 读取群组信息

### 4. 本地开发

```bash
# 克隆项目
git clone https://github.com/jiangbingo/bingoclaw.git
cd bingoclaw

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入飞书凭证

# 运行测试
pnpm test

# 本地开发
pnpm dev
```

### 5. 部署到 Vercel

#### 方法 1：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod

# 设置环境变量
vercel env add FEISHU_APP_ID
vercel env add FEISHU_APP_SECRET
vercel env add FEISHU_VERIFICATION_TOKEN
```

#### 方法 2：通过 GitHub 集成

1. 在 Vercel 中导入 GitHub 仓库
2. 配置环境变量
3. 自动部署

### 6. 配置飞书 Webhook

1. 返回飞书开放平台
2. 进入"事件订阅"
3. 配置请求网址：
   ```
   https://your-app.vercel.app/api/webhook
   ```
4. 添加事件：
   - `im.message.receive_v1` - 接收消息
   - `im.chat.member.added_v1` - 进入群聊

### 7. 发布应用

1. 在"版本管理与发布"中创建版本
2. 提交审核（可选）
3. 发布应用
4. 添加到群聊测试

## 🧪 测试部署

### 使用 curl 测试

```bash
# 测试 Webhook URL
curl -X POST https://your-app.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "url_verification",
    "token": "your_token",
    "event": "challenge_test"
  }'
```

### 在飞书中测试

1. 将机器人添加到群聊
2. 发送消息测试：
   - `翻译 你好世界`
   - `天气 北京`
   - `新闻 AI`

## 📊 监控和调试

### Vercel 日志

```bash
# 查看实时日志
vercel logs --follow
```

### 本地调试

```bash
# 启用调试模式
DEBUG=bingoclaw:* pnpm dev
```

## 🔄 更新部署

```bash
# 修改代码后重新部署
vercel --prod
```

## 🐛 常见问题

### 1. 签名验证失败

**原因：** Verification Token 不匹配

**解决：** 检查 `.env` 和飞书应用配置中的 token 是否一致

### 2. 消息发送失败

**原因：** Access Token 过期或权限不足

**解决：** 
- 检查 App ID 和 Secret
- 确认应用有发送消息权限
- 重启应用刷新 token

### 3. Webhook URL 验证失败

**原因：** URL 不可访问或响应格式错误

**解决：**
- 确认 Vercel 部署成功
- 检查 `/api/webhook` 是否正常响应
- 查看飞书开放平台的错误提示

### 4. 技能不响应

**原因：** 触发词不匹配或技能未启用

**解决：**
- 检查消息格式
- 确认技能已注册
- 查看日志中的错误信息

## 📚 相关资源

- [飞书开放平台文档](https://open.feishu.cn/document/)
- [Vercel 部署文档](https://vercel.com/docs)
- [Bingoclaw 使用指南](./feishu-adapter.md)

## 🎉 完成！

部署完成后，你的飞书机器人就可以使用了！

有任何问题欢迎提 Issue。
