// packages/skills/skill-manager.ts
// 技能管理器 - 本地技能安装、配置和管理

/**
 * 技能管理器
 * 管理本地已安装的技能
 */

import * as fs from 'fs'
import * as path from 'path'

export interface InstalledSkill {
  id: string
  name: string
  version: string
  enabled: boolean
  installedAt: Date
  lastUpdated: Date
  config: Record<string, unknown>
  path: string
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export interface SkillConfig {
  [key: string]: unknown
}

/**
 * 技能管理器实现
 */
export class SkillManager {
  private skillsDir: string
  private configPath: string
  private installedSkills: Map<string, InstalledSkill> = new Map()

  constructor(skillsDir: string) {
    this.skillsDir = skillsDir
    this.configPath = path.join(skillsDir, 'installed.json')
    this.loadInstalledSkills()
  }

  /**
   * 列出已安装的技能
   */
  async listInstalled(): Promise<InstalledSkill[]> {
    return Array.from(this.installedSkills.values())
  }

  /**
   * 启用技能
   */
  async enableSkill(skillId: string): Promise<void> {
    const skill = this.installedSkills.get(skillId)
    if (!skill) {
      throw new Error(`Skill not found: ${skillId}`)
    }

    skill.enabled = true
    await this.saveInstalledSkills()
  }

  /**
   * 禁用技能
   */
  async disableSkill(skillId: string): Promise<void> {
    const skill = this.installedSkills.get(skillId)
    if (!skill) {
      throw new Error(`Skill not found: ${skillId}`)
    }

    skill.enabled = false
    await this.saveInstalledSkills()
  }

  /**
   * 配置技能
   */
  async configureSkill(
    skillId: string,
    config: SkillConfig
  ): Promise<void> {
    const skill = this.installedSkills.get(skillId)
    if (!skill) {
      throw new Error(`Skill not found: ${skillId}`)
    }

    // 验证配置
    const validation = await this.validateConfig(skillId, config)
    if (!validation.valid) {
      throw new Error(`Invalid config: ${validation.errors.join(', ')}`)
    }

    skill.config = { ...skill.config, ...config }
    await this.saveInstalledSkills()
  }

  /**
   * 获取技能配置
   */
  async getSkillConfig(skillId: string): Promise<SkillConfig> {
    const skill = this.installedSkills.get(skillId)
    if (!skill) {
      throw new Error(`Skill not found: ${skillId}`)
    }

    return { ...skill.config }
  }

  /**
   * 验证技能
   */
  async validateSkill(skillId: string): Promise<ValidationResult> {
    const skill = this.installedSkills.get(skillId)
    if (!skill) {
      return {
        valid: false,
        errors: [`Skill not found: ${skillId}`],
        warnings: [],
      }
    }

    const errors: string[] = []
    const warnings: string[] = []

    // 检查技能目录是否存在
    if (!fs.existsSync(skill.path)) {
      errors.push(`Skill directory not found: ${skill.path}`)
    }

    // 检查必要文件
    const requiredFiles = ['skill.js', 'package.json']
    for (const file of requiredFiles) {
      const filePath = path.join(skill.path, file)
      if (!fs.existsSync(filePath)) {
        errors.push(`Required file missing: ${file}`)
      }
    }

    // 检查配置
    if (Object.keys(skill.config).length === 0) {
      warnings.push('Skill has no configuration')
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    }
  }

  /**
   * 注册已安装的技能
   */
  registerSkill(skill: InstalledSkill): void {
    this.installedSkills.set(skill.id, skill)
  }

  /**
   * 注销技能
   */
  unregisterSkill(skillId: string): void {
    this.installedSkills.delete(skillId)
  }

  /**
   * 加载已安装的技能
   */
  private loadInstalledSkills(): void {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, 'utf-8')
        const skills = JSON.parse(data) as InstalledSkill[]

        for (const skill of skills) {
          this.installedSkills.set(skill.id, {
            ...skill,
            installedAt: new Date(skill.installedAt),
            lastUpdated: new Date(skill.lastUpdated),
          })
        }
      }
    } catch (error) {
      console.error('Failed to load installed skills:', error)
    }
  }

  /**
   * 保存已安装的技能
   */
  private async saveInstalledSkills(): Promise<void> {
    try {
      const skills = Array.from(this.installedSkills.values())
      const data = JSON.stringify(skills, null, 2)

      await fs.promises.writeFile(this.configPath, data, 'utf-8')
    } catch (error) {
      console.error('Failed to save installed skills:', error)
      throw error
    }
  }

  /**
   * 验证配置
   */
  private async validateConfig(
    skillId: string,
    config: SkillConfig
  ): Promise<ValidationResult> {
    // TODO: 实现基于技能的 configSchema 的验证
    // 目前只做基础验证
    const errors: string[] = []
    const warnings: string[] = []

    // 基础类型检查
    for (const [key, value] of Object.entries(config)) {
      if (value === undefined) {
        warnings.push(`Config key "${key}" is undefined`)
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    }
  }
}

// 导出单例
export const skillManager = new SkillManager(
  process.env.SKILLS_DIR || './skills'
)
