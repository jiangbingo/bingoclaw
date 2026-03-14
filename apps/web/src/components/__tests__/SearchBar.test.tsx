// apps/web/src/components/__tests__/SearchBar.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SearchBar } from '../SearchBar'

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render search input', () => {
    render(
      <SearchBar
        query=""
        onSearch={vi.fn()}
      />
    )

    expect(screen.getByPlaceholderText('搜索技能...')).toBeInTheDocument()
  })

  it('should update query on input change', () => {
    const onSearch = vi.fn()
    render(
      <SearchBar
        query=""
        onSearch={onSearch}
      />
    )

    const input = screen.getByPlaceholderText('搜索技能...')
    fireEvent.change(input, { target: { value: 'weather' } })

    expect(input).toHaveValue('weather')
  })

  it('should debounce search calls', async () => {
    const onSearch = vi.fn()
    render(
      <SearchBar
        query=""
        onSearch={onSearch}
        debounceMs={300}
      />
    )

    const input = screen.getByPlaceholderText('搜索技能...')
    fireEvent.change(input, { target: { value: 'w' } })
    fireEvent.change(input, { target: { value: 'we' } })
    fireEvent.change(input, { target: { value: 'wea' } })
    fireEvent.change(input, { target: { value: 'weather' } })

    // 在防抖时间内，onSearch 不应该被调用
    expect(onSearch).not.toHaveBeenCalled()

    // 快进时间
    vi.advanceTimersByTime(300)

    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch).toHaveBeenCalledWith('weather')
  })

  it('should show clear button when query is not empty', () => {
    render(
      <SearchBar
        query="test"
        onSearch={vi.fn()}
      />
    )

    expect(screen.getByText('✕')).toBeInTheDocument()
  })

  it('should hide clear button when query is empty', () => {
    render(
      <SearchBar
        query=""
        onSearch={vi.fn()}
      />
    )

    expect(screen.queryByText('✕')).not.toBeInTheDocument()
  })

  it('should clear query when clear button clicked', () => {
    const onSearch = vi.fn()
    render(
      <SearchBar
        query="test"
        onSearch={onSearch}
      />
    )

    const clearButton = screen.getByText('✕')
    fireEvent.click(clearButton)

    const input = screen.getByPlaceholderText('搜索技能...')
    expect(input).toHaveValue('')
  })

  it('should use custom placeholder', () => {
    render(
      <SearchBar
        query=""
        onSearch={vi.fn()}
        placeholder="自定义占位符"
      />
    )

    expect(screen.getByPlaceholderText('自定义占位符')).toBeInTheDocument()
  })
})
