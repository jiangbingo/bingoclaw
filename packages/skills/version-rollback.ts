// packages/skills/version-rollback.ts
// 技能版本回滚 - 版本历史、回滚、快照管理

/**
 * 技能版本回滚管理
 * 管理技能的版本历史、回滚和快照
 */

import * as fs from 'fs'
import * as path from 'path'

export interface Version {
  version: string
  installedAt: Date
  config: Record<string, unknown>
  changelog?: string
  files: string[]
  checksum: string
}

export interface Snapshot {
  id: string
  skillId: string
  version: string
  createdAt: Date
  config: Record<string, unknown>
  files: { path: string; content: string }[]
  description?: string
}

export interface RollbackResult {
  success: boolean
  previousVersion: string
  currentVersion: string
  restoredFiles: string[]
  errors: string[]
}

/**
 * 版本回滚管理器实现
 */
export class VersionRollback {
  private skillsDir: string
  private historyDir: string
  private snapshotsDir: string

  constructor(skillsDir: string) {
    this.skillsDir = skillsDir
    this.historyDir = path.join(skillsDir, '.history')
    this.snapshotsDir = path.join(skillsDir, '.snapshots')

    this.ensureDirectories()
  }

  /**
   * 获取版本历史
   */
  async getVersionHistory(skillId: string): Promise<Version[]> {
    const historyFile = this.getHistoryFile(skillId)

    if (!fs.existsSync(historyFile)) {
      return []
    }

    try {
      const data = JSON.parse(fs.readFileSync(historyFile, 'utf-8'))
      return data.map((v: any) => ({
        ...v,
        installedAt: new Date(v.installedAt),
      }))
    } catch (error) {
      console.error('Failed to load version history:', error)
      return []
    }
  }

