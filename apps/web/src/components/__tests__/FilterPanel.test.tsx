// apps/web/src/components/__tests__/FilterPanel.test.tsx
import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterPanel } from '../FilterPanel'

describe('FilterPanel', () => {
  it('should render all filter controls', () => {
    const onCategoryChange = vi.fn()
    const onSortChange = vi.fn()
    const onInstalledFilterChange = vi.fn()

    render(
      <FilterPanel
        category="all"
        sortBy="rating"
        showInstalledOnly={false}
        onCategoryChange={onCategoryChange}
        onSortChange={onSortChange}
        onInstalledFilterChange={onInstalledFilterChange}
      />
    )

    // 检查所有 select 元素都存在
    const selects = screen.getAllByRole('listbox')
    expect(selects.length).toBeGreaterThanOrEqual(2)

    // 检查 checkbox 存在
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  it('should call onCategoryChange when category changed', () => {
    const onCategoryChange = vi.fn()

    render(
      <FilterPanel
        category="all"
        sortBy="rating"
        showInstalledOnly={false}
        onCategoryChange={onCategoryChange}
        onSortChange={vi.fn()}
        onInstalledFilterChange={vi.fn()}
      />
    )

    // 获取第一个 select（分类）
    const selects = screen.getAllByRole('listbox')
    fireEvent.change(selects[0], { target: { value: 'ai' } })

    expect(onCategoryChange).toHaveBeenCalledWith('ai')
  })

  it('should call onSortChange when sort changed', () => {
    const onSortChange = vi.fn()

    render(
      <FilterPanel
        category="all"
        sortBy="rating"
        showInstalledOnly={false}
        onCategoryChange={vi.fn()}
        onSortChange={onSortChange}
        onInstalledFilterChange={vi.fn()}
      />
    )

    // 获取第二个 select（排序）
    const selects = screen.getAllByRole('listbox')
    fireEvent.change(selects[1], { target: { value: 'downloads' } })

    expect(onSortChange).toHaveBeenCalledWith('downloads')
  })

  it('should call onInstalledFilterChange when checkbox changed', () => {
    const onInstalledFilterChange = vi.fn()

    render(
      <FilterPanel
        category="all"
        sortBy="rating"
        showInstalledOnly={false}
        onCategoryChange={vi.fn()}
        onSortChange={vi.fn()}
        onInstalledFilterChange={onInstalledFilterChange}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(onInstalledFilterChange).toHaveBeenCalledWith(true)
  })
})
