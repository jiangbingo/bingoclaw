# 依赖管理 API 文档

**版本**: v1.0.0
**模块**: packages/skills/dependency-manager.ts

---

## 📋 **概览**

依赖管理器提供技能依赖的解析、安装、检查和可视化功能。

---

## 🔧 **核心功能**

### **1. 解析依赖**

**方法**: `parseDependencies(skillPath: string)`

**描述**: 从技能的 package.json 中解析依赖

---

#### **使用示例**
```typescript
import { dependencyManager } from '@bingoclaw/skills'

const deps = await dependencyManager.parseDependencies('/skills/weather-query')

console.log(deps)
// [
//   {
//     name: 'axios',
//     version: '^1.6.0',
//     required: true,
//     description: 'Required dependency: axios'
//   },
//   {
//     name: 'lodash',
//     version: '^4.17.21',
//     required: false,
//     description: 'Optional dependency: lodash'
//   }
// ]
```

---

### **2. 安装依赖**

**方法**: `installDependencies(dependencies: SkillDependency[])`

**描述**: 批量安装依赖包

---

#### **使用示例**
```typescript
const result = await dependencyManager.installDependencies(deps)

console.log(result)
// {
//   success: true,
//   installed: ['axios', 'lodash'],
//   failed: []
// }
```

---

### **3. 检查依赖**

**方法**: `checkDependencies(skillId: string)`

**描述**: 检查技能的依赖是否满足

---

#### **返回值**
```typescript
{
  valid: boolean
  missing: SkillDependency[]
  conflicts: DependencyConflict[]
  warnings: string[]
}
```

---

#### **使用示例**
```typescript
const check = await dependencyManager.checkDependencies('weather-query')

if (!check.valid) {
  console.error('缺少依赖:', check.missing)
  console.warn('依赖冲突:', check.conflicts)
}
```

---

### **4. 获取依赖树**

**方法**: `getDependencyTree(skillId: string)`

**描述**: 获取技能的依赖树结构

---

#### **使用示例**
```typescript
const tree = await dependencyManager.getDependencyTree('weather-query')

console.log(tree)
// {
//   name: 'weather-query',
//   version: '1.2.0',
//   dependencies: [
//     { name: 'axios', version: '^1.6.0', dependencies: [] },
//     { name: 'lodash', version: '^4.17.21', dependencies: [] }
//   ]
// }
```

---

## 📊 **数据结构**

### **SkillDependency**
```typescript
interface SkillDependency {
  name: string
  version: string
  required: boolean
  installed?: boolean
  description?: string
}
```

---

### **DependencyCheck**
```typescript
interface DependencyCheck {
  valid: boolean
  missing: SkillDependency[]
  conflicts: DependencyConflict[]
  warnings: string[]
}
```

---

### **DependencyConflict**
```typescript
interface DependencyConflict {
  dependency: string
  installedVersion: string
  requiredVersion: string
  severity: 'error' | 'warning'
}
```

---

### **DependencyTree**
```typescript
interface DependencyTree {
  name: string
  version: string
  dependencies: DependencyTree[]
}
```

---

## 💡 **使用场景**

### **场景1: 安装新技能前检查**
```typescript
// 1. 解析依赖
const deps = await dependencyManager.parseDependencies(skillPath)

// 2. 检查依赖
const check = await dependencyManager.checkDependencies(skillId)

// 3. 如果缺少依赖，安装它们
if (check.missing.length > 0) {
  await dependencyManager.installDependencies(check.missing)
}

// 4. 验证安装
const recheck = await dependencyManager.checkDependencies(skillId)
if (!recheck.valid) {
  throw new Error('依赖安装失败')
}
```

---

### **场景2: 依赖冲突处理**
```typescript
const check = await dependencyManager.checkDependencies(skillId)

if (check.conflicts.length > 0) {
  for (const conflict of check.conflicts) {
    if (conflict.severity === 'error') {
      console.error(
        `${conflict.dependency}: 需要 ${conflict.requiredVersion}, 但已安装 ${conflict.installedVersion}`
      )

      // 提示用户解决冲突
      const shouldUpdate = await askUser(`是否更新 ${conflict.dependency}?`)
      if (shouldUpdate) {
        // 更新依赖
        await dependencyManager.installDependencies([
          { name: conflict.dependency, version: conflict.requiredVersion, required: true }
        ])
      }
    }
  }
}
```

---

### **场景3: 依赖树可视化**
```typescript
const tree = await dependencyManager.getDependencyTree(skillId)

function printTree(node: DependencyTree, indent = 0) {
  console.log('  '.repeat(indent) + `${node.name}@${node.version}`)
  node.dependencies.forEach(dep => printTree(dep, indent + 1))
}

printTree(tree)
// weather-query@1.2.0
//   axios@^1.6.0
//   lodash@^4.17.21
```

---

## ⚠️ **注意事项**

### **1. 版本兼容性**
```
✅ 使用语义化版本（semver）
✅ 检查 ^ 和 ~ 前缀
✅ 处理 * 和 latest
```

---

### **2. 依赖安装**
```
✅ 使用 pnpm 安装（快速、节省空间）
✅ 处理网络错误（重试机制）
✅ 记录安装日志
```

---

### **3. 性能优化**
```
✅ 并行安装多个依赖
✅ 使用缓存加速
✅ 跳过已安装的依赖
```

---

_文档版本: 1.0.0_
_最后更新: 2026-03-14_
