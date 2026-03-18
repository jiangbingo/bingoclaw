// packages/adapters/src/types.ts
// 统一适配器类型定义

/**
 * 平台适配器基础接口
 */
export interface PlatformAdapter {
  name: string;
  type: string;
  config: {
    [key: string]: unknown;
    webhookSecret?: string;
    timeout?: number;
  };

  // 消息操作
  sendMessage(message: AdapterMessage): Promise<SendResult>;
  replyMessage(replyToken: string, message: AdapterMessage): Promise<SendResult>;

  // 事件处理
  parseEvent(rawEvent: unknown): Promise<AdapterEvent>;
  verifySignature(signature: string, body: string): boolean;
}

/**
 * 统一消息格式
 */
export interface AdapterMessage {
  type: 'text' | 'markdown' | 'card' | 'image' | 'file';
  content: string;
  attachments?: MessageAttachment[];
  mentions?: string[];
}

/**
 * 消息附件
 */
export interface MessageAttachment {
  type: 'image' | 'file' | 'link';
  url?: string;
  title?: string;
  description?: string;
}

/**
 * 发送结果
 */
export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * 统一事件格式
 */
export interface AdapterEvent {
  type: 'message' | 'enter_group' | 'leave_group' | 'mention' | 'command';
  platform: string;
  eventId: string;
  chatId: string;
  userId: string;
  message?: AdapterMessage;
  timestamp: number;
  raw: unknown;
}

/**
 * 适配器配置基类
 */
export interface BaseAdapterConfig {
  webhookSecret?: string;
  timeout?: number;
}

/**
 * 技能调用上下文
 */
export interface SkillContext {
  platform: string;
  chatId: string;
  userId: string;
  message: string;
  reply: (message: string) => Promise<void>;
}
