// packages/core/src/ai.ts
// AI 核心模块

export interface AIConfig {
  model?: string;
  temperature?: number;
}

export class AIEngine {
  private config: AIConfig;

  constructor(config: AIConfig = {}) {
    this.config = config;
  }

  async chat(message: string) {
    return { response: 'AI response' };
  }
}

export default AIEngine;
