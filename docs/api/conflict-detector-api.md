# 冲突检测 API 文档

**版本**: v1.0.0
**模块**: packages/skills/conflict-detector.ts

---

## 📋 **概览**

冲突检测器用于检测技能之间的版本、资源和配置冲突，并提供解决建议。

---

## 🔧 **核心功能**

### **1. 检测所有冲突**

**方法**: `detectConflicts(skillId: string, installedSkills: InstalledSkill[])`

**描述**: 检测指定技能与已安装技能之间的所有冲突

---

#### **使用示例**
```typescript
import { conflictDetector } from '@bingoclaw/skills'

const conflicts = await conflictDetector.detectConflicts(
  'weather-query',
  installedSkills
)

console.log(conflicts)
// [
//   {
//     id: 'skill1-skill2-port',
//     type: 'resource',
//     severity: 'error',
//     message: 'Port conflict detected: 3000',
//     affectedSkills: ['skill1', 'skill2'],
//     resource: 'port',
//     usage: ['3000'],
//     resolution: 'Change port configuration for one of the skills',
//     timestamp: Date
//   }
// ]
```

---

### **2. 检测版本冲突**

**方法**: `detectVersionConflicts(skillId: string, installedSkills: InstalledSkill[])`

**描述**: 检测版本冲突

---

#### **使用示例**
```typescript
const versionConflicts = await conflictDetector.detectVersionConflicts(
  'weather-query',
  installedSkills
)

console.log(versionConflicts)
// [
//   {
//     id: 'skill1-skill2-axios-version',
//     type: 'version',
//     severity: 'warning',
//     message: 'Version conflict for dependency axios',
//     affectedSkills: ['skill1', 'skill2'],
//     dependency: 'axios',
//     installedVersion: '1.0.0',
//     requiredVersion: '2.0.0',
//     resolution: 'Update both skills to use compatible versions'
//   }
// ]
```

---

### **3. 检测资源冲突**

**方法**: `detectResourceConflicts(skillId: string, installedSkills: InstalledSkill[])`

**描述**: 检测资源冲突（端口、路径等）

---

#### **使用示例**
```typescript
const resourceConflicts = await conflictDetector.detectResourceConflicts(
  'weather-query',
  installedSkills
)

console.log(resourceConflicts)
// [
//   {
//     id: 'skill1-skill2-port',
//     type: 'resource',
//     severity: 'error',
//     message: 'Port conflict detected: 3000',
//     affectedSkills: ['skill1', 'skill2'],
//     resource: 'port',
//     usage: ['3000'],
//     resolution: 'Change port configuration for one of the skills'
//   }
// ]
```

---

### **4. 检测配置冲突**

**方法**: `detectConfigConflicts(skillId: string, installedSkills: InstalledSkill[])`

**描述**: 检测配置冲突

---

#### **使用示例**
```typescript
const configConflicts = await conflictDetector.detectConfigConflicts(
  'weather-query',
  installedSkills
)

console.log(configConflicts)
// [
//   {
//     id: 'skill1-skill2-apiKey-config',
//     type: 'config',
//     severity: 'warning',
//     message: 'Configuration conflict for key: apiKey',
//     affectedSkills: ['skill1', 'skill2'],
//     configKey: 'apiKey',
//     conflictingValues: {
//       skill1: 'key1',
//       skill2: 'key2'
//     },
//     resolution: 'Review and update configuration'
//   }
// ]
```

---

### **5. 解决冲突**

**方法**: `resolveConflict(conflictId: string)`

**描述**: 解决指定冲突

---

#### **使用示例**
```typescript
const resolution = await conflictDetector.resolveConflict('conflict-id')

console.log(resolution)
// {
//   conflictId: 'conflict-id',
//   strategy: 'auto' | 'manual',
//   action: 'Ignored informational conflict',
//   result: 'resolved' | 'failed' | 'pending'
// }
```

---

## 📊 **数据结构**

### **Conflict**
```typescript
interface Conflict {
  id: string
  type: 'version' | 'resource' | 'config'
  severity: 'error' | 'warning' | 'info'
  message: string
  affectedSkills: string[]
  resolution?: string
  timestamp: Date
}
```

---

### **VersionConflict**
```typescript
interface VersionConflict extends Conflict {
  type: 'version'
  dependency: string
  installedVersion: string
  requiredVersion: string
}
```

---

### **ResourceConflict**
```typescript
interface ResourceConflict extends Conflict {
  type: 'resource'
  resource: string
  usage: string[]
}
```

---

### **ConfigConflict**
```typescript
interface ConfigConflict extends Conflict {
  type: 'config'
  configKey: string
  conflictingValues: Record<string, unknown>
}
```

---

## 💡 **使用场景**

### **场景1: 安装前检查**
```typescript
// 检查新技能是否会产生冲突
const conflicts = await conflictDetector.detectConflicts(
  newSkillId,
  installedSkills
)

// 如果有严重冲突，阻止安装
const hasErrors = conflicts.some(c => c.severity === 'error')
if (hasErrors) {
  console.error('无法安装，存在严重冲突')
  conflicts.forEach(c => console.error(c.message))
} else {
  // 显示警告，让用户决定
  const warnings = conflicts.filter(c => c.severity === 'warning')
  if (warnings.length > 0) {
    const shouldInstall = await askUser('存在警告，是否继续安装？')
    if (!shouldInstall) return
  }

  // 继续安装
  await installSkill(newSkillId)
}
```

---

### **场景2: 自动解决冲突**
```typescript
const conflicts = await conflictDetector.detectConflicts(skillId, installedSkills)

for (const conflict of conflicts) {
  if (conflict.severity === 'info') {
    // 自动解决信息级别的冲突
    await conflictDetector.resolveConflict(conflict.id)
  } else if (conflict.severity === 'error') {
    // 手动解决错误级别的冲突
    console.error(`冲突: ${conflict.message}`)
    console.log(`建议: ${conflict.resolution}`)

    // 等待用户处理
    await waitForUserAction()
  }
}
```

---

## ⚠️ **注意事项**

### **1. 冲突严重性**
```
🔴 error: 阻止安装/运行
🟡 warning: 警告，但可继续
🔵 info: 信息提示
```

---

### **2. 资源冲突类型**
```
✅ 端口冲突（同一端口被多个技能使用）
✅ 路径冲突（同一文件路径被多个技能使用）
✅ 环境变量冲突（同一环境变量被不同技能使用）
```

---

### **3. 自动解决策略**
```
✅ info 级别: 自动忽略
⚠️ warning 级别: 需要确认
❌ error 级别: 必须手动解决
```

---

_文档版本: 1.0.0_
_最后更新: 2026-03-14_
