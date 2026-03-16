// apps/web/src/pages/Market.tsx
// 技能市场页面 - 技能列表、搜索、过滤

import { useEffect } from 'react'
import { useMarketStore } from '../stores/marketStore'
import { SearchBar } from '../components/SearchBar'
import { FilterPanel } from '../components/FilterPanel'
import { SkillGrid } from '../components/SkillGrid'

// Mock 数据 - 后续从 API 获取
const MOCK_SKILLS = [
  {
    id: 'weather-query',
    name: '天气查询',
    description: '实时查询全球天气，支持中英文',
    icon: '🌤️',
    rating: 4.5,
    downloads: 1200,
    category: 'productivity',
    tags: ['天气', '生活', '实用'],
  },
  {
    id: 'github-integration',
    name: 'GitHub 集成',
    description: '管理 GitHub 仓库、Issues、PR',
    icon: '🐙',
    rating: 4.8,
    downloads: 2400,
    category: 'development',
    tags: ['GitHub', '开发', 'Git'],
  },
  {
    id: 'calendar-sync',
    name: '日历同步',
    description: '同步多个日历源，智能提醒',
    icon: '📅',
    rating: 4.3,
    downloads: 890,
    category: 'productivity',
    tags: ['日历', '时间管理', '提醒'],
  },
  {
    id: 'code-review',
    name: '代码审查助手',
    description: 'AI 驱动的代码审查和优化建议',
    icon: '🔍',
    rating: 4.6,
    downloads: 1500,
    category: 'development',
    tags: ['代码审查', 'AI', '开发'],
  },
  {
    id: 'translator',
    name: '多语言翻译',
    description: '支持 50+ 语言的实时翻译',
    icon: '🌐',
    rating: 4.4,
    downloads: 3200,
    category: 'productivity',
    tags: ['翻译', '语言', '国际化'],
  },
  {
    id: 'data-visualizer',
    name: '数据可视化',
    description: '将数据转换为美观的图表',
    icon: '📊',
    rating: 4.2,
    downloads: 670,
    category: 'analytics',
    tags: ['数据', '图表', '可视化'],
  },
]

export function MarketPage() {
  const { setSkills, setLoading, loading, filteredSkills } = useMarketStore()

  // 加载技能数据
  useEffect(() => {
    async function loadSkills() {
      setLoading(true)
      try {
        // TODO: 从 API 获取真实数据
        // const response = await fetch('/api/skills')
        // const skills = await response.json()

        // 模拟 API 延迟
        await new Promise((resolve) => setTimeout(resolve, 500))
        setSkills(MOCK_SKILLS)
      } catch (error) {
        console.error('Failed to load skills:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSkills()
  }, [setSkills, setLoading])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🦾 ClawHub 技能市场
          </h1>
          <p className="mt-2 text-gray-600">
            发现和安装强大的技能，扩展你的 AI 助手能力
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <FilterPanel />
        </div>

        {/* Skills Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">加载中...</div>
          </div>
        ) : (
          <SkillGrid skills={filteredSkills} />
        )}

        {/* Empty State */}
        {!loading && filteredSkills.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg">没有找到匹配的技能</p>
            <p className="text-gray-500 mt-2">试试调整搜索条件或过滤选项</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500">
          <p>© 2026 bingoClaw. Made with ❤️ by jiangbingo</p>
        </div>
      </footer>
    </div>
  )
}
