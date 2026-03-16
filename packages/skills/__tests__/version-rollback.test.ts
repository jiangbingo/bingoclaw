// packages/skills/__tests__/version-rollback.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { VersionRollback } from '../version-rollback'
import * as fs from 'fs'
import * as path from 'path'

describe('VersionRollback', () => {
  let rollback: VersionRollback
  const testDir = '/tmp/test-skills-rollback'

  beforeEach(() => {
    // 创建测试目录
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true })
    }

    rollback = new VersionRollback(testDir)
  })

  afterEach(() => {
    // 清理测试目录
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true })
    }
  })

  describe('recordVersion', () => {
    it('should record new version', async () => {
      const skillDir = path.join(testDir, 'test-skill')
      fs.mkdirSync(skillDir, { recursive: true })

      // 创建一些文件
      fs.writeFileSync(path.join(skillDir, 'index.js'), 'console.log("test")')
      fs.writeFileSync(
        path.join(skillDir, 'config.json'),
        JSON.stringify({ apiKey: 'test' })
      )

      await rollback.recordVersion('test-skill', '1.0.0', { apiKey: 'test' })

      const history = await rollback.getVersionHistory('test-skill')

      expect(history).toHaveLength(1)
      expect(history[0].version).toBe('1.0.0')
      expect(history[0].config).toEqual({ apiKey: 'test' })
    })

    it('should append multiple versions', async () => {
      const skillDir = path.join(testDir, 'test-skill')
      fs.mkdirSync(skillDir, { recursive: true })

      await rollback.recordVersion('test-skill', '1.0.0', { key: 'v1' })
      await rollback.recordVersion('test-skill', '1.1.0', { key: 'v2' })
      await rollback.recordVersion('test-skill', '2.0.0', { key: 'v3' })

      const history = await rollback.getVersionHistory('test-skill')

      expect(history).toHaveLength(3)
      expect(history[0].version).toBe('1.0.0')
      expect(history[2].version).toBe('2.0.0')
    })
  })

  describe('getVersionHistory', () => {
    it('should return empty array for non-existent skill', async () => {
      const history = await rollback.getVersionHistory('non-existent')

      expect(history).toHaveLength(0)
    })
  })

  describe('rollbackToVersion', () => {
    it('should rollback to previous version', async () => {
      const skillDir = path.join(testDir, 'test-skill')
      fs.mkdirSync(skillDir, { recursive: true })

      await rollback.recordVersion('test-skill', '1.0.0', { key: 'v1' })
      await rollback.recordVersion('test-skill', '2.0.0', { key: 'v2' })

      const result = await rollback.rollbackToVersion('test-skill', '1.0.0')

      expect(result.success).toBe(true)
      expect(result.currentVersion).toBe('1.0.0')
      expect(result.previousVersion).toBe('2.0.0')
    })

    it('should fail for non-existent version', async () => {
      const result = await rollback.rollbackToVersion('test-skill', '999.0.0')

      expect(result.success).toBe(false)
      expect(result.errors).toContain('Version 999.0.0 not found')
    })
  })

  describe('createSnapshot', () => {
    it('should create snapshot', async () => {
      const skillDir = path.join(testDir, 'test-skill')
      fs.mkdirSync(skillDir, { recursive: true })

      fs.writeFileSync(path.join(skillDir, 'test.txt'), 'test content')

      await rollback.recordVersion('test-skill', '1.0.0', { key: 'value' })

      const snapshot = await rollback.createSnapshot(
        'test-skill',
        'Test snapshot'
      )

      expect(snapshot.id).toBeDefined()
      expect(snapshot.skillId).toBe('test-skill')
      expect(snapshot.version).toBe('1.0.0')
      expect(snapshot.description).toBe('Test snapshot')
      expect(snapshot.files.length).toBeGreaterThan(0)
    })

    it('should throw error for non-existent skill', async () => {
      await expect(
        rollback.createSnapshot('non-existent')
      ).rejects.toThrow('Skill not found')
    })
  })

  describe('restoreSnapshot', () => {
    it('should restore snapshot', async () => {
      const skillDir = path.join(testDir, 'test-skill')
      fs.mkdirSync(skillDir, { recursive: true })

      fs.writeFileSync(path.join(skillDir, 'original.txt'), 'original content')

      await rollback.recordVersion('test-skill', '1.0.0', { key: 'original' })

      const snapshot = await rollback.createSnapshot('test-skill', 'Before changes')

      // 修改文件
      fs.writeFileSync(path.join(skillDir, 'modified.txt'), 'modified content')

      // 恢复快照
      const result = await rollback.restoreSnapshot(snapshot.id)

      expect(result.success).toBe(true)
      expect(result.currentVersion).toBe('1.0.0')
      expect(result.restoredFiles.length).toBeGreaterThan(0)
    })

    it('should fail for non-existent snapshot', async () => {
      const result = await rollback.restoreSnapshot('non-existent')

      expect(result.success).toBe(false)
      expect(result.errors).toContain('Snapshot not found: non-existent')
    })
  })

  describe('listSnapshots', () => {
    it('should list all snapshots', async () => {
      const skillDir = path.join(testDir, 'test-skill')
      fs.mkdirSync(skillDir, { recursive: true })

      // 先记录版本，确保 skill 存在
      await rollback.recordVersion('test-skill', '1.0.0', {})

      // 创建两个快照
      const snapshot1 = await rollback.createSnapshot('test-skill', 'Snapshot 1')
      expect(snapshot1.id).toBeDefined()

      const snapshot2 = await rollback.createSnapshot('test-skill', 'Snapshot 2')
      expect(snapshot2.id).toBeDefined()

      const snapshots = await rollback.listSnapshots('test-skill')

      expect(snapshots).toHaveLength(2)
    })

    it('should filter by skillId', async () => {
      const skill1Dir = path.join(testDir, 'skill-1')
      const skill2Dir = path.join(testDir, 'skill-2')
      fs.mkdirSync(skill1Dir, { recursive: true })
      fs.mkdirSync(skill2Dir, { recursive: true })

      await rollback.recordVersion('skill-1', '1.0.0', {})
      await rollback.recordVersion('skill-2', '1.0.0', {})

      await rollback.createSnapshot('skill-1', 'Skill 1 snapshot')
      await rollback.createSnapshot('skill-2', 'Skill 2 snapshot')

      const snapshots = await rollback.listSnapshots('skill-1')

      expect(snapshots).toHaveLength(1)
      expect(snapshots[0].skillId).toBe('skill-1')
    })
  })

  describe('deleteSnapshot', () => {
    it('should delete snapshot', async () => {
      const skillDir = path.join(testDir, 'test-skill')
      fs.mkdirSync(skillDir, { recursive: true })

      await rollback.recordVersion('test-skill', '1.0.0', {})

      const snapshot = await rollback.createSnapshot('test-skill', 'To be deleted')

      const deleted = await rollback.deleteSnapshot(snapshot.id)

      expect(deleted).toBe(true)

      const snapshots = await rollback.listSnapshots('test-skill')
      expect(snapshots.find(s => s.id === snapshot.id)).toBeUndefined()
    })

    it('should return false for non-existent snapshot', async () => {
      const deleted = await rollback.deleteSnapshot('non-existent')

      expect(deleted).toBe(false)
    })
  })
})
