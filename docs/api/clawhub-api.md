# ClawHub API 文档

**版本**: v1.0.0
**基础URL**: `https://api.clawhub.ai/v1`

---

## 📋 **概览**

ClawHub API 提供技能市场相关功能，包括技能搜索、详情查询、安装和更新。

---

## 🔑 **认证**

### **API Key 认证**
```http
Authorization: Bearer YOUR_API_KEY
```

---

## 📡 **端点列表**

### **1. 搜索技能**

**端点**: `GET /skills/search`

**描述**: 根据关键词搜索技能

---

#### **请求参数**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| q | string | 否 | 搜索关键词 |
| category | string | 否 | 分类过滤 |
| sort | string | 否 | 排序方式（rating\|downloads\|updated） |
| page | number | 否 | 页码（默认1） |
| limit | number | 否 | 每页数量（默认20，最大100） |

---

#### **请求示例**
```bash
curl -X GET "https://api.clawhub.ai/v1/skills/search?q=weather&category=utility&sort=downloads" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

#### **响应示例**
```json
{
  "skills": [
    {
      "id": "weather-query",
      "name": "天气查询",
      "description": "实时查询全球天气",
      "icon": "🌤️",
      "rating": 4.5,
      "downloads": 1200,
      "category": "utility",
      "tags": ["天气", "查询", "实时"],
      "author": "developer",
      "version": "1.2.0"
    }
  ],
  "total": 1,
  "page": 1,
  "hasMore": false
}
```

---

### **2. 获取技能详情**

**端点**: `GET /skills/{skillId}`

**描述**: 获取技能的详细信息

---

#### **路径参数**

| 参数 | 类型 | 描述 |
|------|------|------|
| skillId | string | 技能ID |

---

#### **请求示例**
```bash
curl -X GET "https://api.clawhub.ai/v1/skills/weather-query" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

#### **响应示例**
```json
{
  "id": "weather-query",
  "name": "天气查询",
  "description": "实时查询全球天气",
  "icon": "🌤️",
  "rating": 4.5,
  "downloads": 1200,
  "category": "utility",
  "tags": ["天气", "查询", "实时"],
  "author": "developer",
  "version": "1.2.0",
  "readme": "# 天气查询\n\n实时查询全球天气...",
  "examples": [
    {
      "title": "基础用法",
      "code": "const weather = await getWeather('北京')",
      "output": "{ temp: 25, humidity: 60 }"
    }
  ],
  "versions": [
    {
      "version": "1.2.0",
      "releasedAt": "2026-03-10",
      "changelog": "新增空气质量查询"
    }
  ],
  "configSchema": {
    "type": "object",
    "properties": {
      "apiKey": {
        "type": "string",
        "description": "天气API密钥"
      }
    }
  }
}
```

---

### **3. 安装技能**

**端点**: `POST /skills/{skillId}/install`

**描述**: 安装指定技能

---

#### **请求示例**
```bash
curl -X POST "https://api.clawhub.ai/v1/skills/weather-query/install" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

---

#### **响应示例**
```json
{
  "success": true,
  "installedPath": "/skills/weather-query",
  "config": {
    "apiKey": ""
  }
}
```

---

### **4. 更新技能**

**端点**: `POST /skills/{skillId}/update`

**描述**: 更新技能到最新版本

---

#### **请求示例**
```bash
curl -X POST "https://api.clawhub.ai/v1/skills/weather-query/update" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

#### **响应示例**
```json
{
  "success": true,
  "oldVersion": "1.1.0",
  "newVersion": "1.2.0",
  "migrations": [
    "配置文件格式变更，请更新 apiKey"
  ]
}
```

---

### **5. 卸载技能**

**端点**: `DELETE /skills/{skillId}`

**描述**: 卸载指定技能

---

#### **请求示例**
```bash
curl -X DELETE "https://api.clawhub.ai/v1/skills/weather-query" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

#### **响应示例**
```json
{
  "success": true
}
```

---

### **6. 检查更新**

**端点**: `GET /skills/updates`

**描述**: 检查所有已安装技能的更新

---

#### **请求示例**
```bash
curl -X GET "https://api.clawhub.ai/v1/skills/updates" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

#### **响应示例**
```json
{
  "hasUpdates": true,
  "updates": [
    {
      "skillId": "weather-query",
      "currentVersion": "1.1.0",
      "latestVersion": "1.2.0",
      "updateAvailable": true
    }
  ]
}
```

---

## ❌ **错误码**

| 错误码 | 描述 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权（API Key 无效） |
| 404 | 技能不存在 |
| 409 | 冲突（技能已安装） |
| 500 | 服务器内部错误 |

---

## 📝 **使用示例**

### **TypeScript**
```typescript
import { ClawHubClient } from '@bingoclaw/skills'

const client = new ClawHubClient({
  apiKey: 'YOUR_API_KEY'
})

// 搜索技能
const results = await client.searchSkills({
  query: 'weather',
  category: 'utility',
  sort: 'downloads'
})

// 安装技能
const result = await client.installSkill('weather-query')

if (result.success) {
  console.log('安装成功！')
}
```

---

## 🔒 **安全建议**

1. ✅ 使用环境变量存储 API Key
2. ✅ 不要在客户端暴露 API Key
3. ✅ 使用 HTTPS 加密传输
4. ✅ 定期轮换 API Key

---

_文档版本: 1.0.0_
_最后更新: 2026-03-14_
