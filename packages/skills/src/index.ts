// packages/skills/src/index.ts
// 技能包入口

import { Skill } from '@bingoclaw/core'
import { translateSkill } from './translate'
import { weatherSkill } from './weather'
import { githubSkill } from './github'
import { feishuSkill } from './feishu'
import { newsSkill } from './news'

export * from './translate'
export * from './weather'
export * from './github'
export * from './feishu'
export * from './news'

// 导出所有技能数组
export const allSkills: Skill[] = [
  translateSkill,
  weatherSkill,
  githubSkill,
  feishuSkill,
  newsSkill,
]
