// packages/core/src/ai.ts
// AI 客户端

export interface AIConfig {
  provider?: string
  apiKey?: string
  model?: string
}

export class AIClient {
  private config: AIConfig

  constructor(config: AIConfig = {}) {
    this.config = {
      provider: 'bigmodel',
      model: 'glm-4',
      ...config,
    }
  }

  /**
   * 发送消息到 AI
   */
  async chat(message: string): Promise<string> {
    // 简化实现
    return `AI response to: ${message}`
  }

  /**
   * 获取配置
   */
  getConfig(): AIConfig {
    return this.config
  }
}
