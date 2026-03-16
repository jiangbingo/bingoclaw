# bingoClaw API 文档

> 技能市场 API - RESTful 接口文档

## 基础信息

- **基础 URL**: `https://bingoclaw.vercel.app/api`
- **版本**: v1.0.0
- **格式**: JSON
- **认证**: Bearer Token（可选）

---

## 快速开始

### 1. 搜索技能

```bash
# 搜索天气相关技能
curl "https://bingoclaw.vercel.app/api/skills/search?q=天气"

# 按分类过滤
curl "https://bingoclaw.vercel.app/api/skills/search?category=productivity"

# 排序
curl "https://bingoclaw.vercel.app/api/skills/search?sort=downloads"
```

### 2. 获取技能详情

```bash
curl "https://bingoclaw.vercel.app/api/skills/weather-query"
```

### 3. 安装技能

```bash
curl -X POST "https://bingoclaw.vercel.app/api/skills/weather-query"
```

---

## API 端点

### 🔍 搜索技能

**GET** `/skills/search`

**查询参数**:
| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| q | string | 否 | 搜索关键词 | "天气" |
| category | string | 否 | 分类 | "productivity" |
| sort | string | 否 | 排序方式 | "rating" / "downloads" / "updated" |
| page | integer | 否 | 页码 | 1 |
| limit | integer | 否 | 每页数量 | 20 |

**响应示例**:
```json
{
  "skills": [
    {
      "id": "weather-query",
      "name": "天气查询",
      "description": "实时查询全球天气，支持中英文",
      "icon": "🌤️",
      "rating": 4.5,
      "downloads": 1200,
      "category": "productivity",
      "tags": ["天气", "生活", "实用"]
    }
  ],
  "total": 100,
  "page": 1,
  "hasMore": true
}
```

---

### 📖 获取技能详情

**GET** `/skills/{id}`

**路径参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 技能 ID |

**响应示例**:
```json
{
  "id": "weather-query",
  "name": "天气查询",
  "description": "实时查询全球天气，支持中英文",
  "icon": "🌤️",
  "rating": 4.5,
  "downloads": 1200,
  "category": "productivity",
  "tags": ["天气", "生活", "实用"],
  "author": "@developer",
  "version": "1.2.0",
  "homepage": "https://github.com/example/weather-skill",
  "repository": "https://github.com/example/weather-skill",
  "readme": "# 天气查询\n\n实时查询全球天气...",
  "examples": [
    {
      "title": "查询天气",
      "description": "查询指定城市的天气",
      "code": "const weather = await getWeather('北京')",
      "output": "北京：晴，25°C"
    }
  ],
  "versions": [
    {
      "version": "1.2.0",
      "releasedAt": "2026-03-10",
      "changelog": "- 新增空气质量查询\n- 优化性能",
      "breaking": false
    }
  ],
  "configSchema": {},
  "lastUpdated": "2026-03-10"
}
```

---

### 📦 安装技能

**POST** `/skills/{id}`

**响应示例**:
```json
{
  "success": true,
  "installedPath": "/skills/weather-query",
  "config": {}
}
```

---

### 🔄 更新技能

**POST** `/skills/{id}/update`

**响应示例**:
```json
{
  "success": true,
  "oldVersion": "1.0.0",
  "newVersion": "1.2.0",
  "migrations": ["更新配置格式", "添加新字段"]
}
```

---

### 🗑️ 卸载技能

**DELETE** `/skills/{id}`

**响应示例**:
```json
{
  "success": true
}
```

---

### ✅ 检查更新

**GET** `/skills/updates`

**响应示例**:
```json
{
  "hasUpdates": true,
  "updates": [
    {
      "skillId": "weather-query",
      "currentVersion": "1.0.0",
      "latestVersion": "1.2.0",
      "updateAvailable": true
    }
  ]
}
```

---

## 错误处理

### 错误响应格式

```json
{
  "error": "SkillNotFound",
  "message": "Skill not found: weather-query"
}
```

### 常见错误码

| HTTP 状态码 | 错误类型 | 说明 |
|------------|---------|------|
| 400 | BadRequest | 请求参数错误 |
| 404 | NotFound | 资源不存在 |
| 405 | MethodNotAllowed | 方法不允许 |
| 500 | InternalServerError | 服务器内部错误 |

---

## 分类列表

| 分类 | 标识符 | 说明 |
|------|--------|------|
| 开发工具 | development | GitHub、代码审查、CI/CD |
| 生产力 | productivity | 天气、翻译、日历 |
| 数据分析 | analytics | 数据可视化、报表 |
| 娱乐 | entertainment | 游戏、音乐 |
| 集成 | integration | 飞书、钉钉、Slack |

---

## SDK 使用

### JavaScript/TypeScript

```typescript
import { ClawHubClient } from '@bingoclaw/skills'

const client = new ClawHubClient()

// 搜索技能
const result = await client.searchSkills({ query: '天气' })

// 安装技能
const installResult = await client.installSkill('weather-query')
```

---

## 速率限制

- **搜索接口**: 100 次/分钟
- **其他接口**: 50 次/分钟

超出限制将返回 `429 Too Many Requests`。

---

## 联系方式

- **GitHub**: https://github.com/jiangbingo/bingoclaw
- **Email**: jiangbingo@hotmail.com
- **文档**: https://docs.bingoclaw.ai

---

_最后更新: 2026-03-16_
