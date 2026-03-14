// packages/skills/clawhub-client.ts
// ClawHub API 客户端 - 技能市场集成

/**
 * ClawHub API 客户端
 * 提供技能搜索、详情、安装、更新等功能
 */

export interface SearchQuery {
  query?: string
  category?: string
  sort?: 'rating' | 'downloads' | 'updated'
  page?: number
  limit?: number
}

export interface Skill {
  id: string
  name: string
  description: string
  author: string
  version: string
  rating: number
  downloads: number
  category: string
  tags: string[]
  icon?: string
  homepage?: string
  repository?: string
}

export interface SkillDetail extends Skill {
  readme: string
  examples: SkillExample[]
  versions: SkillVersion[]
  configSchema: Record<string, unknown>
  installationSize?: number
  lastUpdated: string
}

export interface SkillExample {
  title: string
  description: string
  code: string
  output?: string
}

export interface SkillVersion {
  version: string
  releasedAt: string
  changelog?: string
  breaking?: boolean
}

export interface InstallResult {
  success: boolean
  installedPath: string
  config: Record<string, unknown>
  error?: string
}

export interface UpdateResult {
  success: boolean
  oldVersion: string
  newVersion: string
  migrations: string[]
  error?: string
}

export interface UpdateCheck {
  hasUpdates: boolean
  updates: {
    skillId: string
    currentVersion: string
    latestVersion: string
    updateAvailable: boolean
  }[]
}

/**
 * ClawHub API 客户端实现
 */
export class ClawHubClient {
  private baseUrl: string
  private timeout: number
  private retries: number

  constructor(options?: {
    baseUrl?: string
    timeout?: number
    retries?: number
  }) {
    this.baseUrl = options?.baseUrl || 'https://api.clawhub.ai/v1'
    this.timeout = options?.timeout || 30000
    this.retries = options?.retries || 3
  }

  /**
   * 搜索技能
   */
  async searchSkills(query: SearchQuery): Promise<{
    skills: Skill[]
    total: number
    page: number
    hasMore: boolean
  }> {
    const params = new URLSearchParams()
    if (query.query) params.append('q', query.query)
    if (query.category) params.append('category', query.category)
    if (query.sort) params.append('sort', query.sort)
    if (query.page) params.append('page', query.page.toString())
    if (query.limit) params.append('limit', query.limit.toString())

    const response = await this.fetchWithRetry(
      `${this.baseUrl}/skills/search?${params.toString()}`
    )

    return response.json()
  }

  /**
   * 获取技能详情
   */
  async getSkillDetail(skillId: string): Promise<SkillDetail> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/skills/${skillId}`
    )

    return response.json()
  }

  /**
   * 安装技能
   */
  async installSkill(skillId: string): Promise<InstallResult> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/skills/${skillId}/install`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    return response.json()
  }

  /**
   * 更新技能
   */
  async updateSkill(skillId: string): Promise<UpdateResult> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/skills/${skillId}/update`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    return response.json()
  }

  /**
   * 卸载技能
   */
  async uninstallSkill(skillId: string): Promise<{ success: boolean }> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/skills/${skillId}`,
      {
        method: 'DELETE',
      }
    )

    return response.json()
  }

  /**
   * 检查更新
   */
  async checkUpdates(): Promise<UpdateCheck> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/skills/updates`
    )

    return response.json()
  }

  /**
   * 带重试的 fetch
   */
  private async fetchWithRetry(
    url: string,
    options?: RequestInit
  ): Promise<Response> {
    let lastError: Error | null = null

    for (let i = 0; i < this.retries; i++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return response
      } catch (error) {
        lastError = error as Error
        if (i < this.retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        }
      }
    }

    throw lastError || new Error('Unknown error')
  }
}

// 导出单例
export const clawhubClient = new ClawHubClient()
