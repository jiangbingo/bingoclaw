// packages/adapters/src/index.ts
// 适配器包入口

// 类型导出
export type {
  PlatformAdapter,
  AdapterMessage,
  AdapterEvent,
  BaseAdapterConfig,
  SendResult,
  SkillContext,
  MessageAttachment,
} from './types';

// 飞书适配器
export { createFeishuAdapter } from './feishu';
export type { FeishuConfig } from './feishu';

// 钉钉适配器
export { createDingTalkAdapter, createDingTalkSkillContext } from './dingtalk';
export type { DingTalkConfig } from './dingtalk';

// Slack 适配器
export { createSlackAdapter, createSlackSkillContext } from './slack';
export type { SlackConfig } from './slack';

// Discord 适配器
export { createDiscordAdapter, createDiscordSkillContext } from './discord';
export type { DiscordConfig } from './discord';

// 统一消息接口
export { createMessageRouter, createPlatformHandler } from './unified';
export type { MessageRouterConfig, PlatformHandler } from './unified';
