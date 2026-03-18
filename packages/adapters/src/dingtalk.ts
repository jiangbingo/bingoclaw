// packages/adapters/src/dingtalk.ts
// 钉钉适配器

import type {
  PlatformAdapter,
  AdapterMessage,
  AdapterEvent,
  BaseAdapterConfig,
  SendResult,
  SkillContext,
} from './types';

export interface DingTalkConfig extends BaseAdapterConfig {
  [key: string]: unknown;
  clientId?: string;
  clientSecret?: string;
  agentId?: string;
}

export function createDingTalkAdapter(config: DingTalkConfig = {}): PlatformAdapter {
  return {
    name: 'dingtalk',
    type: 'adapter',
    config,

    async sendMessage(message: AdapterMessage): Promise<SendResult> {
      const { content, type = 'text' } = message;

      try {
        // 获取 access_token
        const accessToken = await getAccessToken(config);

        // 发送消息
        const response = await fetch(
          `https://oapi.dingtalk.com/topapi/message/corpconversation/asyncsend_v2?access_token=${accessToken}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              agent_id: config.agentId,
              msgtype: type === 'text' ? 'text' : 'markdown',
              [type === 'text' ? 'text' : 'markdown']: {
                content: type === 'text' ? content : { title: '消息', text: content },
              },
            }),
          }
        );

        const data = await response.json();
        return {
          success: data.errcode === 0,
          messageId: data.task_id,
          error: data.errmsg,
        };
      } catch (error) {
        return {
          success: false,
          error: String(error),
        };
      }
    },

    async replyMessage(replyToken: string, message: AdapterMessage): Promise<SendResult> {
      // 钉钉使用 session_webhook_url 回复
      try {
        const response = await fetch(replyToken, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            msgtype: message.type === 'text' ? 'text' : 'markdown',
            [message.type === 'text' ? 'text' : 'markdown']: {
              content: message.content,
            },
          }),
        });

        const data = await response.json();
        return {
          success: data.errcode === 0,
          error: data.errmsg,
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

      // 钉钉消息格式
      if (event.msgtype === 'text') {
        const text = (event.text as Record<string, unknown>)?.content as string;
        return {
          type: 'message',
          platform: 'dingtalk',
          eventId: event.msgid as string,
          chatId: (event.conversationId as string) || (event.chatid as string) || '',
          userId: (event.senderNick as string) || (event.senderId as string) || '',
          message: {
            type: 'text',
            content: text,
          },
          timestamp: Date.now(),
          raw: event,
        };
      }

      throw new Error(`Unknown dingtalk event type: ${event.msgtype}`);
    },

    verifySignature(signature: string, body: string): boolean {
      if (!config.webhookSecret) return true;

      const crypto = require('crypto');
      const expected = crypto
        .createHmac('sha256', config.webhookSecret)
        .update(body)
        .digest('base64');

      return signature === expected;
    },
  };
}

// 辅助函数：获取 access_token
async function getAccessToken(config: DingTalkConfig): Promise<string> {
  if (!config.clientId || !config.clientSecret) {
    throw new Error('DingTalk clientId and clientSecret are required');
  }

  const response = await fetch(
    `https://oapi.dingtalk.com/gettoken?appkey=${config.clientId}&appsecret=${config.clientSecret}`
  );

  const data = await response.json();
  if (data.errcode !== 0) {
    throw new Error(data.errmsg);
  }

  return data.access_token;
}

/**
 * 创建技能上下文
 */
export function createDingTalkSkillContext(
  event: AdapterEvent,
  replyToken: string
): SkillContext {
  return {
    platform: 'dingtalk',
    chatId: event.chatId,
    userId: event.userId,
    message: event.message?.content || '',
    reply: async (message: string) => {
      const adapter = createDingTalkAdapter({});
      const result = await adapter.replyMessage(replyToken, {
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
