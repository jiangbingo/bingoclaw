// apps/web/src/stores/marketStore.ts
import { create } from 'zustand'

interface Skill {
  id: string
  name: string
  description: string
  icon: string
  rating: number
  downloads: number
  category: string
  tags: string[]
}

interface MarketState {
  skills: Skill[]
  filteredSkills: Skill[]
  loading: boolean
  query: string
  category: string
  sortBy: string
  showInstalledOnly: boolean

  // Actions
  setSkills: (skills: Skill[]) => void
  setLoading: (loading: boolean) => void
  setQuery: (query: string) => void
  setCategory: (category: string) => void
  setSortBy: (sortBy: string) => void
  setShowInstalledOnly: (show: boolean) => void
  filterSkills: () => void
}

export const useMarketStore = create<MarketState>((set, get) => ({
  skills: [],
  filteredSkills: [],
  loading: false,
  query: '',
  category: 'all',
  sortBy: 'rating',
  showInstalledOnly: false,

  setSkills: (skills) => set({ skills, filteredSkills: skills }),

  setLoading: (loading) => set({ loading }),

  setQuery: (query) => {
    set({ query })
    get().filterSkills()
  },

  setCategory: (category) => {
    set({ category })
    get().filterSkills()
  },

  setSortBy: (sortBy) => {
    set({ sortBy })
    get().filterSkills()
  },

  setShowInstalledOnly: (showInstalledOnly) => {
    set({ showInstalledOnly })
    get().filterSkills()
  },

  filterSkills: () => {
    const { skills, query, category, sortBy, showInstalledOnly } = get()

    let filtered = [...skills]

    // 关键词过滤
    if (query) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(
        (skill) =>
          skill.name.toLowerCase().includes(lowerQuery) ||
          skill.description.toLowerCase().includes(lowerQuery) ||
          skill.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      )
    }

    // 分类过滤
    if (category !== 'all') {
      filtered = filtered.filter((skill) => skill.category === category)
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'downloads':
          return b.downloads - a.downloads
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    set({ filteredSkills: filtered })
  },
}))
