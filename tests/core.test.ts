/**
 * 核心模块测试
 */

import { describe, it, expect, vi } from 'vitest';

describe('核心模块', () => {
  describe('类型定义', () => {
    it('应该导出类型', async () => {
      const types = await import('../packages/core/src/types.ts');
      
      // 类型文件应该能正常导入
      expect(types).toBeDefined();
    });
  });

  describe('Bingoclaw 核心类', () => {
    it('应该能够初始化', async () => {
      const { default: Bingoclaw } = await import('../packages/core/src/bingoclaw.ts');
      
      const bot = new Bingoclaw({
        ai: { apiKey: 'test-key' }
      });

      expect(bot).toBeDefined();
    });

    it('应该能够注册技能', async () => {
      const { default: Bingoclaw } = await import('../packages/core/src/bingoclaw.ts');
      
      const bot = new Bingoclaw({
        ai: { apiKey: 'test-key' }
      });

      const skill = {
        id: 'test',
        name: '测试技能',
        description: '测试',
        triggers: ['测试'],
        handler: async () => 'ok',
        enabled: true
      };

      bot.registerSkill(skill);
      // 不应该抛出错误
      expect(true).toBe(true);
    });

    it('应该能够注册平台适配器', async () => {
      const { default: Bingoclaw } = await import('../packages/core/src/bingoclaw.ts');
      
      const bot = new Bingoclaw({
        ai: { apiKey: 'test-key' }
      });

      const adapter = {
        name: 'test' as const,
        start: async () => {},
        stop: async () => {},
        receiveMessage: () => {},
        sendMessage: async () => {}
      };

      bot.registerPlatform(adapter);
      expect(true).toBe(true);
    });
  });

  describe('AI 模块', () => {
    it('应该能够初始化 AI 客户端', async () => {
      const { AIClient } = await import('../packages/core/src/ai.ts');
      
      const client = new AIClient({
        apiKey: 'test-key'
      });

      expect(client).toBeDefined();
    });
  });

  describe('技能注册器', () => {
    it('应该能够注册技能', async () => {
      const { skillRegistry } = await import('../packages/core/src/skills.ts');
      
      const skill = {
        id: 'test-skill',
        name: '测试',
        description: '测试技能',
        triggers: ['测试'],
        handler: async () => 'ok',
        enabled: true
      };

      skillRegistry.register(skill);
      
      const registered = skillRegistry.get('test-skill');
      expect(registered).toBe(skill);
    });

    it('应该能够获取所有技能', async () => {
      const { skillRegistry } = await import('../packages/core/src/skills.ts');
      
      const skills = skillRegistry.getAll();
      expect(Array.isArray(skills)).toBe(true);
    });
  });
});
