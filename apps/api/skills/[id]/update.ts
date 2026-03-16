// apps/api/skills/[id]/update.ts
// 技能更新 API - Vercel Serverless Function

import { type VercelRequest, type VercelResponse } from '@vercel/node'
import { ClawHubClient } from '../../../../packages/skills/clawhub-client'

const client = new ClawHubClient()

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Skill ID is required' })
  }

  try {
    const result = await client.updateSkill(id)
    return res.status(200).json(result)
  } catch (error) {
    console.error('Update skill error:', error)
    return res.status(500).json({
      error: 'Failed to update skill',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
