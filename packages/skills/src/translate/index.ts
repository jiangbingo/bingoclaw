// packages/skills/src/translate/index.ts
// 翻译技能

import { Skill } from '@bingoclaw/core'

export const translateSkill: Skill = {
  id: 'translate',
  name: '翻译',
  description: '多语言翻译',
  triggers: ['翻译', 'translate', '译'],
  handler: async (message: string) => {
    return `翻译结果: ${message}`
  },
}

export default translateSkill
