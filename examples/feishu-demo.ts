/**
 * 飞书适配器使用示例
 * 
 * 展示如何在本地使用飞书适配器
 */

import { createFeishuAdapter } from '@bingoclaw/adapters';
import { allSkills } from '@bingoclaw/skills';

async function main() {
  // 1. 创建适配器
  const adapter = createFeishuAdapter({
    appId: process.env.FEISHU_APP_ID || '',
    appSecret: process.env.FEISHU_APP_SECRET || '',
    verificationToken: process.env.FEISHU_VERIFICATION_TOKEN,
  });

  // 2. 设置技能
  adapter.setSkillRegistry(new Map(allSkills.map(s => [s.id, s])));

  // 3. 启动适配器
  await adapter.start();

  // 4. 模拟接收消息
  const mockEvent = {
    type: 'event',
    ts: Date.now().toString(),
    uuid: 'demo-uuid',
    token: process.env.FEISHU_VERIFICATION_TOKEN || '',
    event: {
      type: 'message',
      message_id: 'msg_demo',
      chat_id: 'chat_demo',
      message_type: 'text',
      create_time: Date.now().toString(),
      content: '{"text":"翻译 你好世界"}',
      sender: {
        sender_id: {
          open_id: 'ou_demo',
          user_id: 'user_demo',
          union_id: 'on_demo',
        },
        sender_type: 'user',
        tenant_key: 'tenant_demo',
      },
    },
  };

  // 5. 处理消息
  const result = await adapter.handleWebhook(mockEvent);
  console.log('处理结果:', result);

  // 6. 停止适配器
  await adapter.stop();
}

main().catch(console.error);

/**
 * 运行示例：
 * 
 * # 设置环境变量
 * export FEISHU_APP_ID=cli_xxx
 * export FEISHU_APP_SECRET=your_secret
 * export FEISHU_VERIFICATION_TOKEN=your_token
 * 
 * # 运行示例
 * tsx examples/feishu-demo.ts
 */
