// packages/skills/src/github/index.ts
// GitHub 技能

import { Skill } from '@bingoclaw/core'

export const githubSkill: Skill = {
  id: 'github',
  name: 'GitHub 集成',
  description: 'GitHub 仓库、Issue、PR 管理',
  triggers: ['github', 'git', '仓库'],
  handler: async (message: string) => {
    return `GitHub 处理: ${message}`
  },
}

export default githubSkill
