// apps/web/src/components/FilterPanel.tsx
import React from 'react'

interface FilterPanelProps {
  category: string
  sortBy: string
  showInstalledOnly: boolean
  onCategoryChange: (category: string) => void
  onSortChange: (sortBy: string) => void
  onInstalledFilterChange: (show: boolean) => void
}

const CATEGORIES = [
  { value: 'all', label: '全部分类' },
  { value: 'utility', label: '工具' },
  { value: 'ai', label: 'AI' },
  { value: 'data', label: '数据' },
  { value: 'media', label: '媒体' },
  { value: 'dev', label: '开发' },
]

const SORT_OPTIONS = [
  { value: 'rating', label: '评分最高' },
  { value: 'downloads', label: '下载最多' },
  { value: 'updated', label: '最近更新' },
  { value: 'name', label: '名称排序' },
]

export function FilterPanel({
  category,
  sortBy,
  showInstalledOnly,
  onCategoryChange,
  onSortChange,
  onInstalledFilterChange,
}: FilterPanelProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      {/* Category Filter */}
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      {/* Sort Options */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Installed Filter */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showInstalledOnly}
          onChange={(e) => onInstalledFilterChange(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">仅显示已安装</span>
      </label>

      {/* Reset Button */}
      {(category !== 'all' || sortBy !== 'rating' || showInstalledOnly) && (
        <button
          onClick={() => {
            onCategoryChange('all')
            onSortChange('rating')
            onInstalledFilterChange(false)
          }}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          重置筛选
        </button>
      )}
    </div>
  )
}
