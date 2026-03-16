# 飞书适配器 - 使用指南

## 📖 概述

飞书适配器为 Bingoclaw 提供完整的飞书平台集成能力，支持：

- ✅ 消息收发（文本、卡片）
- ✅ Webhook 事件处理
- ✅ 技能调用（翻译、天气、新闻、GitHub）
- ✅ 签名验证
- ✅ 错误处理

## 🚀 快速开始

### 1. 配置环境变量

在 `.env` 文件中添加飞书配置：

```bash
# 飞书配置
FEISHU_APP_ID=cli_xxx
FEISHU_APP_SECRET=your_app_secret_here
FEISHU_VERIFICATION_TOKEN=your_verification_token_here
```

### 2. 部署到 Vercel

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm build

# 部署到 Vercel
vercel --prod
```

### 3. 配置飞书机器人

1. 登录 [飞书开放平台](https://open.feishu.cn/)
2. 创建企业自建应用
3. 配置事件订阅：
   - URL: `https://your-domain.vercel.app/api/webhook`
   - 订阅事件：`im.message.receive_v1`、`im.chat.member.added_v1`
4. 启用机器人能力
5. 发布应用并添加到群聊

## 📝 使用示例

### 翻译功能

```
翻译 你好世界
translate Hello World to zh
```

### 天气查询

```
天气 北京
weather Shanghai
```

### 新闻摘要

```
新闻 AI
news tech
```

### GitHub 操作

```
github repos jiangbingo
github issue open owner/repo
```

## 🔧 API 接口

### POST /api/webhook

处理飞书事件推送

**请求头：**
- `x-lark-request-timestamp`: 请求时间戳
- `x-lark-request-nonce`: 随机数
- `x-lark-signature`: 签名

**请求体：**
```json
{
  "type": "event",
  "ts": "1234567890",
  "uuid": "uuid-123",
  "token": "verification_token",
  "event": {
    "type": "message",
    "message_id": "msg_123",
    "chat_id": "chat_123",
    "message_type": "text",
    "content": "{\"text\":\"翻译 你好\"}",
    "sender": {
      "sender_id": {
        "open_id": "ou_123"
      }
    }
  }
}
```

**响应：**
```json
{
  "status": "success"
}
```

## 🎯 事件处理

### 支持的事件类型

1. **URL 验证** (`url_verification`)
   - 飞书配置 Webhook 时自动触发
   - 返回 challenge 码

2. **消息接收** (`message`)
   - 接收用户消息
   - 自动匹配技能并执行
   - 支持文本、图片、文件

3. **进群事件** (`enter_group`)
   - 用户加入群聊时触发
   - 发送欢迎消息和使用指南

## 🔐 安全性

### 签名验证

适配器自动验证飞书请求签名，确保请求来源可信：

```typescript
// 自动验证（配置了 FEISHU_VERIFICATION_TOKEN 时）
const isValid = adapter.verifySignature(timestamp, nonce, signature, body);
```

### 权限检查

- 检查 App ID 和 Secret
- 验证用户身份
- 限制操作权限

## 🧪 测试

运行测试：

```bash
# 运行所有测试
pnpm test

# 运行特定测试
pnpm test tests/feishu-adapter.test.ts

# 生成覆盖率报告
pnpm test:coverage
```

## 📊 监控和日志

适配器内置详细日志记录：

```
✅ 飞书适配器已启动
📩 收到飞书事件: { type: 'message', uuid: 'xxx' }
🎯 调用技能: 翻译
✅ 消息已发送到飞书群 chat_123
✅ 事件处理完成 (245ms)
```

## 🐛 错误处理

适配器包含完善的错误处理：

1. **签名验证失败** → 返回 401
2. **Token 无效** → 拒绝请求
3. **技能不存在** → 返回帮助信息
4. **技能执行失败** → 返回错误消息
5. **API 调用失败** → 自动重试

## 🔄 技能扩展

添加新技能：

1. 创建技能文件：`packages/skills/src/your-skill/index.ts`
2. 实现技能处理器：
```typescript
export const yourSkill: Skill = {
  id: 'your-skill',
  name: '你的技能',
  description: '技能描述',
  triggers: ['触发词1', 'trigger2'],
  handler: async (message, context) => {
    // 处理逻辑
    return '结果';
  },
  enabled: true,
};
```

3. 在 `packages/skills/src/index.ts` 中注册：
```typescript
export { yourSkill } from './your-skill';
```

## 📚 相关文档

- [飞书开放平台文档](https://open.feishu.cn/document/)
- [Bingoclaw 核心文档](../packages/core/README.md)
- [技能开发指南](../docs/skill-development.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