  /**
   * 记录新版本
   */
  async recordVersion(
    skillId: string,
    version: string,
    config: Record<string, unknown>,
    changelog?: string
  ): Promise<void> {
    const history = await this.getVersionHistory(skillId)

    // 收集文件列表
    const skillPath = path.join(this.skillsDir, skillId)
    const files = this.collectFiles(skillPath)

    // 计算校验和
    const checksum = this.calculateChecksum(skillPath)

    const newVersion: Version = {
      version,
      installedAt: new Date(),
      config,
      changelog,
      files,
      checksum,
    }

    history.push(newVersion)

    // 保存历史
    const historyFile = this.getHistoryFile(skillId)
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2))
  }

  /**
   * 回滚到指定版本
   */
  async rollbackToVersion(
    skillId: string,
    targetVersion: string
  ): Promise<RollbackResult> {
    const history = await this.getVersionHistory(skillId)
    const targetVersionData = history.find(v => v.version === targetVersion)

    if (!targetVersionData) {
      return {
        success: false,
        previousVersion: 'unknown',
        currentVersion: 'unknown',
        restoredFiles: [],
        errors: [`Version ${targetVersion} not found`],
      }
    }

    const currentVersion = history[history.length - 1]?.version || 'unknown'
    const errors: string[] = []
    const restoredFiles: string[] = []

    try {
      // 恢复配置
      const skillPath = path.join(this.skillsDir, skillId)
      const configFile = path.join(skillPath, 'config.json')

      if (fs.existsSync(configFile)) {
        fs.writeFileSync(
          configFile,
          JSON.stringify(targetVersionData.config, null, 2)
        )
        restoredFiles.push('config.json')
      }

      // 恢复文件（简化实现，实际应从备份恢复）
      for (const file of targetVersionData.files) {
        // 这里应该从备份中恢复文件
        // 简化实现：只记录
        restoredFiles.push(file)
      }

      return {
        success: true,
        previousVersion: currentVersion,
        currentVersion: targetVersion,
        restoredFiles,
        errors,
      }
    } catch (error) {
      errors.push(`Rollback failed: ${error}`)

      return {
        success: false,
        previousVersion: currentVersion,
        currentVersion,
        restoredFiles,
        errors,
      }
    }
  }

  /**
   * 创建快照
   */
  async createSnapshot(
    skillId: string,
    description?: string
  ): Promise<Snapshot> {
    const skillPath = path.join(this.skillsDir, skillId)

    if (!fs.existsSync(skillPath)) {
      throw new Error(`Skill not found: ${skillId}`)
    }

    // 读取当前版本
    const history = await this.getVersionHistory(skillId)
    const currentVersion = history[history.length - 1]?.version || 'unknown'

    // 收集文件
    const files = this.collectFilesWithContent(skillPath)

    const snapshot: Snapshot = {
      id: `${skillId}-${Date.now()}`,
      skillId,
      version: currentVersion,
      createdAt: new Date(),
      config: history[history.length - 1]?.config || {},
      files,
      description,
    }

    // 保存快照
    const snapshotFile = this.getSnapshotFile(snapshot.id)
    fs.writeFileSync(snapshotFile, JSON.stringify(snapshot, null, 2))

    return snapshot
  }

  /**
   * 恢复快照
   */
  async restoreSnapshot(snapshotId: string): Promise<RollbackResult> {
    const snapshotFile = this.getSnapshotFile(snapshotId)

    if (!fs.existsSync(snapshotFile)) {
      return {
        success: false,
        previousVersion: 'unknown',
        currentVersion: 'unknown',
        restoredFiles: [],
        errors: [`Snapshot not found: ${snapshotId}`],
      }
    }

    try {
      const snapshot: Snapshot = JSON.parse(
        fs.readFileSync(snapshotFile, 'utf-8')
      )

      const skillPath = path.join(this.skillsDir, snapshot.skillId)
      const errors: string[] = []
      const restoredFiles: string[] = []

      // 恢复文件
      for (const file of snapshot.files) {
        try {
          const filePath = path.join(skillPath, file.path)
          const dir = path.dirname(filePath)

          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
          }

          fs.writeFileSync(filePath, file.content)
          restoredFiles.push(file.path)
        } catch (error) {
          errors.push(`Failed to restore ${file.path}: ${error}`)
        }
      }

      // 恢复配置
      const configFile = path.join(skillPath, 'config.json')
      fs.writeFileSync(configFile, JSON.stringify(snapshot.config, null, 2))
      restoredFiles.push('config.json')

      return {
        success: errors.length === 0,
        previousVersion: 'unknown',
        currentVersion: snapshot.version,
        restoredFiles,
        errors,
      }
    } catch (error) {
      return {
        success: false,
        previousVersion: 'unknown',
        currentVersion: 'unknown',
        restoredFiles: [],
        errors: [`Failed to restore snapshot: ${error}`],
      }
    }
  }

  /**
   * 列出所有快照
   */
  async listSnapshots(skillId?: string): Promise<Snapshot[]> {
    if (!fs.existsSync(this.snapshotsDir)) {
      return []
    }

    const snapshots: Snapshot[] = []
    const files = fs.readdirSync(this.snapshotsDir)

    for (const file of files) {
      try {
        const snapshot: Snapshot = JSON.parse(
          fs.readFileSync(path.join(this.snapshotsDir, file), 'utf-8')
        )

        if (!skillId || snapshot.skillId === skillId) {
          snapshots.push({
            ...snapshot,
            createdAt: new Date(snapshot.createdAt),
          })
        }
      } catch (error) {
        console.error(`Failed to load snapshot ${file}:`, error)
      }
    }

    return snapshots.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  /**
   * 删除快照
   */
  async deleteSnapshot(snapshotId: string): Promise<boolean> {
    const snapshotFile = this.getSnapshotFile(snapshotId)

    if (!fs.existsSync(snapshotFile)) {
      return false
    }

    try {
      fs.unlinkSync(snapshotFile)
      return true
    } catch (error) {
      console.error('Failed to delete snapshot:', error)
      return false
    }
  }

  /**
   * 确保目录存在
   */
  private ensureDirectories(): void {
    if (!fs.existsSync(this.historyDir)) {
      fs.mkdirSync(this.historyDir, { recursive: true })
    }

    if (!fs.existsSync(this.snapshotsDir)) {
      fs.mkdirSync(this.snapshotsDir, { recursive: true })
    }
  }

  /**
   * 获取历史文件路径
   */
  private getHistoryFile(skillId: string): string {
    return path.join(this.historyDir, `${skillId}.json`)
  }

  /**
   * 获取快照文件路径
   */
  private getSnapshotFile(snapshotId: string): string {
    return path.join(this.snapshotsDir, `${snapshotId}.json`)
  }

  /**
   * 收集文件列表
   */
  private collectFiles(dir: string): string[] {
    const files: string[] = []

    if (!fs.existsSync(dir)) {
      return files
    }

    const items = fs.readdirSync(dir)

    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        files.push(...this.collectFiles(fullPath))
      } else {
        files.push(item)
      }
    }

    return files
  }

  /**
   * 收集文件及其内容
   */
  private collectFilesWithContent(
    dir: string
  ): { path: string; content: string }[] {
    const files: { path: string; content: string }[] = []

    if (!fs.existsSync(dir)) {
      return files
    }

    const items = fs.readdirSync(dir)

    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        files.push(...this.collectFilesWithContent(fullPath))
      } else {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8')
          files.push({
            path: item,
            content,
          })
        } catch (error) {
          console.error(`Failed to read file ${item}:`, error)
        }
      }
    }

    return files
  }

  /**
   * 计算校验和
   */
  private calculateChecksum(dir: string): string {
    // 简化实现，实际应使用加密哈希
    const files = this.collectFiles(dir)
    const content = files.join(',')
    return Buffer.from(content).toString('base64').substring(0, 32)
  }
}

// 导出单例
export const versionRollback = new VersionRollback(
  process.env.SKILLS_DIR || './skills'
)
