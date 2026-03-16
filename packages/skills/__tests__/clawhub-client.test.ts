// packages/skills/__tests__/clawhub-client.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ClawHubClient } from '../clawhub-client'

describe('ClawHubClient', () => {
  let client: ClawHubClient

  beforeEach(() => {
    client = new ClawHubClient({
      baseUrl: 'https://api.test.com/v1',
      timeout: 5000,
      retries: 2,
    })
  })

  describe('searchSkills', () => {
    it('should search skills with query', async () => {
      const mockResponse = {
        skills: [
          {
            id: 'test-skill',
            name: 'Test Skill',
            description: 'A test skill',
            author: 'test-author',
            version: '1.0.0',
            rating: 4.5,
            downloads: 100,
            category: 'test',
            tags: ['test'],
          },
        ],
        total: 1,
        page: 1,
        hasMore: false,
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await client.searchSkills({ query: 'test' })

      expect(result.skills).toHaveLength(1)
      expect(result.skills[0].name).toBe('Test Skill')
      expect(result.total).toBe(1)
    })

    it('should handle search errors', async () => {
      // Mock 所有重试都失败
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(client.searchSkills({ query: 'test' })).rejects.toThrow('Network error')
    })
  })

  describe('getSkillDetail', () => {
    it('should get skill detail', async () => {
      const mockSkill = {
        id: 'test-skill',
        name: 'Test Skill',
        description: 'A test skill',
        author: 'test-author',
        version: '1.0.0',
        rating: 4.5,
        downloads: 100,
        category: 'test',
        tags: ['test'],
        readme: '# Test Skill\n\nThis is a test skill.',
        examples: [],
        versions: [],
        configSchema: {},
        lastUpdated: '2026-03-14',
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockSkill,
      })

      const result = await client.getSkillDetail('test-skill')

      expect(result.name).toBe('Test Skill')
      expect(result.readme).toContain('test skill')
    })

    it('should handle skill not found', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(client.getSkillDetail('nonexistent')).rejects.toThrow()
    })
  })

  describe('installSkill', () => {
    it('should install skill', async () => {
      const mockResult = {
        success: true,
        installedPath: '/path/to/skill',
        config: { apiKey: 'test' },
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      })

      const result = await client.installSkill('test-skill')

      expect(result.success).toBe(true)
      expect(result.installedPath).toBe('/path/to/skill')
    })

    it('should handle install failure', async () => {
      const mockResult = {
        success: false,
        installedPath: '',
        config: {},
        error: 'Installation failed',
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      })

      const result = await client.installSkill('test-skill')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Installation failed')
    })
  })

  describe('updateSkill', () => {
    it('should update skill', async () => {
      const mockResult = {
        success: true,
        oldVersion: '1.0.0',
        newVersion: '2.0.0',
        migrations: ['migration1'],
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      })

      const result = await client.updateSkill('test-skill')

      expect(result.success).toBe(true)
      expect(result.oldVersion).toBe('1.0.0')
      expect(result.newVersion).toBe('2.0.0')
    })
  })

  describe('uninstallSkill', () => {
    it('should uninstall skill', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      const result = await client.uninstallSkill('test-skill')

      expect(result.success).toBe(true)
    })
  })

  describe('checkUpdates', () => {
    it('should check for updates', async () => {
      const mockResult = {
        hasUpdates: true,
        updates: [
          {
            skillId: 'test-skill',
            currentVersion: '1.0.0',
            latestVersion: '2.0.0',
            updateAvailable: true,
          },
        ],
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      })

      const result = await client.checkUpdates()

      expect(result.hasUpdates).toBe(true)
      expect(result.updates).toHaveLength(1)
    })
  })

  describe('retry mechanism', () => {
    it('should retry on failure', async () => {
      // 客户端配置 retries: 2，意味着总共会尝试 3 次
      // 所以前 2 次失败，第 3 次成功
      global.fetch = vi
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ skills: [], total: 0, page: 1, hasMore: false }),
        })

      const result = await client.searchSkills({ query: 'test' })

      expect(global.fetch).toHaveBeenCalledTimes(3)
      expect(result.skills).toHaveLength(0)
    })
  })
})
