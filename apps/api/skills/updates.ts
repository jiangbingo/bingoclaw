// apps/api/skills/updates.ts
// 检查技能更新 API - Vercel Serverless Function

import { type VercelRequest, type VercelResponse } from '@vercel/node'
import { ClawHubClient } from '../../../packages/skills/clawhub-client'

const client = new ClawHubClient()

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const result = await client.checkUpdates()
    return res.status(200).json(result)
  } catch (error) {
    console.error('Check updates error:', error)
    return res.status(500).json({
      error: 'Failed to check updates',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
