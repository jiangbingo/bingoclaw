// apps/web/src/components/__tests__/FilterPanel.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterPanel } from '../FilterPanel'

describe('FilterPanel', () => {
  it('should render all filter controls', () => {
    render(
      <FilterPanel
        category="all"
        sortBy="rating"
        showInstalledOnly={false}
        onCategoryChange={vi.fn()}
        onSortChange={vi.fn()}
        onInstalledFilterChange={vi.fn()}
      />
    )

    expect(screen.getByRole('combobox', { name: /分类/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /排序/i })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /仅显示已安装/i })).toBeInTheDocument()
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

    const categorySelect = screen.getByRole('combobox', { name: /分类/i })
    fireEvent.change(categorySelect, { target: { value: 'utility' } })

    expect(onCategoryChange).toHaveBeenCalledWith('utility')
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

    const sortSelect = screen.getByRole('combobox', { name: /排序/i })
    fireEvent.change(sortSelect, { target: { value: 'downloads' } })

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

    const checkbox = screen.getByRole('checkbox', { name: /仅显示已安装/i })
    fireEvent.click(checkbox)

    expect(onInstalledFilterChange).toHaveBeenCalledWith(true)
  })

  it('should show reset button when filters are applied', () => {
    render(
      <FilterPanel
        category="utility"
        sortBy="rating"
        showInstalledOnly={false}
        onCategoryChange={vi.fn()}
        onSortChange={vi.fn()}
        onInstalledFilterChange={vi.fn()}
      />
    )

    expect(screen.getByText('重置筛选')).toBeInTheDocument()
  })

  it('should not show reset button when no filters applied', () => {
    render(
      <FilterPanel
        category="all"
        sortBy="rating"
        showInstalledOnly={false}
        onCategoryChange={vi.fn()}
        onSortChange={vi.fn()}
        onInstalledFilterChange={vi.fn()}
      />
    )

    expect(screen.queryByText('重置筛选')).not.toBeInTheDocument()
  })

  it('should reset all filters when reset button clicked', () => {
    const onCategoryChange = vi.fn()
    const onSortChange = vi.fn()
    const onInstalledFilterChange = vi.fn()

    render(
      <FilterPanel
        category="utility"
        sortBy="downloads"
        showInstalledOnly={true}
        onCategoryChange={onCategoryChange}
        onSortChange={onSortChange}
        onInstalledFilterChange={onInstalledFilterChange}
      />
    )

    const resetButton = screen.getByText('重置筛选')
    fireEvent.click(resetButton)

    expect(onCategoryChange).toHaveBeenCalledWith('all')
    expect(onSortChange).toHaveBeenCalledWith('rating')
    expect(onInstalledFilterChange).toHaveBeenCalledWith(false)
  })
})
