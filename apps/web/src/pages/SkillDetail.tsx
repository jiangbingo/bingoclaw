// apps/web/src/pages/SkillDetail.tsx
// 技能详情页面 - 显示技能的详细信息、安装、配置

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

interface SkillDetail {
  id: string
  name: string
  description: string
  icon: string
  version: string
  rating: number
  downloads: number
  category: string
  tags: string[]
  author: string
  homepage: string
  repository: string
  features: string[]
  examples: string
  stats: {
    size: string
    dependencies: number
    lastUpdated: string
  }
}

// Mock 数据
const MOCK_SKILL_DETAIL: SkillDetail = {
  id: 'weather-query',
  name: '天气查询',
  description: '实时查询全球天气，支持中英文',
  icon: '🌤️',
  version: '1.2.0',
  rating: 4.5,
  downloads: 1200,
  category: 'productivity',
  tags: ['天气', '生活', '实用'],
  author: '@developer',
  homepage: 'https://github.com/example/weather-skill',
  repository: 'https://github.com/example/weather-skill',
  features: [
    '✅ 实时天气查询',
    '✅ 7天预报',
    '✅ 空气质量',
    '✅ 生活指数',
    '✅ 多语言支持',
  ],
  examples: `const weather = await getWeather('北京')
console.log(weather.temp) // 25°C
console.log(weather.condition) // 晴`,
  stats: {
    size: '2.5MB',
    dependencies: 3,
    lastUpdated: '2026-03-10',
  },
}

export function SkillDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [skill, setSkill] = useState<SkillDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [installing, setInstalling] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    async function loadSkill() {
      setLoading(true)
      try {
        // TODO: 从 API 获取真实数据
        // const response = await fetch(\`/api/skills/\${id}\`)
        // const skill = await response.json()

        await new Promise((resolve) => setTimeout(resolve, 500))
        setSkill(MOCK_SKILL_DETAIL)
      } catch (error) {
        console.error('Failed to load skill:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadSkill()
    }
  }, [id])

  const handleInstall = async () => {
    if (!skill || installing) return

    setInstalling(true)
    try {
      // TODO: 调用安装 API
      // await fetch(\`/api/skills/\${skill.id}/install\`, { method: 'POST' })

      await new Promise((resolve) => setTimeout(resolve, 1000))
      setInstalled(true)
      alert('技能安装成功！')
    } catch (error) {
      console.error('Failed to install skill:', error)
      alert('安装失败，请重试')
    } finally {
      setInstalling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  if (!skill) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">❌</div>
          <p className="text-gray-600 text-lg">技能不存在</p>
          <button
            onClick={() => navigate('/market')}
            className="mt-4 text-blue-600 hover:underline"
          >
            返回技能市场
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/market')}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
          >
            <span>←</span>
            <span>返回技能市场</span>
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="text-6xl">{skill.icon}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {skill.name}
                </h1>
                <div className="flex items-center gap-4 mt-2 text-gray-600">
                  <span>版本: {skill.version}</span>
                  <span>⭐ {skill.rating}</span>
                  <span>📥 {skill.downloads}</span>
                </div>
                <p className="mt-2 text-gray-600">作者: {skill.author}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleInstall}
                disabled={installed || installing}
                className={\`px-6 py-2 rounded-lg font-medium \${
                  installed
                    ? 'bg-green-500 text-white cursor-not-allowed'
                    : installing
                      ? 'bg-gray-300 text-gray-600 cursor-wait'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                }\`}
              >
                {installed ? '✓ 已安装' : installing ? '安装中...' : '安装'}
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                收藏
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                分享
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="col-span-2 space-y-6">
            {/* 简介 */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">📖 简介</h2>
              <p className="text-gray-700">{skill.description}</p>
            </section>

            {/* 功能列表 */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">📋 功能列表</h2>
              <ul className="space-y-2">
                {skill.features.map((feature, index) => (
                  <li key={index} className="text-gray-700">
                    {feature}
                  </li>
                ))}
              </ul>
            </section>

            {/* 使用示例 */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">💻 使用示例</h2>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{skill.examples}</code>
              </pre>
            </section>

            {/* 链接 */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">🔗 相关链接</h2>
              <div className="space-y-2">
                <a
                  href={skill.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block"
                >
                  📄 项目主页
                </a>
                <a
                  href={skill.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block"
                >
                  📦 代码仓库
                </a>
              </div>
            </section>
          </div>

          {/* Right Column - Stats & Tags */}
          <div className="space-y-6">
            {/* 统计数据 */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">📊 统计数据</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">安装量</span>
                  <span className="font-medium">{skill.downloads}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">大小</span>
                  <span className="font-medium">{skill.stats.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">依赖</span>
                  <span className="font-medium">{skill.stats.dependencies}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">最后更新</span>
                  <span className="font-medium">{skill.stats.lastUpdated}</span>
                </div>
              </div>
            </section>

            {/* 标签 */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">🏷️ 标签</h2>
              <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* 分类 */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">📂 分类</h2>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
                {skill.category}
              </span>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
