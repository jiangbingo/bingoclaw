// apps/web/src/components/SkillCard.tsx
import React from 'react'

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

export function SkillCard({ skill, onInstall, onViewDetail }: SkillCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="text-4xl">{skill.icon}</div>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {skill.category}
        </span>
      </div>

      {/* Title & Description */}
      <h3 className="text-lg font-semibold mb-2 text-gray-900">
        {skill.name}
      </h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {skill.description}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-3 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">⭐</span>
          <span className="text-gray-700">{skill.rating.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-400">📥</span>
          <span className="text-gray-700">
            {skill.downloads >= 1000
              ? `${(skill.downloads / 1000).toFixed(1)}k`
              : skill.downloads}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {skill.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetail(skill.id)}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          详情
        </button>
        <button
          onClick={() => onInstall(skill.id)}
          className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          安装
        </button>
      </div>
    </div>
  )
}
