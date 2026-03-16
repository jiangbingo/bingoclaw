# Bingoclaw API 文档

## 概述

Bingoclaw 提供 RESTful API 接口，支持技能调用和平台集成。

**Base URL**: `https://your-domain.com/api`

## 认证

所有 API 请求需要在 Header 中携带认证信息：

```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

## 通用响应格式

### 成功响应

```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

### 错误响应

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "请求参数错误"
  }
}
```

---

## 技能接口

### 1. 调用技能

**POST** `/skills/invoke`

调用指定的技能。

#### 请求参数

```json
{
  "skill": "translate",       // 技能 ID
  "message": "翻译 你好世界",  // 用户消息
  "context": {                // 可选：上下文信息
    "platform": "feishu",
    "userId": "ou_xxx"
  }
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "skill": "translate",
    "result": "🌐 翻译结果\n\n原文: 你好世界\n译文: Hello World\n\n📊 置信度: 0.9",
    "timestamp": 1234567890
  }
}
```

### 2. 获取技能列表

**GET** `/skills/list`

获取所有可用技能。

#### 响应示例

```json
{
  "success": true,
  "data": {
    "skills": [
      {
        "id": "translate",
        "name": "翻译",
        "description": "多语言翻译",
        "triggers": ["翻译", "translate", "中译英", "英译中"],
        "enabled": true
      },
      {
        "id": "weather",
        "name": "天气查询",
        "description": "查询实时天气和预报",
        "triggers": ["天气", "weather", "气温", "预报"],
        "enabled": true
      }
    ]
  }
}
```

---

## 聊天接口

### 1. 发送消息

**POST** `/chat`

发送消息给 AI 助手。

#### 请求参数

```json
{
  "message": "天气 北京",
  "platform": "feishu",      // 可选：平台标识
  "userId": "ou_xxx",        // 可选：用户 ID
  "conversationId": "conv_xxx" // 可选：会话 ID
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "response": "🌤️ 北京 天气\n\n🌡️ 温度: 25°C (体感 27°C)\n...",
    "conversationId": "conv_xxx",
    "timestamp": 1234567890
  }
}
```

### 2. 获取会话历史

**GET** `/chat/history/:conversationId`

获取指定会话的历史消息。

#### 查询参数

- `limit` (可选): 返回消息数量，默认 50
- `offset` (可选): 偏移量，默认 0

#### 响应示例

```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_1",
        "role": "user",
        "content": "天气 北京",
        "timestamp": 1234567890
      },
      {
        "id": "msg_2",
        "role": "assistant",
        "content": "🌤️ 北京 天气...",
        "timestamp": 1234567891
      }
    ],
    "total": 2,
    "hasMore": false
  }
}
```

---

## 飞书接口

### 1. Webhook 接收

**POST** `/webhook/feishu`

接收飞书事件推送。

#### 请求头

```http
X-Lark-Request-Timestamp: 1234567890
X-Lark-Request-Nonce: abc123
X-Lark-Signature: sha256=...
```

#### 请求体（消息事件）

```json
{
  "type": "message",
  "id": "msg_xxx",
  "content": "翻译 你好",
  "timestamp": 1234567890,
  "sender": {
    "id": "ou_xxx",
    "name": "张三"
  }
}
```

#### 响应

```json
{
  "success": true
}
```

### 2. 发送飞书消息

**POST** `/feishu/send`

主动发送消息到飞书。

#### 请求参数

```json
{
  "userId": "ou_xxx",        // 用户 ID
  "message": "处理完成！",    // 消息内容
  "msgType": "text"          // 消息类型：text/post/image
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "messageId": "msg_xxx",
    "timestamp": 1234567890
  }
}
```

---

## 健康检查

### GET `/health`

检查服务状态。

#### 响应示例

```json
{
  "status": "ok",
  "timestamp": 1234567890,
  "version": "0.1.0",
  "services": {
    "ai": "healthy",
    "database": "healthy"
  }
}
```

---

## 错误码

| 错误码 | 说明 |
|--------|------|
| `INVALID_REQUEST` | 请求参数错误 |
| `UNAUTHORIZED` | 未授权 |
| `SKILL_NOT_FOUND` | 技能不存在 |
| `RATE_LIMIT_EXCEEDED` | 请求频率超限 |
| `INTERNAL_ERROR` | 服务器内部错误 |

---

## 限流

- 每个用户: 60 次/分钟
- 每个 IP: 100 次/分钟

超出限制将返回 `429 Too Many Requests`。

---

## SDK 示例

### JavaScript/TypeScript

```typescript
import { Bingoclaw } from '@bingoclaw/sdk';

const client = new Bingoclaw({
  apiKey: 'your-api-key',
  baseUrl: 'https://your-domain.com/api'
});

// 调用技能
const result = await client.invokeSkill('translate', '翻译 你好');
console.log(result.data);

// 发送消息
const response = await client.chat('天气 北京');
console.log(response.data);
```

### Python

```python
from bingoclaw import Client

client = Client(api_key='your-api-key')

# 调用技能
result = client.invoke_skill('translate', '翻译 你好')
print(result.data)

# 发送消息
response = client.chat('天气 北京')
print(response.data)
```

---

## WebSocket 接口（计划中）

### 连接

```
wss://your-domain.com/ws?token=YOUR_API_KEY
```

### 消息格式

```json
{
  "type": "message",
  "data": {
    "content": "你好",
    "timestamp": 1234567890
  }
}
```

---

**更新时间**: 2026-03-14  
**版本**: v0.1.0
