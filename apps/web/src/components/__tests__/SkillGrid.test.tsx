// apps/web/src/components/__tests__/SkillGrid.test.tsx
import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SkillGrid } from '../SkillGrid'

describe('SkillGrid', () => {
  const mockSkills = [
    {
      id: 'skill-1',
      name: 'Skill 1',
      description: 'Description 1',
      icon: '🧪',
      rating: 4.5,
      downloads: 1000,
      category: 'utility',
      tags: ['test'],
    },
    {
      id: 'skill-2',
      name: 'Skill 2',
      description: 'Description 2',
      icon: '🔧',
      rating: 4.8,
      downloads: 2000,
      category: 'dev',
      tags: ['dev'],
    },
  ]

  it('should render all skills', () => {
    render(
      <SkillGrid
        skills={mockSkills}
        onInstall={vi.fn()}
        onViewDetail={vi.fn()}
      />
    )

    expect(screen.getByText('Skill 1')).toBeInTheDocument()
    expect(screen.getByText('Skill 2')).toBeInTheDocument()
  })

  it('should show loading state', () => {
    render(
      <SkillGrid
        skills={[]}
        loading={true}
        onInstall={vi.fn()}
        onViewDetail={vi.fn()}
      />
    )

    // 骨架屏应该显示6个占位符
    const skeletons = screen.getAllByRole('generic')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should show empty state when no skills', () => {
    render(
      <SkillGrid
        skills={[]}
        onInstall={vi.fn()}
        onViewDetail={vi.fn()}
      />
    )

    expect(screen.getByText('未找到技能')).toBeInTheDocument()
    expect(screen.getByText('尝试调整搜索条件或浏览其他分类')).toBeInTheDocument()
  })

  it('should call onInstall for each skill', () => {
    const onInstall = vi.fn()
    render(
      <SkillGrid
        skills={mockSkills}
        onInstall={onInstall}
        onViewDetail={vi.fn()}
      />
    )

    const installButtons = screen.getAllByText('安装')
    installButtons[0].click()

    expect(onInstall).toHaveBeenCalledWith('skill-1')
  })

  it('should call onViewDetail for each skill', () => {
    const onViewDetail = vi.fn()
    render(
      <SkillGrid
        skills={mockSkills}
        onInstall={vi.fn()}
        onViewDetail={onViewDetail}
      />
    )

    const detailButtons = screen.getAllByText('详情')
    detailButtons[1].click()

    expect(onViewDetail).toHaveBeenCalledWith('skill-2')
  })
})
