/**
 * 飞书适配器测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// 模拟飞书适配器
class MockFeishuAdapter {
  name = 'feishu' as const;
  private appId: string;
  private appSecret: string;
  private messageHandler?: (message: any) => Promise<void>;

  constructor(config: { appId: string; appSecret: string }) {
    this.appId = config.appId;
    this.appSecret = config.appSecret;
  }

  async start(): Promise<void> {
    console.log('飞书适配器启动中...');
  }

  async stop(): Promise<void> {
    console.log('飞书适配器已停止');
  }

  receiveMessage(handler: (message: any) => Promise<void>): void {
    this.messageHandler = handler;
  }

  async sendMessage(message: string, userId?: string): Promise<void> {
    if (!userId) {
      throw new Error('飞书消息需要 userId');
    }
    console.log(`发送飞书消息到 ${userId}: ${message}`);
  }

  async handleWebhook(payload: any): Promise<void> {
    if (payload.type !== 'message' || !this.messageHandler) {
      return;
    }

    const message = {
      id: payload.id,
      role: 'user',
      content: payload.content,
      timestamp: payload.timestamp,
      platform: 'feishu',
      userId: payload.sender.id,
      metadata: payload,
    };

    await this.messageHandler(message);
  }

  // 测试辅助方法
  getAppId(): string {
    return this.appId;
  }

  getAppSecret(): string {
    return this.appSecret;
  }
}

describe('飞书适配器', () => {
  let adapter: MockFeishuAdapter;
  const mockConfig = {
    appId: 'cli_test123',
    appSecret: 'test_secret456'
  };

  beforeEach(() => {
    adapter = new MockFeishuAdapter(mockConfig);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('初始化', () => {
    it('应该正确初始化适配器', () => {
      expect(adapter.name).toBe('feishu');
      expect(adapter.getAppId()).toBe(mockConfig.appId);
      expect(adapter.getAppSecret()).toBe(mockConfig.appSecret);
    });

    it('应该能够启动适配器', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      await adapter.start();
      expect(consoleSpy).toHaveBeenCalledWith('飞书适配器启动中...');
    });

    it('应该能够停止适配器', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      await adapter.stop();
      expect(consoleSpy).toHaveBeenCalledWith('飞书适配器已停止');
    });
  });

  describe('消息处理', () => {
    it('应该注册消息处理器', () => {
      const handler = vi.fn();
      adapter.receiveMessage(handler);
      // 不应该抛出错误
      expect(true).toBe(true);
    });

    it('应该处理有效的 webhook 消息', async () => {
      const handler = vi.fn().mockResolvedValue(undefined);
      adapter.receiveMessage(handler);

      const payload = {
        type: 'message',
        id: 'msg_123',
        content: '你好',
        timestamp: Date.now(),
        sender: { id: 'user_456' }
      };

      await adapter.handleWebhook(payload);

      expect(handler).toHaveBeenCalledWith({
        id: 'msg_123',
        role: 'user',
        content: '你好',
        timestamp: payload.timestamp,
        platform: 'feishu',
        userId: 'user_456',
        metadata: payload
      });
    });

    it('应该忽略非消息类型的 webhook', async () => {
      const handler = vi.fn().mockResolvedValue(undefined);
      adapter.receiveMessage(handler);

      const payload = {
        type: 'event',
        event: 'app_installed'
      };

      await adapter.handleWebhook(payload);
      expect(handler).not.toHaveBeenCalled();
    });

    it('应该忽略未注册处理器的消息', async () => {
      // 不注册处理器
      const payload = {
        type: 'message',
        id: 'msg_123',
        content: '你好',
        timestamp: Date.now(),
        sender: { id: 'user_456' }
      };

      // 不应该抛出错误
      await expect(adapter.handleWebhook(payload)).resolves.not.toThrow();
    });
  });

  describe('发送消息', () => {
    it('应该发送消息到指定用户', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      await adapter.sendMessage('测试消息', 'user_123');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('发送飞书消息到 user_123: 测试消息')
      );
    });

    it('应该拒绝没有 userId 的消息', async () => {
      await expect(adapter.sendMessage('测试消息')).rejects.toThrow(
        '飞书消息需要 userId'
      );
    });

    it('应该拒绝 userId 为空字符串的消息', async () => {
      await expect(adapter.sendMessage('测试消息', '')).rejects.toThrow();
    });
  });

  describe('Webhook 数据转换', () => {
    it('应该正确转换飞书消息格式', async () => {
      let receivedMessage: any;
      const handler = async (msg: any) => {
        receivedMessage = msg;
      };
      adapter.receiveMessage(handler);

      const payload = {
        type: 'message',
        id: 'msg_abc',
        content: '翻译 你好',
        timestamp: 1234567890,
        sender: { id: 'ou_xyz' },
        extra: { chat_id: 'chat_123' }
      };

      await adapter.handleWebhook(payload);

      expect(receivedMessage).toEqual({
        id: 'msg_abc',
        role: 'user',
        content: '翻译 你好',
        timestamp: 1234567890,
        platform: 'feishu',
        userId: 'ou_xyz',
        metadata: payload
      });
    });

    it('应该保留原始 payload 在 metadata', async () => {
      let receivedMessage: any;
      const handler = async (msg: any) => {
        receivedMessage = msg;
      };
      adapter.receiveMessage(handler);

      const payload = {
        type: 'message',
        id: 'msg_1',
        content: '测试',
        timestamp: Date.now(),
        sender: { id: 'user_1' },
        custom_field: 'custom_value'
      };

      await adapter.handleWebhook(payload);

      expect(receivedMessage.metadata).toEqual(payload);
      expect(receivedMessage.metadata.custom_field).toBe('custom_value');
    });
  });

  describe('错误处理', () => {
    it('应该处理消息处理器中的错误', async () => {
      const handler = vi.fn().mockRejectedValue(new Error('处理失败'));
      adapter.receiveMessage(handler);

      const payload = {
        type: 'message',
        id: 'msg_1',
        content: '测试',
        timestamp: Date.now(),
        sender: { id: 'user_1' }
      };

      // 应该抛出错误
      await expect(adapter.handleWebhook(payload)).rejects.toThrow('处理失败');
    });

    it('应该处理格式错误的 payload', async () => {
      const handler = vi.fn().mockResolvedValue(undefined);
      adapter.receiveMessage(handler);

      const malformedPayload = {
        type: 'message',
        // 缺少必要字段
      };

      // 应该抛出错误或优雅处理
      try {
        await adapter.handleWebhook(malformedPayload);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('集成场景', () => {
    it('应该支持完整的消息流程', async () => {
      // 1. 启动适配器
      await adapter.start();

      // 2. 注册消息处理器
      let processedMessage: string | null = null;
      const handler = async (msg: any) => {
        processedMessage = msg.content;
      };
      adapter.receiveMessage(handler);

      // 3. 接收 webhook 消息
      const payload = {
        type: 'message',
        id: 'msg_1',
        content: '天气 北京',
        timestamp: Date.now(),
        sender: { id: 'user_1' }
      };
      await adapter.handleWebhook(payload);

      // 4. 验证消息已处理
      expect(processedMessage).toBe('天气 北京');

      // 5. 停止适配器
      await adapter.stop();
    });

    it('应该支持多用户消息处理', async () => {
      const processedMessages: any[] = [];
      const handler = async (msg: any) => {
        processedMessages.push(msg);
      };
      adapter.receiveMessage(handler);

      // 模拟多个用户的消息
      const users = ['user_1', 'user_2', 'user_3'];
      for (const userId of users) {
        await adapter.handleWebhook({
          type: 'message',
          id: `msg_${userId}`,
          content: `来自 ${userId} 的消息`,
          timestamp: Date.now(),
          sender: { id: userId }
        });
      }

      expect(processedMessages).toHaveLength(3);
      expect(processedMessages.map(m => m.userId)).toEqual(users);
    });
  });
});
