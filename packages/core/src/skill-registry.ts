// packages/core/src/skill-registry.ts
// 技能注册器

export interface Skill {
  id: string
  name: string
  description?: string
  triggers?: string[]
  handler?: Function
}

export class SkillRegistry {
  private skills: Map<string, Skill> = new Map()

  /**
   * 注册技能
   */
  register(skill: Skill): void {
    if (!skill.id) {
      throw new Error('Skill must have an id')
    }
    this.skills.set(skill.id, skill)
  }

  /**
   * 获取所有技能
   */
  getAll(): Skill[] {
    return Array.from(this.skills.values())
  }

  /**
   * 根据 ID 获取技能
   */
  get(id: string): Skill | undefined {
    return this.skills.get(id)
  }

  /**
   * 匹配技能
   */
  match(message: string): Skill | undefined {
    for (const skill of this.skills.values()) {
      if (skill.triggers) {
        for (const trigger of skill.triggers) {
          if (message.includes(trigger)) {
            return skill
          }
        }
      }
    }
    return undefined
  }

  /**
   * 取消注册技能
   */
  unregister(id: string): boolean {
    return this.skills.delete(id)
  }
}
