/**
 * 技能包索引测试
 */

import { describe, it, expect } from 'vitest';

describe('技能包', () => {
  describe('技能索引', () => {
    it('应该导出所有技能', async () => {
      const skills = await import('../packages/skills/src/index.ts');
      
      expect(skills.translateSkill).toBeDefined();
      expect(skills.weatherSkill).toBeDefined();
      expect(skills.githubSkill).toBeDefined();
      expect(skills.feishuSkill).toBeDefined();
      expect(skills.newsSkill).toBeDefined();
    });

    it('所有技能应该有正确的元数据', async () => {
      const { translateSkill, weatherSkill, githubSkill, feishuSkill, newsSkill } = 
        await import('../packages/skills/src/index.ts');
      
      const skills = [translateSkill, weatherSkill, githubSkill, feishuSkill, newsSkill];
      
      skills.forEach(skill => {
        expect(skill.id).toBeDefined();
        expect(skill.name).toBeDefined();
        expect(skill.triggers).toBeInstanceOf(Array);
        expect(skill.triggers.length).toBeGreaterThan(0);
        expect(typeof skill.handler).toBe('function');
        expect(skill.enabled).toBe(true);
      });
    });

    it('技能 ID 应该唯一', async () => {
      const { translateSkill, weatherSkill, githubSkill, feishuSkill, newsSkill } = 
        await import('../packages/skills/src/index.ts');
      
      const ids = [translateSkill, weatherSkill, githubSkill, feishuSkill, newsSkill]
        .map(s => s.id);
      
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('GitHub 技能', () => {
    it('应该定义正确的元数据', async () => {
      const { githubSkill } = await import('../packages/skills/src/github/index.ts');
      
      expect(githubSkill.id).toBe('github');
      expect(githubSkill.triggers).toContain('github');
      expect(githubSkill.triggers).toContain('gh');
    });
  });

  describe('飞书技能', () => {
    it('应该定义正确的元数据', async () => {
      const { feishuSkill } = await import('../packages/skills/src/feishu/index.ts');
      
      expect(feishuSkill.id).toBe('feishu');
      expect(feishuSkill.triggers).toContain('飞书');
    });
  });

  describe('新闻技能', () => {
    it('应该定义正确的元数据', async () => {
      const { newsSkill } = await import('../packages/skills/src/news/index.ts');
      
      expect(newsSkill.id).toBe('news');
      expect(newsSkill.triggers).toContain('新闻');
      expect(newsSkill.triggers).toContain('news');
    });
  });
});
