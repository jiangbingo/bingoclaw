// apps/web/src/components/SearchBar.tsx
import React, { useState, useEffect } from 'react'

interface SearchBarProps {
  query: string
  onSearch: (query: string) => void
  placeholder?: string
  debounceMs?: number
}

export function SearchBar({
  query: initialQuery,
  onSearch,
  placeholder = '搜索技能...',
  debounceMs = 300,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, onSearch, debounceMs])

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        🔍
      </div>
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
    </div>
  )
}
