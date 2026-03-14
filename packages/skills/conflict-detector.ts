// packages/skills/conflict-detector.ts
// 技能冲突检测器 - 检测版本、资源、配置冲突

/**
 * 技能冲突检测器
 * 检测技能之间的版本、资源和配置冲突
 */

import { InstalledSkill } from './skill-manager'

export interface Conflict {
  id: string
  type: 'version' | 'resource' | 'config'
  severity: 'error' | 'warning' | 'info'
  message: string
  affectedSkills: string[]
  resolution?: string
  timestamp: Date
}

export interface VersionConflict extends Conflict {
  type: 'version'
  dependency: string
  installedVersion: string
  requiredVersion: string
}

export interface ResourceConflict extends Conflict {
  type: 'resource'
  resource: string
  usage: string[]
}

export interface ConfigConflict extends Conflict {
  type: 'config'
  configKey: string
  conflictingValues: Record<string, unknown>
}

export interface ConflictResolution {
  conflictId: string
  strategy: 'auto' | 'manual'
  action: string
  result: 'resolved' | 'failed' | 'pending'
}

/**
 * 冲突检测器实现
 */
export class ConflictDetector {
  private conflicts: Map<string, Conflict> = new Map()

  /**
   * 检测技能冲突
   */
  async detectConflicts(
    skillId: string,
    installedSkills: InstalledSkill[]
  ): Promise<Conflict[]> {
    const conflicts: Conflict[] = []

    // 检测版本冲突
    const versionConflicts = await this.detectVersionConflicts(
      skillId,
      installedSkills
    )
    conflicts.push(...versionConflicts)

    // 检测资源冲突
    const resourceConflicts = await this.detectResourceConflicts(
      skillId,
      installedSkills
    )
    conflicts.push(...resourceConflicts)

    // 检测配置冲突
    const configConflicts = await this.detectConfigConflicts(
      skillId,
      installedSkills
    )
    conflicts.push(...configConflicts)

    // 保存冲突
    for (const conflict of conflicts) {
      this.conflicts.set(conflict.id, conflict)
    }

    return conflicts
  }

  /**
   * 检测版本冲突
   */
  async detectVersionConflicts(
    skillId: string,
    installedSkills: InstalledSkill[]
  ): Promise<VersionConflict[]> {
    const conflicts: VersionConflict[] = []
    const skill = installedSkills.find(s => s.id === skillId)

    if (!skill) {
      return conflicts
    }

    // 检查依赖版本冲突
    for (const installed of installedSkills) {
      if (installed.id === skillId) continue

      // 检查共享依赖
      const sharedDeps = this.findSharedDependencies(skill, installed)

      for (const dep of sharedDeps) {
        const conflict: VersionConflict = {
          id: `${skillId}-${installed.id}-${dep}-version`,
          type: 'version',
          severity: 'warning',
          message: `Version conflict for dependency ${dep}`,
          affectedSkills: [skillId, installed.id],
          dependency: dep,
          installedVersion: '1.0.0', // 简化示例
          requiredVersion: '2.0.0',
          resolution: 'Update both skills to use compatible versions',
          timestamp: new Date(),
        }

        conflicts.push(conflict)
      }
    }

    return conflicts
  }

  /**
   * 检测资源冲突
   */
  async detectResourceConflicts(
    skillId: string,
    installedSkills: InstalledSkill[]
  ): Promise<ResourceConflict[]> {
    const conflicts: ResourceConflict[] = []
    const skill = installedSkills.find(s => s.id === skillId)

    if (!skill) {
      return conflicts
    }

    // 检查端口冲突
    const portConflicts = this.checkPortConflicts(skill, installedSkills)
    conflicts.push(...portConflicts)

    // 检查文件路径冲突
    const pathConflicts = this.checkPathConflicts(skill, installedSkills)
    conflicts.push(...pathConflicts)

    return conflicts
  }

  /**
   * 检测配置冲突
   */
  async detectConfigConflicts(
    skillId: string,
    installedSkills: InstalledSkill[]
  ): Promise<ConfigConflict[]> {
    const conflicts: ConfigConflict[] = []
    const skill = installedSkills.find(s => s.id === skillId)

    if (!skill) {
      return conflicts
    }

    // 检查配置键冲突
    for (const installed of installedSkills) {
      if (installed.id === skillId) continue

      const conflictingKeys = this.findConflictingConfigKeys(
        skill.config,
        installed.config
      )

      for (const key of conflictingKeys) {
        const conflict: ConfigConflict = {
          id: `${skillId}-${installed.id}-${key}-config`,
          type: 'config',
          severity: 'warning',
          message: `Configuration conflict for key: ${key}`,
          affectedSkills: [skillId, installed.id],
          configKey: key,
          conflictingValues: {
            [skillId]: skill.config[key],
            [installed.id]: installed.config[key],
          },
          resolution: 'Review and update configuration',
          timestamp: new Date(),
        }

        conflicts.push(conflict)
      }
    }

    return conflicts
  }

