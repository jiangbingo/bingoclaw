/**
 * 飞书 Webhook 接口
 * 
 * 功能：
 * - 处理飞书事件推送
 * - 签名验证
 * - 消息路由
 * - 技能调用
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createFeishuAdapter } from '@bingoclaw/adapters';
import { skillRegistry } from '@bingoclaw/core';
import { allSkills } from '@bingoclaw/skills';
import type { FeishuEvent } from '@bingoclaw/adapters';

// 初始化技能注册
function initializeSkills() {
  allSkills.forEach(skill => {
    skillRegistry.register(skill);
  });
  console.log(`✅ 已注册 ${allSkills.length} 个技能`);
}

// 初始化（只执行一次）
let initialized = false;
if (!initialized) {
  initializeSkills();
  initialized = true;
}

// 创建飞书适配器
const feishuAdapter = createFeishuAdapter({
  appId: process.env.FEISHU_APP_ID || '',
  appSecret: process.env.FEISHU_APP_SECRET || '',
  verificationToken: process.env.FEISHU_VERIFICATION_TOKEN,
});

// 设置技能注册表
feishuAdapter.setSkillRegistry(new Map(allSkills.map(s => [s.id, s])));

/**
 * Webhook 处理器
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();

  try {
    // 获取请求体
    const event: FeishuEvent = req.body;

    // 记录请求日志
    console.log('📩 收到飞书事件:', {
      type: event.type,
      uuid: event.uuid,
      ts: event.ts,
    });

    // URL 验证
    if (event.type === 'url_verification') {
      console.log('✅ URL 验证请求');
      return res.status(200).json({
        challenge: event.event,
      });
    }

    // 验证签名（如果配置了）
    if (process.env.FEISHU_VERIFICATION_TOKEN) {
      const timestamp = req.headers['x-lark-request-timestamp'] as string;
      const nonce = req.headers['x-lark-request-nonce'] as string;
      const signature = req.headers['x-lark-signature'] as string;
      const body = JSON.stringify(req.body);

      const isValid = feishuAdapter.verifySignature(timestamp, nonce, signature, body);

      if (!isValid) {
        console.error('❌ 签名验证失败');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    // 处理事件
    const result = await feishuAdapter.handleWebhook(event);

    // 记录处理时间
    const duration = Date.now() - startTime;
    console.log(`✅ 事件处理完成 (${duration}ms)`);

    return res.status(200).json(result);
  } catch (error) {
    console.error('❌ Webhook 处理失败:', error);

    // 返回错误响应
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
