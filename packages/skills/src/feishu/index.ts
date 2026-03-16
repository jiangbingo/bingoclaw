// packages/skills/src/feishu/index.ts
// 飞书技能

import { Skill } from '@bingoclaw/core'

export const feishuSkill: Skill = {
  id: 'feishu',
  name: '飞书集成',
  description: '飞书文档、多维表格、消息集成',
  triggers: ['飞书', 'feishu', 'lark'],
  handler: async (message: string) => {
    return `飞书处理: ${message}`
  },
}

export default feishuSkill
