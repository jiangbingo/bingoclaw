// packages/core/src/bot.ts
// bingoClaw 主类

import { SkillRegistry } from './skill-registry'
import { AIClient } from './ai'

export interface BotConfig {
  name?: string
  version?: string
}

export class Bingoclaw {
  private skillRegistry: SkillRegistry
  private aiClient: AIClient
  private config: BotConfig

  constructor(config: BotConfig = {}) {
    this.config = config
    this.skillRegistry = new SkillRegistry()
    this.aiClient = new AIClient()
  }

  /**
   * 注册技能
   */
  registerSkill(skill: any): void {
    this.skillRegistry.register(skill)
  }

  /**
   * 注册平台适配器
   */
  registerPlatform(platform: any): void {
    // 平台适配器注册逻辑
    console.log(`Platform registered: ${platform.name}`)
  }

  /**
   * 获取技能注册器
   */
  getSkillRegistry(): SkillRegistry {
    return this.skillRegistry
  }

  /**
   * 获取 AI 客户端
   */
  getAIClient(): AIClient {
    return this.aiClient
  }
}
