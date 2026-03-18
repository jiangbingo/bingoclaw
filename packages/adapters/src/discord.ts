// packages/adapters/src/discord.ts
// Discord 适配器

import type {
  PlatformAdapter,
  AdapterMessage,
  AdapterEvent,
  BaseAdapterConfig,
  SendResult,
  SkillContext,
} from './types';

export interface DiscordConfig extends BaseAdapterConfig {
  [key: string]: unknown;
  botToken?: string;
  applicationId?: string;
  publicKey?: string;
}

export function createDiscordAdapter(config: DiscordConfig = {}): PlatformAdapter {
  const API_BASE = 'https://discord.com/api/v10';

  return {
    name: 'discord',
    type: 'adapter',
    config,

    async sendMessage(message: AdapterMessage): Promise<SendResult> {
      const { content, type = 'text' } = message;

      try {
        if (!config.botToken) {
          throw new Error('Discord botToken is required');
        }

        const body: Record<string, unknown> = {
          content: type === 'text' ? content : undefined,
        };

        // Discord Embed 格式
        if (type === 'card' || type === 'markdown') {
          body.embeds = [
            {
              description: content,
            },
          ];
        }

        const response = await fetch(`${API_BASE}/channels/${config.applicationId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bot ${config.botToken}`,
          },
          body: JSON.stringify(body),
        });

        const data = await response.json();
        return {
          success: response.ok,
          messageId: data.id,
          error: data.message,
        };
      } catch (error) {
        return {
          success: false,
          error: String(error),
        };
      }
    },

    async replyMessage(interactionToken: string, message: AdapterMessage): Promise<SendResult> {
      try {
        if (!config.applicationId) {
          throw new Error('Discord applicationId is required');
        }

        const body: Record<string, unknown> = {
          type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
          data: {
            content: message.content,
          },
        };

        const response = await fetch(
          `${API_BASE}/webhooks/${config.applicationId}/${interactionToken}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          }
        );

        return {
          success: response.ok,
          error: response.ok ? undefined : 'Failed to send message',
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

      // Discord Interaction 格式
      if (event.type === 1) {
        // PING
        return {
          type: 'message',
          platform: 'discord',
          eventId: event.id as string,
          chatId: (event.channel_id as string) || '',
          userId: ((event.member as Record<string, unknown>)?.user as Record<string, unknown>)?.id as string || '',
          message: {
            type: 'text',
            content: '',
          },
          timestamp: Date.now(),
          raw: event,
        };
      }

      // Slash Command
      if (event.type === 2) {
        return {
          type: 'command',
          platform: 'discord',
          eventId: event.id as string,
          chatId: (event.channel_id as string) || '',
          userId: ((event.member as Record<string, unknown>)?.user as Record<string, unknown>)?.id as string || '',
          message: {
            type: 'text',
            content: (event.data as Record<string, unknown>)?.options?.[0]?.value || '',
          },
          timestamp: Date.now(),
          raw: event,
        };
      }

      // Message Component
      if (event.type === 3) {
        return {
          type: 'message',
          platform: 'discord',
          eventId: event.id as string,
          chatId: (event.channel_id as string) || '',
          userId: ((event.member as Record<string, unknown>)?.user as Record<string, unknown>)?.id as string || '',
          message: {
            type: 'text',
            content: '',
          },
          timestamp: Date.now(),
          raw: event,
        };
      }

      throw new Error(`Unknown discord event type: ${event.type}`);
    },

    verifySignature(signature: string, body: string): boolean {
      if (!config.publicKey) return true;

      const crypto = require('crypto');
      const [timestamp, ,] = signature.split(' ');
      const message = timestamp + body;
      const verify = crypto.createVerify('RSA-SHA256');
      verify.update(message);

      return verify.verify(
        `-----BEGIN PUBLIC KEY-----\n${config.publicKey}\n-----END PUBLIC KEY-----`,
        Buffer.from(signature.split(' ')[2], 'hex')
      );
    },
  };
}

/**
 * 创建技能上下文
 */
export function createDiscordSkillContext(
  event: AdapterEvent,
  interactionToken: string
): SkillContext {
  return {
    platform: 'discord',
    chatId: event.chatId,
    userId: event.userId,
    message: event.message?.content || '',
    reply: async (message: string) => {
      const adapter = createDiscordAdapter({});
      const result = await adapter.replyMessage(interactionToken, {
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
