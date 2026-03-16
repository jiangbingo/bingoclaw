// packages/skills/src/index.ts
// 技能索引文件

export const translateSkill = {
  id: 'translate',
  name: '翻译技能',
  triggers: ['翻译', 'translate'],
  handler: async (text: string) => {
    return { translated: text };
  }
};

export const weatherSkill = {
  id: 'weather',
  name: '天气技能',
  triggers: ['天气', 'weather'],
  handler: async (location: string) => {
    return { weather: 'sunny' };
  }
};

export const githubSkill = {
  id: 'github',
  name: 'GitHub 技能',
  triggers: ['github', 'git'],
  handler: async (command: string) => {
    return { result: 'ok' };
  }
};

export const feishuSkill = {
  id: 'feishu',
  name: '飞书技能',
  triggers: ['飞书', 'feishu'],
  handler: async (message: string) => {
    return { sent: true };
  }
};

export const newsSkill = {
  id: 'news',
  name: '新闻技能',
  triggers: ['新闻', 'news'],
  handler: async (topic: string) => {
    return { news: [] };
  }
};

// 导出所有技能
export const skills = [
  translateSkill,
  weatherSkill,
  githubSkill,
  feishuSkill,
  newsSkill
];

export default skills;
