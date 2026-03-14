// apps/web/src/components/SkillGrid.tsx
import React from 'react'
import { SkillCard } from './SkillCard'

interface Skill {
  id: string
  name: string
  description: string
  icon: string
  rating: number
  downloads: number
  category: string
  tags: string[]
}

interface SkillGridProps {
  skills: Skill[]
  loading?: boolean
  onInstall: (skillId: string) => void
  onViewDetail: (skillId: string) => void
}

export function SkillGrid({
  skills,
  loading = false,
  onInstall,
  onViewDetail,
}: SkillGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md p-4 animate-pulse"
          >
            <div className="h-8 w-8 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded flex-1"></div>
              <div className="h-8 bg-gray-200 rounded flex-1"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (skills.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          未找到技能
        </h3>
        <p className="text-gray-600">
          尝试调整搜索条件或浏览其他分类
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills.map((skill) => (
        <SkillCard
          key={skill.id}
          skill={skill}
          onInstall={onInstall}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  )
}
