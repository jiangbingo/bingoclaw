// apps/web/src/components/__tests__/SkillCard.test.tsx
import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SkillCard } from '../SkillCard'

describe('SkillCard', () => {
  const mockSkill = {
    id: 'test-skill',
    name: 'Test Skill',
    description: 'A test skill for testing',
    icon: '🧪',
    rating: 4.5,
    downloads: 1250,
    category: 'utility',
    tags: ['test', 'example'],
  }

  it('should render skill card with all information', () => {
    render(
      <SkillCard
        skill={mockSkill}
        onInstall={vi.fn()}
        onViewDetail={vi.fn()}
      />
    )

    expect(screen.getByText('Test Skill')).toBeInTheDocument()
    expect(screen.getByText('A test skill for testing')).toBeInTheDocument()
    expect(screen.getByText('🧪')).toBeInTheDocument()
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('1.3k')).toBeInTheDocument()
    expect(screen.getByText('utility')).toBeInTheDocument()
    expect(screen.getByText('test')).toBeInTheDocument()
    expect(screen.getByText('example')).toBeInTheDocument()
  })

  it('should call onInstall when install button clicked', () => {
    const onInstall = vi.fn()
    render(
      <SkillCard
        skill={mockSkill}
        onInstall={onInstall}
        onViewDetail={vi.fn()}
      />
    )

    const installButton = screen.getByText('安装')
    installButton.click()

    expect(onInstall).toHaveBeenCalledWith('test-skill')
  })

  it('should call onViewDetail when detail button clicked', () => {
    const onViewDetail = vi.fn()
    render(
      <SkillCard
        skill={mockSkill}
        onInstall={vi.fn()}
        onViewDetail={onViewDetail}
      />
    )

    const detailButton = screen.getByText('详情')
    detailButton.click()

    expect(onViewDetail).toHaveBeenCalledWith('test-skill')
  })

  it('should format downloads correctly', () => {
    const skillWithHighDownloads = {
      ...mockSkill,
      downloads: 15000,
    }

    render(
      <SkillCard
        skill={skillWithHighDownloads}
        onInstall={vi.fn()}
        onViewDetail={vi.fn()}
      />
    )

    expect(screen.getByText('15.0k')).toBeInTheDocument()
  })

  it('should display only first 3 tags', () => {
    const skillWithManyTags = {
      ...mockSkill,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
    }

    render(
      <SkillCard
        skill={skillWithManyTags}
        onInstall={vi.fn()}
        onViewDetail={vi.fn()}
      />
    )

    expect(screen.getByText('tag1')).toBeInTheDocument()
    expect(screen.getByText('tag2')).toBeInTheDocument()
    expect(screen.getByText('tag3')).toBeInTheDocument()
    expect(screen.queryByText('tag4')).not.toBeInTheDocument()
    expect(screen.queryByText('tag5')).not.toBeInTheDocument()
  })
})
