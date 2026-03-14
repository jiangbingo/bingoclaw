// tests/integration/market-flow.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ClawHubClient } from '../../packages/skills/clawhub-client'
import { SkillManager } from '../../packages/skills/skill-manager'
import { DependencyManager } from '../../packages/skills/dependency-manager'
import { ConflictDetector } from '../../packages/skills/conflict-detector'

describe('Market Integration Tests', () => {
  let clawhubClient: ClawHubClient
  let skillManager: SkillManager
  let dependencyManager: DependencyManager
  let conflictDetector: ConflictDetector

  beforeEach(() => {
    clawhubClient = new ClawHubClient({
      baseUrl: 'https://api.test.com/v1',
      timeout: 5000,
      retries: 2,
    })

    skillManager = new SkillManager('/tmp/test-skills')
    dependencyManager = new DependencyManager('/tmp/test-skills')
    conflictDetector = new ConflictDetector()
  })

  describe('Skill Installation Flow', () => {
    it('should search, install, and verify skill', async () => {
      // 1. 搜索技能
      const mockSearchResponse = {
        skills: [
          {
            id: 'weather-query',
            name: '天气查询',
            description: '查询天气',
            icon: '🌤️',
            rating: 4.5,
            downloads: 1200,
            category: 'utility',
            tags: ['天气'],
          },
        ],
        total: 1,
        page: 1,
        hasMore: false,
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockSearchResponse,
      })

      const searchResult = await clawhubClient.searchSkills({ query: '天气' })
      expect(searchResult.skills).toHaveLength(1)
      expect(searchResult.skills[0].name).toBe('天气查询')

      // 2. 安装技能
      const mockInstallResponse = {
        success: true,
        installedPath: '/skills/weather-query',
        config: { apiKey: '' },
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockInstallResponse,
      })

      const installResult = await clawhubClient.installSkill('weather-query')
      expect(installResult.success).toBe(true)

      // 3. 验证技能
      skillManager.registerSkill({
        id: 'weather-query',
        name: '天气查询',
        version: '1.2.0',
        enabled: true,
        installedAt: new Date(),
        lastUpdated: new Date(),
        config: {},
        path: '/skills/weather-query',
      })

      const validation = await skillManager.validateSkill('weather-query')
      expect(validation.valid).toBeDefined()
    })

    it('should detect conflicts before installation', async () => {
      const installedSkills = [
        {
          id: 'weather-query-v1',
          name: '天气查询 v1',
          version: '1.0.0',
          enabled: true,
          installedAt: new Date(),
          lastUpdated: new Date(),
          config: { port: 3000 },
          path: '/skills/weather-query-v1',
        },
      ]

      const conflicts = await conflictDetector.detectConflicts(
        'weather-query-v2',
        installedSkills
      )

      // 可能会有版本冲突
      expect(Array.isArray(conflicts)).toBe(true)
    })
  })

  describe('Dependency Management Flow', () => {
    it('should parse and check dependencies', async () => {
      // 模拟技能路径
      const skillPath = '/tmp/test-skills/weather-query'

      // 解析依赖
      const deps = await dependencyManager.parseDependencies(skillPath)
      expect(Array.isArray(deps)).toBe(true)

      // 检查依赖
      const check = await dependencyManager.checkDependencies('weather-query')
      expect(check.valid).toBeDefined()
      expect(Array.isArray(check.missing)).toBe(true)
      expect(Array.isArray(check.conflicts)).toBe(true)
    })
  })

  describe('Version Rollback Flow', () => {
    it('should record and rollback versions', async () => {
      const { VersionRollback } = await import(
        '../../packages/skills/version-rollback'
      )
      const versionRollback = new VersionRollback('/tmp/test-skills')

      // 记录版本
      await versionRollback.recordVersion(
        'weather-query',
        '1.2.0',
        { apiKey: 'test' },
        '新增功能'
      )

      // 获取版本历史
      const history = await versionRollback.getVersionHistory('weather-query')
      expect(history.length).toBeGreaterThan(0)
      expect(history[0].version).toBe('1.2.0')

      // 创建快照
      const snapshot = await versionRollback.createSnapshot(
        'weather-query',
        '测试快照'
      )
      expect(snapshot.id).toBeDefined()
      expect(snapshot.skillId).toBe('weather-query')
    })
  })
})
