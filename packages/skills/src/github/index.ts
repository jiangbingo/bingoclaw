// packages/skills/src/github/index.ts
// GitHub 技能

export const githubSkill = {
  id: 'github',
  name: 'GitHub 技能',
  triggers: ['github', 'git', 'gh'],
  handler: async (command: string) => {
    return { result: 'ok', command };
  }
};

export default githubSkill;