  /**
   * 解决冲突
   */
  async resolveConflict(conflictId: string): Promise<ConflictResolution> {
    const conflict = this.conflicts.get(conflictId)

    if (!conflict) {
      return {
        conflictId,
        strategy: 'manual',
        action: 'Conflict not found',
        result: 'failed',
      }
    }

    // 自动解决策略
    if (conflict.severity === 'info') {
      return {
        conflictId,
        strategy: 'auto',
        action: 'Ignored informational conflict',
        result: 'resolved',
      }
    }

    // 手动解决
    return {
      conflictId,
      strategy: 'manual',
      action: 'Manual intervention required',
      result: 'pending',
    }
  }

  /**
   * 获取所有冲突
   */
  getAllConflicts(): Conflict[] {
    return Array.from(this.conflicts.values())
  }

  /**
   * 清除冲突
   */
  clearConflict(conflictId: string): void {
    this.conflicts.delete(conflictId)
  }

  /**
   * 查找共享依赖
   */
  private findSharedDependencies(
    skill1: InstalledSkill,
    skill2: InstalledSkill
  ): string[] {
    // 简化实现，实际应从 package.json 中提取
    const deps1 = Object.keys(skill1.config)
    const deps2 = Object.keys(skill2.config)

    return deps1.filter(dep => deps2.includes(dep))
  }

  /**
   * 检查端口冲突
   */
  private checkPortConflicts(
    skill: InstalledSkill,
    installedSkills: InstalledSkill[]
  ): ResourceConflict[] {
    const conflicts: ResourceConflict[] = []

    // 简化实现
    const skillPorts = this.extractPorts(skill.config)

    for (const installed of installedSkills) {
      if (installed.id === skill.id) continue

      const installedPorts = this.extractPorts(installed.config)
      const sharedPorts = skillPorts.filter(port => installedPorts.includes(port))

      if (sharedPorts.length > 0) {
        const conflict: ResourceConflict = {
          id: `${skill.id}-${installed.id}-port`,
          type: 'resource',
          severity: 'error',
          message: `Port conflict detected: ${sharedPorts.join(', ')}`,
          affectedSkills: [skill.id, installed.id],
          resource: 'port',
          usage: sharedPorts,
          resolution: 'Change port configuration for one of the skills',
          timestamp: new Date(),
        }

        conflicts.push(conflict)
      }
    }

    return conflicts
  }

  /**
   * 检查路径冲突
   */
  private checkPathConflicts(
    skill: InstalledSkill,
    installedSkills: InstalledSkill[]
  ): ResourceConflict[] {
    const conflicts: ResourceConflict[] = []

    // 简化实现
    const skillPaths = this.extractPaths(skill.config)

    for (const installed of installedSkills) {
      if (installed.id === skill.id) continue

      const installedPaths = this.extractPaths(installed.config)
      const sharedPaths = skillPaths.filter(p => installedPaths.includes(p))

      if (sharedPaths.length > 0) {
        const conflict: ResourceConflict = {
          id: `${skill.id}-${installed.id}-path`,
          type: 'resource',
          severity: 'warning',
          message: `Path conflict detected: ${sharedPaths.join(', ')}`,
          affectedSkills: [skill.id, installed.id],
          resource: 'path',
          usage: sharedPaths,
          resolution: 'Use different paths for each skill',
          timestamp: new Date(),
        }

        conflicts.push(conflict)
      }
    }

    return conflicts
  }

  /**
   * 查找冲突的配置键
   */
  private findConflictingConfigKeys(
    config1: Record<string, unknown>,
    config2: Record<string, unknown>
  ): string[] {
    const keys1 = Object.keys(config1)
    const keys2 = Object.keys(config2)

    const sharedKeys = keys1.filter(key => keys2.includes(key))

    return sharedKeys.filter(key => {
      const val1 = JSON.stringify(config1[key])
      const val2 = JSON.stringify(config2[key])
      return val1 !== val2
    })
  }

  /**
   * 提取端口配置
   */
  private extractPorts(config: Record<string, unknown>): string[] {
    const ports: string[] = []

    // 查找所有 port 相关的配置
    for (const [key, value] of Object.entries(config)) {
      if (key.toLowerCase().includes('port') && typeof value === 'number') {
        ports.push(value.toString())
      }
    }

    return ports
  }

  /**
   * 提取路径配置
   */
  private extractPaths(config: Record<string, unknown>): string[] {
    const paths: string[] = []

    // 查找所有 path 相关的配置
    for (const [key, value] of Object.entries(config)) {
      if (
        key.toLowerCase().includes('path') &&
        typeof value === 'string' &&
        value.startsWith('/')
      ) {
        paths.push(value)
      }
    }

    return paths
  }
}

// 导出单例
export const conflictDetector = new ConflictDetector()
