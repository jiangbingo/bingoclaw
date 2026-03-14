// apps/web/src/stores/__tests__/marketStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useMarketStore } from '../marketStore'

describe('marketStore', () => {
  beforeEach(() => {
    // 重置 store
    useMarketStore.setState({
      skills: [],
      filteredSkills: [],
      loading: false,
      query: '',
      category: 'all',
      sortBy: 'rating',
      showInstalledOnly: false,
    })
  })

  it('should set skills', () => {
    const { setSkills } = useMarketStore.getState()
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
    ]

    setSkills(mockSkills)

    const state = useMarketStore.getState()
    expect(state.skills).toEqual(mockSkills)
    expect(state.filteredSkills).toEqual(mockSkills)
  })

  it('should set loading', () => {
    const { setLoading } = useMarketStore.getState()

    setLoading(true)

    const state = useMarketStore.getState()
    expect(state.loading).toBe(true)
  })

  it('should filter skills by query', () => {
    const { setSkills, setQuery } = useMarketStore.getState()

    const mockSkills = [
      {
        id: 'skill-1',
        name: 'Weather Query',
        description: 'Query weather',
        icon: '🌤️',
        rating: 4.5,
        downloads: 1000,
        category: 'utility',
        tags: ['weather'],
      },
      {
        id: 'skill-2',
        name: 'Translation',
        description: 'Translate text',
        icon: '🌍',
        rating: 4.8,
        downloads: 2000,
        category: 'utility',
        tags: ['translate'],
      },
    ]

    setSkills(mockSkills)
    setQuery('weather')

    const state = useMarketStore.getState()
    expect(state.filteredSkills).toHaveLength(1)
    expect(state.filteredSkills[0].name).toBe('Weather Query')
  })

  it('should filter skills by category', () => {
    const { setSkills, setCategory } = useMarketStore.getState()

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

    setSkills(mockSkills)
    setCategory('dev')

    const state = useMarketStore.getState()
    expect(state.filteredSkills).toHaveLength(1)
    expect(state.filteredSkills[0].category).toBe('dev')
  })

  it('should sort skills by rating', () => {
    const { setSkills, setSortBy } = useMarketStore.getState()

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

    setSkills(mockSkills)
    setSortBy('rating')

    const state = useMarketStore.getState()
    expect(state.filteredSkills[0].rating).toBe(4.8)
    expect(state.filteredSkills[1].rating).toBe(4.5)
  })

  it('should sort skills by downloads', () => {
    const { setSkills, setSortBy } = useMarketStore.getState()

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

    setSkills(mockSkills)
    setSortBy('downloads')

    const state = useMarketStore.getState()
    expect(state.filteredSkills[0].downloads).toBe(2000)
    expect(state.filteredSkills[1].downloads).toBe(1000)
  })
})
