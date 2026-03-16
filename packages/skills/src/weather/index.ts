// packages/skills/src/weather/index.ts
// 天气技能

import { Skill } from '@bingoclaw/core'

export const weatherSkill: Skill = {
  id: 'weather',
  name: '天气查询',
  description: '实时查询全球天气',
  triggers: ['天气', 'weather', '气温'],
  handler: async (message: string) => {
    return `天气信息: ${message}`
  },
}

export default weatherSkill
