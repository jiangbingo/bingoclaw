# Phase 1: UI 设计规范

**创建时间**: 2026-03-14 17:00
**执行时间**: 30分钟

---

## 🎨 **1.1 技能列表页布局**（10分钟）

### **页面结构**
```
┌─────────────────────────────────────────┐
│  Header: 技能市场                        │
├─────────────────────────────────────────┤
│  SearchBar + FilterPanel                 │
│  [🔍 搜索...] [分类▼] [排序▼] [已安装]   │
├─────────────────────────────────────────┤
│  SkillGrid (3列响应式)                   │
│  ┌─────┐ ┌─────┐ ┌─────┐               │
│  │ 🌤️  │ │ 🌍  │ │ 📰  │               │
│  │天气 │ │翻译 │ │新闻 │               │
│  │⭐4.5│ │⭐4.8│ │⭐4.3│               │
│  │📥1k │ │📥5k │ │📥2k │               │
│  │[安装]│ │[安装]│ │[安装]│               │
│  └─────┘ └─────┘ └─────┘               │
│  ... more skills ...                    │
├─────────────────────────────────────────┤
│  Pagination: [1] [2] [3] ... [10]       │
└─────────────────────────────────────────┘
```

---

### **组件设计**

#### **SkillCard**
```typescript
interface SkillCardProps {
  skill: {
    id: string
    name: string
    description: string
    icon: string
    rating: number
    downloads: number
    category: string
    tags: string[]
  }
  onInstall: (skillId: string) => void
  onViewDetail: (skillId: string) => void
}
```

**布局**：
```
┌─────────────┐
│ 🌤️ Icon     │
│ Name        │
│ Description │
│ ⭐ 4.5 | 📥1k│
│ [安装] [详情]│
└─────────────┘
```

---

#### **SkillGrid**
```typescript
interface SkillGridProps {
  skills: Skill[]
  loading: boolean
  onInstall: (skillId: string) => void
  onViewDetail: (skillId: string) => void
}
```

**响应式布局**：
```
桌面: 3列
平板: 2列
手机: 1列
```

---

#### **SearchBar**
```typescript
interface SearchBarProps {
  query: string
  onSearch: (query: string) => void
  placeholder?: string
}
```

**布局**：
```
[🔍 搜索技能...] [搜索]
```

---

#### **FilterPanel**
```typescript
interface FilterPanelProps {
  category: string
  onCategoryChange: (category: string) => void
  sort: 'rating' | 'downloads' | 'updated'
  onSortChange: (sort: string) => void
  showInstalled: boolean
  onShowInstalledChange: (show: boolean) => void
}
```

**布局**：
```
[分类 ▼] [排序 ▼] [✓ 已安装]
```

---

## 🎨 **1.2 技能详情页布局**（10分钟）

### **页面结构**
```
┌─────────────────────────────────────────┐
│  [← 返回] 技能详情                       │
├─────────────────────────────────────────┤
│  🌤️ 天气查询                             │
│  版本: 1.2.0 | ⭐ 4.5 | 📥 1.2k          │
│  作者: @developer                        │
├─────────────────────────────────────────┤
│  [安装] [收藏] [分享]                    │
├─────────────────────────────────────────┤
│  📖 简介                                 │
│  实时查询全球天气，支持中英文...          │
├─────────────────────────────────────────┤
│  📋 功能列表                             │
│  ✅ 实时天气查询                          │
│  ✅ 7天预报                              │
│  ✅ 空气质量                              │
│  ✅ 生活指数                              │
├─────────────────────────────────────────┤
│  💻 使用示例                             │
│  ```typescript                           │
│  const weather = await getWeather('北京')│
│  console.log(weather.temp) // 25°C       │
│  ```                                     │
├─────────────────────────────────────────┤
│  📊 统计数据                             │
│  安装: 1.2k | 更新: 2026-03-10           │
│  大小: 2.5MB | 依赖: 3                    │
├─────────────────────────────────────────┤
│  💬 评论 (23)                            │
│  ... 评论列表 ...                        │
└─────────────────────────────────────────┘
```

---

### **组件设计**

#### **SkillDetail**
```typescript
interface SkillDetailProps {
  skill: SkillDetail
  onInstall: () => void
  onFavorite: () => void
  onShare: () => void
}
```

