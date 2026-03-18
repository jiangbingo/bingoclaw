// packages/adapters/src/unified/message-router.ts
// 统一消息路由器

import type { PlatformAdapter, AdapterEvent, AdapterMessage, SkillContext } from '../types';

export interface MessageRouterConfig {
  adapters: Map<string, PlatformAdapter>;
  skillHandler: (context: SkillContext) => Promise<string>;
}

export interface PlatformHandler {
  platform: string;
  adapter: PlatformAdapter;
  handle: (rawEvent: unknown, replyToken?: string) => Promise<void>;
}

/**
 * 创建消息路由器
 */
export function createMessageRouter(config: MessageRouterConfig) {
  const { adapters, skillHandler } = config;

  /**
   * 路由消息到对应平台
   */
  async function route(
    platform: string,
    rawEvent: unknown,
    replyToken?: string
  ): Promise<void> {
    const adapter = adapters.get(platform);
    if (!adapter) {
      throw new Error(`Unknown platform: ${platform}`);
    }

    // 解析事件
    const event = await adapter.parseEvent(rawEvent);

    // 创建上下文
    const context: SkillContext = {
      platform: event.platform,
      chatId: event.chatId,
      userId: event.userId,
      message: event.message?.content || '',
      reply: async (message: string) => {
        if (replyToken) {
          await adapter.replyMessage(replyToken, {
            type: 'text',
            content: message,
          });
        }
      },
    };

    // 调用技能处理器
    const response = await skillHandler(context);

    // 发送回复
    if (replyToken && response) {
      await adapter.replyMessage(replyToken, {
        type: 'text',
        content: response,
      });
    }
  }

  /**
   * 注册平台适配器
   */
  function registerAdapter(adapter: PlatformAdapter): void {
    adapters.set(adapter.name, adapter);
  }

  /**
   * 获取平台适配器
   */
  function getAdapter(platform: string): PlatformAdapter | undefined {
    return adapters.get(platform);
  }

  /**
   * 列出所有平台
   */
  function listPlatforms(): string[] {
    return Array.from(adapters.keys());
  }

  return {
    route,
    registerAdapter,
    getAdapter,
    listPlatforms,
  };
}

/**
 * 创建平台处理器
 */
export function createPlatformHandler(
  platform: string,
  adapter: PlatformAdapter,
  skillHandler: (context: SkillContext) => Promise<string>
): PlatformHandler {
  return {
    platform,
    adapter,
    async handle(rawEvent: unknown, replyToken?: string): Promise<void> {
      const event = await adapter.parseEvent(rawEvent);

      const context: SkillContext = {
        platform: event.platform,
        chatId: event.chatId,
        userId: event.userId,
        message: event.message?.content || '',
        reply: async (message: string) => {
          if (replyToken) {
            await adapter.replyMessage(replyToken, {
              type: 'text',
              content: message,
            });
          }
        },
      };

      const response = await skillHandler(context);

      if (replyToken && response) {
        await adapter.replyMessage(replyToken, {
          type: 'text',
          content: response,
        });
      }
    },
  };
}
