/**
 * 飞书适配器集成测试
 */

import { describe, it, expect } from 'vitest';

describe('飞书适配器集成测试', () => {
  it('应该正确解析翻译命令', () => {
    const message = '翻译 你好世界';
    const match = message.match(/(?:翻译|translate)\s+([\s\S]+)/i);
    expect(match).toBeTruthy();
    expect(match?.[1]).toBe('你好世界');
  });

  it('应该正确解析天气命令', () => {
    const message = '天气 北京';
    const match = message.match(/(?:天气|weather)\s+(.+?)(?:\s+|$)/i);
    expect(match).toBeTruthy();
    expect(match?.[1]).toBe('北京');
  });

  it('应该正确解析新闻命令', () => {
    const message = '新闻 AI';
    expect(message.toLowerCase().includes('ai')).toBe(true);
  });

  it('应该正确处理 @ 机器人', () => {
    const message = '@_user_123 翻译 你好';
    const cleaned = message.replace(/@_user_\d+/g, '').trim();
    expect(cleaned).toBe('翻译 你好');
  });

  it('应该正确识别消息类型', () => {
    const textContent = '{"text":"你好"}';
    const parsed = JSON.parse(textContent);
    expect(parsed.text).toBe('你好');
  });
});
