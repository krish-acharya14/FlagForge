import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { sendCommand } from '../services/host'
import { Commands } from '../utils/commands'
import type { Challenge } from '../utils/types'

type FilterStatus = 'all' | 'solved' | 'unsolved'

type WorkspaceStore = {
    name: string
    path: string
    challenges: Challenge[]
    activeChallenge: Challenge | null
    searchQuery: string
    filterTags: string[]
    filterStatus: FilterStatus
    setWorkspace: (name: string, path: string) => void
    setChallenges: (challenges: Challenge[]) => void
    setActiveChallenge: (challenge: Challenge | null) => void
    loadChallenges: () => Promise<void>
    updateActiveChallengeField: (field: 'tags' | 'description' | 'solution' | 'flag', value: string | string[]) => Promise<Challenge | null>
    setSearchQuery: (query: string) => void
    toggleFilterTag: (tag: string) => void
    setFilterStatus: (status: FilterStatus) => void
    clearFilters: () => void
}

export const useWorkspaceStore = create<WorkspaceStore>()(persist((set, get) => ({
    name: '',
    path: '',
    challenges: [],
    activeChallenge: null,
    searchQuery: '',
    filterTags: [],
    filterStatus: 'all',
    setWorkspace: (name, path) => set({name, path}),
    setChallenges: (challenges) => set(state => ({
        challenges,
        activeChallenge: state.activeChallenge
            ? challenges.find(challenge => challenge.id === state.activeChallenge?.id) ?? null
            : null
    })),
    setActiveChallenge: (challenge) => set({activeChallenge: challenge }),
    loadChallenges: async () => {
        const fetchedChallenges = await sendCommand<Challenge[]>(Commands.LoadChallenges, {path : get().path})
        set(state => ({
            challenges: fetchedChallenges.sort((a,b) => a.order - b.order),
            activeChallenge: state.activeChallenge
                ? fetchedChallenges.find(challenge => challenge.id === state.activeChallenge?.id) ?? null
                : null
        }))
    },
    updateActiveChallengeField: async (field: 'tags' | 'description' | 'solution' | 'flag', value: string | string[]) => {
        const current = get().activeChallenge
        if (!current) return null
        
        const updatedChallenge = await sendCommand<Challenge>(Commands.UpdateChallenge, {
            path: get().path,
            id: current.id,
            [field]: value
        })

        set(state => ({
            challenges: state.challenges.map(challenge => challenge.id === updatedChallenge.id ? updatedChallenge : challenge),
            activeChallenge: updatedChallenge
        }))
        return updatedChallenge
    },
    setSearchQuery: (query) => set({ searchQuery: query }),
    toggleFilterTag: (tag) => set(state => ({
        filterTags: state.filterTags.includes(tag)
            ? state.filterTags.filter(t => t !== tag)
            : [...state.filterTags, tag]
    })),
    setFilterStatus: (status) => set({ filterStatus: status}),
    clearFilters: () => set({ searchQuery: '', filterTags: [], filterStatus: 'all'}),
}), {
    name: 'workspace-store',
    partialize: (state) => ({
        name: state.name,
        path: state.path,
        challenges: state.challenges,
        activeChallenge: state.activeChallenge,
    })
}))
