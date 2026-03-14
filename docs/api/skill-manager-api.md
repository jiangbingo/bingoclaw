# 技能管理 API 文档

**版本**: v1.0.0
**模块**: packages/skills/skill-manager.ts

---

## 📋 **概览**

技能管理器提供本地技能的管理功能，包括列表查询、启用/禁用、配置管理等。

---

## 🔧 **核心功能**

### **1. 列出已安装技能**

**方法**: `listInstalled()`

**描述**: 获取所有已安装的技能列表

---

#### **使用示例**
```typescript
import { skillManager } from '@bingoclaw/skills'

const skills = await skillManager.listInstalled()

console.log(skills)
// [
//   {
//     id: 'weather-query',
//     name: '天气查询',
//     version: '1.2.0',
//     enabled: true,
//     installedAt: Date,
//     lastUpdated: Date,
//     config: { apiKey: '...' },
//     path: '/skills/weather-query'
//   }
// ]
```

---

### **2. 启用技能**

**方法**: `enableSkill(skillId: string)`

**描述**: 启用指定技能

---

#### **参数**

| 参数 | 类型 | 描述 |
|------|------|------|
| skillId | string | 技能ID |

---

#### **使用示例**
```typescript
await skillManager.enableSkill('weather-query')
```

---

### **3. 禁用技能**

**方法**: `disableSkill(skillId: string)`

**描述**: 禁用指定技能

---

#### **使用示例**
```typescript
await skillManager.disableSkill('weather-query')
```

---

### **4. 配置技能**

**方法**: `configureSkill(skillId: string, config: SkillConfig)`

**描述**: 更新技能配置

---

#### **参数**

| 参数 | 类型 | 描述 |
|------|------|------|
| skillId | string | 技能ID |
| config | object | 配置对象 |

---

#### **使用示例**
```typescript
await skillManager.configureSkill('weather-query', {
  apiKey: 'YOUR_API_KEY',
  defaultCity: '北京'
})
```

---

### **5. 获取技能配置**

**方法**: `getSkillConfig(skillId: string)`

**描述**: 获取技能的当前配置

---

#### **使用示例**
```typescript
const config = await skillManager.getSkillConfig('weather-query')

console.log(config)
// { apiKey: 'YOUR_API_KEY', defaultCity: '北京' }
```

---

### **6. 验证技能**

**方法**: `validateSkill(skillId: string)`

**描述**: 验证技能的完整性和有效性

---

#### **返回值**
```typescript
{
  valid: boolean
  errors: string[]
  warnings: string[]
}
```

---

#### **使用示例**
```typescript
const result = await skillManager.validateSkill('weather-query')

if (!result.valid) {
  console.error('技能验证失败:', result.errors)
}
```

---

## 📊 **数据结构**

### **InstalledSkill**
```typescript
interface InstalledSkill {
  id: string
  name: string
  version: string
  enabled: boolean
  installedAt: Date
  lastUpdated: Date
  config: Record<string, unknown>
  path: string
}
```

---

### **ValidationResult**
```typescript
interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}
```

---

### **SkillConfig**
```typescript
type SkillConfig = Record<string, unknown>
```

---

## 💾 **持久化**

技能管理器使用 JSON 文件进行持久化存储：

**存储位置**: `{skillsDir}/installed.json`

**文件格式**:
```json
[
  {
    "id": "weather-query",
    "name": "天气查询",
    "version": "1.2.0",
    "enabled": true,
    "installedAt": "2026-03-14T09:00:00Z",
    "lastUpdated": "2026-03-14T09:00:00Z",
    "config": {
      "apiKey": "YOUR_API_KEY"
    },
    "path": "/skills/weather-query"
  }
]
```

---

## ⚠️ **错误处理**

### **常见错误**

| 错误 | 描述 |
|------|------|
| Skill not found | 技能不存在 |
| Invalid config | 配置验证失败 |
| Skill directory not found | 技能目录不存在 |
| Required file missing | 必要文件缺失 |

---

## 🔒 **安全建议**

1. ✅ 配置文件不应包含明文密码
2. ✅ 使用环境变量存储敏感信息
3. ✅ 定期验证技能完整性
4. ✅ 限制配置文件访问权限

---

## 📝 **最佳实践**

### **1. 配置管理**
```typescript
// ❌ 错误：硬编码API Key
await skillManager.configureSkill('weather-query', {
  apiKey: 'hardcoded-api-key'
})

// ✅ 正确：使用环境变量
await skillManager.configureSkill('weather-query', {
  apiKey: process.env.WEATHER_API_KEY
})
```

---

### **2. 错误处理**
```typescript
try {
  await skillManager.enableSkill('weather-query')
} catch (error) {
  console.error('启用技能失败:', error.message)
  // 降级处理或通知用户
}
```

---

### **3. 验证技能**
```typescript
// 安装后立即验证
const result = await skillManager.validateSkill('weather-query')

if (!result.valid) {
  console.warn('技能验证警告:', result.warnings)
  console.error('技能验证错误:', result.errors)

  // 根据错误严重程度决定是否继续
}
```

---

_文档版本: 1.0.0_
_最后更新: 2026-03-14_
