// packages/adapters/src/slack.ts
// Slack 适配器

import type {
  PlatformAdapter,
  AdapterMessage,
  AdapterEvent,
  BaseAdapterConfig,
  SendResult,
  SkillContext,
} from './types';

export interface SlackConfig extends BaseAdapterConfig {
  [key: string]: unknown;
  botToken?: string;
  signingSecret?: string;
  appId?: string;
}

export function createSlackAdapter(config: SlackConfig = {}): PlatformAdapter {
  return {
    name: 'slack',
    type: 'adapter',
    config,

    async sendMessage(message: AdapterMessage): Promise<SendResult> {
      const { content, type = 'text' } = message;

      try {
        if (!config.botToken) {
          throw new Error('Slack botToken is required');
        }

        let blocks: unknown[] = [];

        // 根据 message type 构建 blocks
        if (type === 'markdown' || type === 'card') {
          blocks = [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: content,
              },
            },
          ];
        }

        const response = await fetch('https://slack.com/api/chat.postMessage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.botToken}`,
          },
          body: JSON.stringify({
            channel: config.appId, // 需要从配置或参数获取
            text: type === 'text' ? content : '',
            blocks: blocks.length > 0 ? blocks : undefined,
          }),
        });

        const data = await response.json();
        return {
          success: data.ok,
          messageId: data.ts,
          error: data.error,
        };
      } catch (error) {
        return {
          success: false,
          error: String(error),
        };
      }
    },

    async replyMessage(responseUrl: string, message: AdapterMessage): Promise<SendResult> {
      try {
        const response = await fetch(responseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: message.content,
            response_type: 'in_channel',
          }),
        });

        const data = await response.json();
        return {
          success: data.ok,
          error: data.error,
        };
      } catch (error) {
        return {
          success: false,
          error: String(error),
        };
      }
    },

    async parseEvent(rawEvent: unknown): Promise<AdapterEvent> {
      const event = rawEvent as Record<string, unknown>;

      // Slack Events API 格式
      if (event.type === 'event_callback') {
        const innerEvent = event.event as Record<string, unknown>;

        if (innerEvent.type === 'message') {
          return {
            type: 'message',
            platform: 'slack',
            eventId: innerEvent.event_ts as string,
            chatId: innerEvent.channel as string,
            userId: innerEvent.user as string,
            message: {
              type: 'text',
              content: innerEvent.text as string,
            },
            timestamp: Number(innerEvent.ts) * 1000,
            raw: event,
          };
        }
      }

      // Slash Command 格式
      if (event.command) {
        return {
          type: 'command',
          platform: 'slack',
          eventId: event.trigger_id as string,
          chatId: event.channel_id as string,
          userId: event.user_id as string,
          message: {
            type: 'text',
            content: event.text as string,
          },
          timestamp: Date.now(),
          raw: event,
        };
      }

      throw new Error(`Unknown slack event type: ${JSON.stringify(event)}`);
    },

    verifySignature(signature: string, body: string): boolean {
      if (!config.signingSecret) return true;

      const crypto = require('crypto');
      const timestamp = signature.split(',')[0].split('=')[1];
      const expected = 'v0:' + timestamp + ':' + body;
      const hash = crypto
        .createHmac('sha256', config.signingSecret)
        .update(expected)
        .digest('hex');

      return signature === `v0=${hash}`;
    },
  };
}

/**
 * 创建技能上下文
 */
export function createSlackSkillContext(
  event: AdapterEvent,
  responseUrl: string
): SkillContext {
  return {
    platform: 'slack',
    chatId: event.chatId,
    userId: event.userId,
    message: event.message?.content || '',
    reply: async (message: string) => {
      const adapter = createSlackAdapter({});
      const result = await adapter.replyMessage(responseUrl, {
        type: 'text',
        content: message,
      });
      if (!result.success) {
        throw new Error(result.error);
      }
    },
  };
}

// 已在顶部导出
