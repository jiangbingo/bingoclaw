// packages/core/src/skills.ts
// 技能核心模块

export interface SkillDefinition {
  id: string;
  name: string;
  triggers: string[];
  handler: Function;
}

export class SkillRegistry {
  private skills: Map<string, SkillDefinition> = new Map();

  register(skill: SkillDefinition) {
    this.skills.set(skill.id, skill);
  }

  get(id: string) {
    return this.skills.get(id);
  }

  list() {
    return Array.from(this.skills.values());
  }
}

export default SkillRegistry;
