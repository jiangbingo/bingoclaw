# 版本回滚 API 文档

**版本**: v1.0.0
**模块**: packages/skills/version-rollback.ts

---

## 📋 **概览**

版本回滚管理器提供技能的版本历史记录、回滚和快照功能。

---

## 🔧 **核心功能**

### **1. 获取版本历史**

**方法**: `getVersionHistory(skillId: string)`

**描述**: 获取技能的版本历史记录

---

#### **使用示例**
```typescript
import { versionRollback } from '@bingoclaw/skills'

const history = await versionRollback.getVersionHistory('weather-query')

console.log(history)
// [
//   {
//     version: '1.2.0',
//     installedAt: Date,
//     config: { apiKey: '...' },
//     changelog: '新增空气质量查询',
//     files: ['index.js', 'config.json'],
//     checksum: 'abc123'
//   },
//   {
//     version: '1.1.0',
//     installedAt: Date,
//     config: { apiKey: '...' },
//     changelog: '修复天气查询Bug',
//     files: ['index.js', 'config.json'],
//     checksum: 'def456'
//   }
// ]
```

---

### **2. 记录新版本**

**方法**: `recordVersion(skillId: string, version: string, config: SkillConfig, changelog?: string)`

**描述**: 记录技能的新版本

---

#### **使用示例**
```typescript
await versionRollback.recordVersion(
  'weather-query',
  '1.3.0',
  { apiKey: 'new-api-key' },
  '新增7天预报功能'
)
```

---

### **3. 回滚到指定版本**

**方法**: `rollbackToVersion(skillId: string, targetVersion: string)`

**描述**: 回滚技能到指定版本

---

#### **使用示例**
```typescript
const result = await versionRollback.rollbackToVersion(
  'weather-query',
  '1.1.0'
)

console.log(result)
// {
//   success: true,
//   previousVersion: '1.2.0',
//   currentVersion: '1.1.0',
//   restoredFiles: ['config.json'],
//   errors: []
// }
```

---

### **4. 创建快照**

**方法**: `createSnapshot(skillId: string, description?: string)`

**描述**: 创建技能的快照备份

---

#### **使用示例**
```typescript
const snapshot = await versionRollback.createSnapshot(
  'weather-query',
  '升级前备份'
)

console.log(snapshot)
// {
//   id: 'weather-query-1710423600000',
//   skillId: 'weather-query',
//   version: '1.2.0',
//   createdAt: Date,
//   config: { apiKey: '...' },
//   files: [
//     { path: 'index.js', content: '...' },
//     { path: 'config.json', content: '...' }
//   ],
//   description: '升级前备份'
// }
```

---

### **5. 恢复快照**

**方法**: `restoreSnapshot(snapshotId: string)`

**描述**: 恢复到快照状态

---

#### **使用示例**
```typescript
const result = await versionRollback.restoreSnapshot(
  'weather-query-1710423600000'
)

console.log(result)
// {
//   success: true,
//   previousVersion: '1.3.0',
//   currentVersion: '1.2.0',
//   restoredFiles: ['index.js', 'config.json'],
//   errors: []
// }
```

---

### **6. 列出所有快照**

**方法**: `listSnapshots(skillId?: string)`

**描述**: 列出所有快照或指定技能的快照

---

#### **使用示例**
```typescript
const snapshots = await versionRollback.listSnapshots('weather-query')

console.log(snapshots)
// [
//   {
//     id: 'weather-query-1710423600000',
//     skillId: 'weather-query',
//     version: '1.2.0',
//     createdAt: Date,
//     description: '升级前备份'
//   }
// ]
```

---

### **7. 删除快照**

**方法**: `deleteSnapshot(snapshotId: string)`

**描述**: 删除指定快照

---

#### **使用示例**
```typescript
const deleted = await versionRollback.deleteSnapshot(
  'weather-query-1710423600000'
)

console.log(deleted) // true or false
```

---

## 📊 **数据结构**

### **Version**
```typescript
interface Version {
  version: string
  installedAt: Date
  config: Record<string, unknown>
  changelog?: string
  files: string[]
  checksum: string
}
```

---

### **Snapshot**
```typescript
interface Snapshot {
  id: string
  skillId: string
  version: string
  createdAt: Date
  config: Record<string, unknown>
  files: { path: string; content: string }[]
  description?: string
}
```

---

### **RollbackResult**
```typescript
interface RollbackResult {
  success: boolean
  previousVersion: string
  currentVersion: string
  restoredFiles: string[]
  errors: string[]
}
```

---

## 💡 **使用场景**

### **场景1: 升级前备份**
```typescript
// 1. 创建快照
const snapshot = await versionRollback.createSnapshot(
  'weather-query',
  '升级到1.3.0前备份'
)

// 2. 升级技能
await upgradeSkill('weather-query', '1.3.0')

// 3. 测试新版本
const testResult = await testSkill('weather-query')

// 4. 如果测试失败，回滚
if (!testResult.success) {
  await versionRollback.restoreSnapshot(snapshot.id)
  console.log('升级失败，已回滚到旧版本')
}
```

---

### **场景2: 版本回滚**
```typescript
// 1. 查看版本历史
const history = await versionRollback.getVersionHistory('weather-query')

console.log('可用版本:')
history.forEach(v => {
  console.log(`${v.version} - ${v.changelog} (${v.installedAt})`)
})

// 2. 选择要回滚的版本
const targetVersion = await askUser('选择要回滚的版本:')

// 3. 执行回滚
const result = await versionRollback.rollbackToVersion(
  'weather-query',
  targetVersion
)

if (result.success) {
  console.log(`已回滚到 ${result.currentVersion}`)
} else {
  console.error('回滚失败:', result.errors)
}
```

---

### **场景3: 定期快照**
```typescript
// 每周自动创建快照
async function weeklySnapshot() {
  const skills = await skillManager.listInstalled()

  for (const skill of skills) {
    await versionRollback.createSnapshot(
      skill.id,
      `每周备份 - ${new Date().toISOString().split('T')[0]}`
    )
  }

  console.log(`已为 ${skills.length} 个技能创建快照`)
}

// 清理旧快照（保留最近5个）
async function cleanupOldSnapshots(skillId: string) {
  const snapshots = await versionRollback.listSnapshots(skillId)

  if (snapshots.length > 5) {
    const toDelete = snapshots.slice(5)
    for (const snapshot of toDelete) {
      await versionRollback.deleteSnapshot(snapshot.id)
    }
    console.log(`已删除 ${toDelete.length} 个旧快照`)
  }
}
```

---

## 💾 **存储位置**

### **版本历史**
```
{skillsDir}/.history/{skillId}.json
```

---

### **快照**
```
{skillsDir}/.snapshots/{snapshotId}.json
```

---

## ⚠️ **注意事项**

### **1. 快照管理**
```
✅ 定期清理旧快照
✅ 重要变更前创建快照
✅ 快照会占用磁盘空间
```

---

### **2. 版本回滚**
```
✅ 回滚可能丢失配置
✅ 回滚前建议创建快照
✅ 检查依赖兼容性
```

---

### **3. 数据安全**
```
✅ 快照包含敏感配置
✅ 限制快照访问权限
✅ 加密敏感数据
```

---

_文档版本: 1.0.0_
_最后更新: 2026-03-14_