**区域划分**：
```
1. 头部（标题 + 元信息）
2. 操作栏（安装/收藏/分享）
3. 简介区
4. 功能列表
5. 使用示例
6. 统计数据
7. 评论列表
```

---

#### **FeatureList**
```typescript
interface FeatureListProps {
  features: string[]
}
```

**布局**：
```
📋 功能列表
✅ 功能1
✅ 功能2
✅ 功能3
```

---

#### **CodeExample**
```typescript
interface CodeExampleProps {
  code: string
  language: string
}
```

**布局**：
```
💻 使用示例
```typescript
// 代码高亮显示
```
```

---

#### **CommentList**
```typescript
interface CommentListProps {
  comments: Comment[]
  onAddComment: (comment: string) => void
}
```

**布局**：
```
💬 评论 (23)
┌─────────────┐
│ @user1      │
│ 评论内容...  │
│ 2026-03-10  │
└─────────────┘
[添加评论]
```

---

## 🎨 **1.3 搜索和过滤功能**（10分钟）

### **搜索功能**

#### **关键词搜索**
```typescript
interface SearchFunctionality {
  // 实时搜索（防抖300ms）
  realtimeSearch: boolean

  // 搜索字段
  searchFields: ['name', 'description', 'tags', 'author']

  // 高亮显示
  highlightMatches: boolean
}
```

**交互流程**：
```
1. 用户输入 → 防抖300ms
2. 调用搜索API
3. 更新结果列表
4. 高亮匹配关键词
```

---

### **过滤功能**

#### **分类过滤**
```typescript
interface CategoryFilter {
  categories: [
    'all',      // 全部
    'utility',  // 工具
    'ai',       // AI
    'data',     // 数据
    'media',    // 媒体
    'dev',      // 开发
  ]
}
```

---

#### **排序选项**
```typescript
interface SortOptions {
  sortBy: [
    'rating',    // 评分
    'downloads', // 下载量
    'updated',   // 更新时间
    'name',      // 名称
  ]
  order: 'asc' | 'desc'
}
```

---

#### **已安装过滤**
```typescript
interface InstalledFilter {
  showInstalledOnly: boolean
  showUpdateAvailable: boolean
}
```

---

### **高级过滤**

#### **组合过滤**
```typescript
interface AdvancedFilter {
  // 基础过滤
  category?: string
  minRating?: number
  maxDownloads?: number

  // 高级过滤
  tags?: string[]
  author?: string
  dateRange?: {
    start: Date
    end: Date
  }

  // 排序
  sortBy: string
  order: 'asc' | 'desc'
}
```

---

### **UI 交互**

#### **搜索框**
```
[🔍 搜索技能名称、描述、标签...] [搜索]

实时提示:
- 输入时显示建议
- 显示搜索历史
- 显示热门搜索
```

---

#### **过滤面板**
```
┌─────────────────────────────────────┐
│ 🔍 高级过滤                          │
├─────────────────────────────────────┤
│ 分类: [全部 ▼]                       │
│ 评分: [⭐⭐⭐⭐⭐] 最少4星             │
│ 下载: [100+]                         │
│ 标签: [AI] [工具] [数据]             │
│ [应用] [重置]                        │
└─────────────────────────────────────┘
```

---

## 🎯 **设计原则**

### **1. 响应式设计**
```
✅ 桌面: 3列布局
✅ 平板: 2列布局
✅ 手机: 1列布局
✅ 所有组件自适应
```

---

### **2. 交互友好**
```
✅ 搜索防抖（300ms）
✅ 加载状态（骨架屏）
✅ 错误提示（Toast）
✅ 成功反馈（动画）
```

---

### **3. 性能优化**
```
✅ 虚拟滚动（长列表）
✅ 图片懒加载
✅ 防抖/节流
✅ 缓存策略
```

---

## 📦 **交付物**

### **设计文档**
```
✅ UI 设计规范（本文档）
✅ 组件结构图
✅ 交互流程图
✅ 响应式布局说明
```

---

### **设计资源**
```
✅ 颜色方案（TailwindCSS）
✅ 字体规范
✅ 间距规范
✅ 图标库（Heroicons）
```

---

_创建时间: 2026-03-14 17:00_
_预计完成: 2026-03-14 17:30_
