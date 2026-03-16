/**
 * 飞书适配器测试
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createFeishuAdapter } from '../packages/adapters/src/feishu';
import { skillRegistry } from '../packages/core/src/skills';
import { allSkills } from '../packages/skills/src';
import type { FeishuEvent } from '../packages/adapters/src/feishu';

// Mock 环境变量
process.env.FEISHU_APP_ID = 'cli_test123';
process.env.FEISHU_APP_SECRET = 'test_secret';
process.env.FEISHU_VERIFICATION_TOKEN = 'test_token';

describe('FeishuAdapter', () => {
  let adapter: ReturnType<typeof createFeishuAdapter>;

  beforeAll(() => {
    // 初始化技能
    allSkills.forEach(skill => {
      skillRegistry.register(skill);
    });

    // 创建适配器
    adapter = createFeishuAdapter({
      appId: process.env.FEISHU_APP_ID!,
      appSecret: process.env.FEISHU_APP_SECRET!,
      verificationToken: process.env.FEISHU_VERIFICATION_TOKEN,
    });

    adapter.setSkillRegistry(new Map(allSkills.map(s => [s.id, s])));
  });

  it('应该成功创建适配器', () => {
    expect(adapter).toBeDefined();
    expect(adapter.name).toBe('feishu');
  });

  it('应该成功启动适配器', async () => {
    await expect(adapter.start()).resolves.not.toThrow();
  });

  it('应该成功处理 URL 验证事件', async () => {
    const event: FeishuEvent = {
      type: 'url_verification',
      ts: '1234567890',
      uuid: 'test-uuid',
      token: process.env.FEISHU_VERIFICATION_TOKEN!,
      event: 'challenge_code_123' as any,
    };

    const result = await adapter.handleWebhook(event);
    expect(result.status).toBe('success');
    expect((result as any).challenge).toBe('challenge_code_123');
  });

  it('应该拒绝无效的 token', async () => {
    const event: FeishuEvent = {
      type: 'event',
      ts: '1234567890',
      uuid: 'test-uuid',
      token: 'invalid_token',
      event: {
        type: 'message',
        message_id: 'msg_123',
        chat_id: 'chat_123',
        message_type: 'text',
        create_time: '1234567890',
        content: '{"text":"翻译 你好"}',
        sender: {
          sender_id: {
            open_id: 'ou_123',
            user_id: 'user_123',
            union_id: 'on_123',
          },
          sender_type: 'user',
          tenant_key: 'tenant_123',
        },
      },
    };

    const result = await adapter.handleWebhook(event);
    expect(result.status).toBe('error');
  });
});

describe('技能调用', () => {
  it('翻译技能应该被正确匹配', () => {
    const skill = skillRegistry.match('翻译 你好世界');
    expect(skill).toBeDefined();
    expect(skill?.id).toBe('translate');
  });

  it('天气技能应该被正确匹配', () => {
    const skill = skillRegistry.match('天气 北京');
    expect(skill).toBeDefined();
    expect(skill?.id).toBe('weather');
  });

  it('新闻技能应该被正确匹配', () => {
    const skill = skillRegistry.match('新闻 AI');
    expect(skill).toBeDefined();
    expect(skill?.id).toBe('news');
  });

  it('GitHub 技能应该被正确匹配', () => {
    const skill = skillRegistry.match('github repos jiangbingo');
    expect(skill).toBeDefined();
    expect(skill?.id).toBe('github');
  });
});

describe('消息格式', () => {
  it('应该正确解析文本消息', () => {
    const content = '{"text":"翻译 你好世界"}';
    const parsed = JSON.parse(content);
    expect(parsed.text).toBe('翻译 你好世界');
  });

  it('应该正确处理 @ 机器人消息', () => {
    const content = '@_user_123 翻译 你好世界';
    const cleaned = content.replace(/@_user_\d+/g, '').trim();
    expect(cleaned).toBe('翻译 你好世界');
  });
});
