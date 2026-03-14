// packages/skills/__tests__/conflict-detector.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { ConflictDetector } from '../conflict-detector'
import { InstalledSkill } from '../skill-manager'

describe('ConflictDetector', () => {
  let detector: ConflictDetector
  const installedSkills: InstalledSkill[] = [
    {
      id: 'skill-1',
      name: 'Skill 1',
      version: '1.0.0',
      enabled: true,
      installedAt: new Date(),
      lastUpdated: new Date(),
      config: {
        port: 3000,
        path: '/data/skill1',
        apiKey: 'key1',
      },
      path: '/skills/skill-1',
    },
    {
      id: 'skill-2',
      name: 'Skill 2',
      version: '1.0.0',
      enabled: true,
      installedAt: new Date(),
      lastUpdated: new Date(),
      config: {
        port: 3000, // 端口冲突
        path: '/data/skill2',
        apiKey: 'key2', // 配置冲突
      },
      path: '/skills/skill-2',
    },
  ]

  beforeEach(() => {
    detector = new ConflictDetector()
  })

  describe('detectConflicts', () => {
    it('should detect all types of conflicts', async () => {
      const conflicts = await detector.detectConflicts('skill-1', installedSkills)

      expect(conflicts.length).toBeGreaterThan(0)
    })
  })

  describe('detectVersionConflicts', () => {
    it('should detect version conflicts', async () => {
      const conflicts = await detector.detectVersionConflicts('skill-1', installedSkills)

      expect(Array.isArray(conflicts)).toBe(true)
    })
  })

  describe('detectResourceConflicts', () => {
    it('should detect port conflicts', async () => {
      const conflicts = await detector.detectResourceConflicts('skill-1', installedSkills)

      const portConflict = conflicts.find(c => c.type === 'resource' && c.resource === 'port')

      expect(portConflict).toBeDefined()
      expect(portConflict?.severity).toBe('error')
      expect(portConflict?.affectedSkills).toContain('skill-1')
      expect(portConflict?.affectedSkills).toContain('skill-2')
    })

    it('should detect path conflicts', async () => {
      const skills: InstalledSkill[] = [
        {
          id: 'skill-a',
          name: 'Skill A',
          version: '1.0.0',
          enabled: true,
          installedAt: new Date(),
          lastUpdated: new Date(),
          config: {
            dataPath: '/data/shared',
          },
          path: '/skills/skill-a',
        },
        {
          id: 'skill-b',
          name: 'Skill B',
          version: '1.0.0',
          enabled: true,
          installedAt: new Date(),
          lastUpdated: new Date(),
          config: {
            dataPath: '/data/shared', // 路径冲突
          },
          path: '/skills/skill-b',
        },
      ]

      const conflicts = await detector.detectResourceConflicts('skill-a', skills)

      const pathConflict = conflicts.find(c => c.type === 'resource' && c.resource === 'path')

      expect(pathConflict).toBeDefined()
    })
  })

  describe('detectConfigConflicts', () => {
    it('should detect config conflicts', async () => {
      const conflicts = await detector.detectConfigConflicts('skill-1', installedSkills)

      const configConflict = conflicts.find(c => c.type === 'config')

      expect(configConflict).toBeDefined()
      expect(configConflict?.configKey).toBe('apiKey')
    })

    it('should not detect conflict for same config values', async () => {
      const skills: InstalledSkill[] = [
        {
          id: 'skill-x',
          name: 'Skill X',
          version: '1.0.0',
          enabled: true,
          installedAt: new Date(),
          lastUpdated: new Date(),
          config: {
            sharedConfig: 'same-value',
          },
          path: '/skills/skill-x',
        },
        {
          id: 'skill-y',
          name: 'Skill Y',
          version: '1.0.0',
          enabled: true,
          installedAt: new Date(),
          lastUpdated: new Date(),
          config: {
            sharedConfig: 'same-value', // 相同值，不应冲突
          },
          path: '/skills/skill-y',
        },
      ]

      const conflicts = await detector.detectConfigConflicts('skill-x', skills)

      const configConflict = conflicts.find(c => c.configKey === 'sharedConfig')

      expect(configConflict).toBeUndefined()
    })
  })

  describe('resolveConflict', () => {
    it('should auto-resolve informational conflicts', async () => {
      // 创建一个 info 级别的冲突
      await detector.detectConflicts('skill-1', installedSkills)

      const conflicts = detector.getAllConflicts()
      const infoConflict = conflicts.find(c => c.severity === 'info')

      if (infoConflict) {
        const resolution = await detector.resolveConflict(infoConflict.id)

        expect(resolution.strategy).toBe('auto')
        expect(resolution.result).toBe('resolved')
      }
    })

    it('should require manual resolution for errors', async () => {
      await detector.detectConflicts('skill-1', installedSkills)

      const conflicts = detector.getAllConflicts()
      const errorConflict = conflicts.find(c => c.severity === 'error')

      if (errorConflict) {
        const resolution = await detector.resolveConflict(errorConflict.id)

        expect(resolution.strategy).toBe('manual')
        expect(resolution.result).toBe('pending')
      }
    })

    it('should return failed for non-existent conflict', async () => {
      const resolution = await detector.resolveConflict('non-existent')

      expect(resolution.result).toBe('failed')
    })
  })

  describe('clearConflict', () => {
    it('should clear conflict', async () => {
      await detector.detectConflicts('skill-1', installedSkills)

      const conflicts = detector.getAllConflicts()
      expect(conflicts.length).toBeGreaterThan(0)

      const firstConflict = conflicts[0]
      detector.clearConflict(firstConflict.id)

      const remainingConflicts = detector.getAllConflicts()
      expect(remainingConflicts.find(c => c.id === firstConflict.id)).toBeUndefined()
    })
  })
})
