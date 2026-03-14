// packages/skills/dependency-manager.ts
// 技能依赖管理器 - 解析、安装、检查技能依赖

/**
 * 技能依赖管理器
 * 负责解析、安装和检查技能的依赖关系
 */

import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

export interface SkillDependency {
  name: string
  version: string
  required: boolean
  installed?: boolean
  description?: string
}

export interface DependencyCheck {
  valid: boolean
  missing: SkillDependency[]
  conflicts: DependencyConflict[]
  warnings: string[]
}

export interface DependencyConflict {
  dependency: string
  installedVersion: string
  requiredVersion: string
  severity: 'error' | 'warning'
}

export interface DependencyTree {
  name: string
  version: string
  dependencies: DependencyTree[]
}

/**
 * 依赖管理器实现
 */
export class DependencyManager {
  private skillsDir: string

  constructor(skillsDir: string) {
    this.skillsDir = skillsDir
  }

  /**
   * 解析技能依赖
   */
  async parseDependencies(skillPath: string): Promise<SkillDependency[]> {
    const packageJsonPath = path.join(skillPath, 'package.json')

    if (!fs.existsSync(packageJsonPath)) {
      return []
    }

    try {
      const packageJson = JSON.parse(
        fs.readFileSync(packageJsonPath, 'utf-8')
      )

      const dependencies: SkillDependency[] = []

      // 解析 dependencies
      if (packageJson.dependencies) {
        for (const [name, version] of Object.entries(packageJson.dependencies)) {
          dependencies.push({
            name,
            version: version as string,
            required: true,
            description: `Required dependency: ${name}`,
          })
        }
      }

      // 解析 peerDependencies
      if (packageJson.peerDependencies) {
        for (const [name, version] of Object.entries(packageJson.peerDependencies)) {
          dependencies.push({
            name,
            version: version as string,
            required: true,
            description: `Peer dependency: ${name}`,
          })
        }
      }

      // 解析 optionalDependencies
      if (packageJson.optionalDependencies) {
        for (const [name, version] of Object.entries(packageJson.optionalDependencies)) {
          dependencies.push({
            name,
            version: version as string,
            required: false,
            description: `Optional dependency: ${name}`,
          })
        }
      }

      return dependencies
    } catch (error) {
      console.error('Failed to parse dependencies:', error)
      return []
    }
  }

  /**
   * 安装依赖
   */
  async installDependencies(
    dependencies: SkillDependency[]
  ): Promise<{ success: boolean; installed: string[]; failed: string[] }> {
    const installed: string[] = []
    const failed: string[] = []

    for (const dep of dependencies) {
      if (!dep.required) {
        console.log(`Skipping optional dependency: ${dep.name}`)
        continue
      }

      try {
        console.log(`Installing ${dep.name}@${dep.version}...`)

        // 使用 pnpm 安装依赖
        execSync(
          `pnpm add ${dep.name}@${dep.version}`,
          {
            cwd: this.skillsDir,
            stdio: 'pipe',
          }
        )

        installed.push(dep.name)
        console.log(`✅ Installed ${dep.name}`)
      } catch (error) {
        failed.push(dep.name)
        console.error(`❌ Failed to install ${dep.name}:`, error)
      }
    }

    return {
      success: failed.length === 0,
      installed,
      failed,
    }
  }

  /**
   * 检查依赖是否满足
   */
  async checkDependencies(skillId: string): Promise<DependencyCheck> {
    const skillPath = path.join(this.skillsDir, skillId)
    const dependencies = await this.parseDependencies(skillPath)

    const missing: SkillDependency[] = []
    const conflicts: DependencyConflict[] = []
    const warnings: string[] = []

    for (const dep of dependencies) {
      try {
        // 检查依赖是否已安装
        const installedVersion = this.getInstalledVersion(dep.name)

        if (!installedVersion) {
          if (dep.required) {
            missing.push(dep)
          } else {
            warnings.push(`Optional dependency not installed: ${dep.name}`)
          }
          continue
        }

        // 检查版本是否满足
        const satisfies = this.satisfiesVersion(
          installedVersion,
          dep.version
        )

        if (!satisfies) {
          conflicts.push({
            dependency: dep.name,
            installedVersion,
            requiredVersion: dep.version,
            severity: dep.required ? 'error' : 'warning',
          })
        }
      } catch (error) {
        warnings.push(`Failed to check dependency: ${dep.name}`)
      }
    }

    return {
      valid: missing.length === 0 && conflicts.filter(c => c.severity === 'error').length === 0,
      missing,
      conflicts,
      warnings,
    }
  }

  /**
   * 获取依赖树
   */
  async getDependencyTree(skillId: string): Promise<DependencyTree> {
    const skillPath = path.join(this.skillsDir, skillId)
    const packageJsonPath = path.join(skillPath, 'package.json')

    if (!fs.existsSync(packageJsonPath)) {
      return {
        name: skillId,
        version: 'unknown',
        dependencies: [],
      }
    }

    const packageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, 'utf-8')
    )

    const tree: DependencyTree = {
      name: packageJson.name || skillId,
      version: packageJson.version || 'unknown',
      dependencies: [],
    }

    // 递归获取依赖树
    if (packageJson.dependencies) {
      for (const [name, version] of Object.entries(packageJson.dependencies)) {
        tree.dependencies.push({
          name,
          version: version as string,
          dependencies: [], // 简化版本，不递归获取子依赖
        })
      }
    }

    return tree
  }

  /**
   * 获取已安装版本
   */
  private getInstalledVersion(packageName: string): string | null {
    try {
      const packageJsonPath = require.resolve(
        path.join(packageName, 'package.json'),
        {
          paths: [this.skillsDir],
        }
      )

      const packageJson = JSON.parse(
        fs.readFileSync(packageJsonPath, 'utf-8')
      )

      return packageJson.version
    } catch {
      return null
    }
  }

  /**
   * 检查版本是否满足
   */
  private satisfiesVersion(installed: string, required: string): boolean {
    // 简化版本检查，实际应使用 semver 库
    if (required === '*' || required === 'latest') {
      return true
    }

    // 移除 ^ 和 ~ 前缀
    const cleanRequired = required.replace(/^[\^~]/, '')
    const cleanInstalled = installed.replace(/^[\^~]/, '')

    // 简单的版本比较
    return cleanInstalled === cleanRequired || cleanInstalled.startsWith(cleanRequired.split('.')[0])
  }
}

// 导出单例
export const dependencyManager = new DependencyManager(
  process.env.SKILLS_DIR || './skills'
)
