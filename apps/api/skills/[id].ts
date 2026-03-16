// apps/api/skills/[id].ts
// 技能详情 API - Vercel Serverless Function

import { type VercelRequest, type VercelResponse } from '@vercel/node'
import { ClawHubClient } from '../../../packages/skills/clawhub-client'

const client = new ClawHubClient()

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Skill ID is required' })
  }

  try {
    if (req.method === 'GET') {
      // 获取技能详情
      const skill = await client.getSkillDetail(id)
      return res.status(200).json(skill)
    } else if (req.method === 'POST') {
      // 安装技能
      const result = await client.installSkill(id)
      return res.status(200).json(result)
    } else if (req.method === 'DELETE') {
      // 卸载技能
      const result = await client.uninstallSkill(id)
      return res.status(200).json(result)
    } else {
      return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Skill operation error:', error)

    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Skill not found',
        message: error.message,
      })
    }

    return res.status(500).json({
      error: 'Failed to process skill operation',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
