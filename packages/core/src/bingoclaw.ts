// packages/core/src/bingoclaw.ts
// Bingoclaw 核心类

import type { BingoclawConfig } from './types';

export default class Bingoclaw {
  private config: BingoclawConfig;

  constructor(config: BingoclawConfig = {}) {
    this.config = config;
  }

  async initialize() {
    // 初始化逻辑
    return true;
  }

  getConfig() {
    return this.config;
  }
}

export type { BingoclawConfig };
