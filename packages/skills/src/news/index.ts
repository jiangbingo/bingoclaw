// packages/skills/src/news/index.ts
// 新闻技能

import { Skill } from '@bingoclaw/core'

export const newsSkill: Skill = {
  id: 'news',
  name: '新闻摘要',
  description: 'AI 行业动态新闻',
  triggers: ['新闻', 'news', '资讯'],
  handler: async (message: string) => {
    return `新闻摘要: ${message}`
  },
}

export default newsSkill
