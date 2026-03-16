// packages/core/src/types.ts
// 核心类型定义

export interface BingoclawConfig {
  name?: string;
  version?: string;
}

export interface Skill {
  id: string;
  name: string;
  triggers: string[];
  handler: Function;
}

export interface Adapter {
  name: string;
  type: string;
  config?: Record<string, any>;
}

export type { BingoclawConfig as Config };
