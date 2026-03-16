// apps/api/skills/search.ts
// 技能搜索 API - Vercel Serverless Function

import { type VercelRequest, type VercelResponse } from '@vercel/node'
import { ClawHubClient } from '../../../packages/skills/clawhub-client'

const client = new ClawHubClient()

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { q, category, sort, page, limit } = req.query

    const result = await client.searchSkills({
      query: q as string,
      category: category as string,
      sort: sort as 'rating' | 'downloads' | 'updated',
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
    })

    return res.status(200).json(result)
  } catch (error) {
    console.error('Search skills error:', error)
    return res.status(500).json({
      error: 'Failed to search skills',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
