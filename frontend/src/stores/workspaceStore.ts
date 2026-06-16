import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Challenge } from '../utils/types'
import { updateChallengeTags } from '../services/host'

type WorkspaceStore = {
    name: string
    location: string
    challenges: Challenge[]
    activeChallenge: Challenge | null
    setWorkspace: (name: string, location: string) => void
    setChallenges: (challenges: Challenge[]) => void
    setActiveChallenge: (challenge: Challenge) => void
    addTagToActiveChallenge: (tag: string) => Promise<void>
    removeTagFromActiveChallenge: (tag: string) => Promise<void>
}


export const useWorkspaceStore = create<WorkspaceStore>()(persist(set => ({
    name: '',
    location: '',
    challenges: [],
    activeChallenge: null,
    setWorkspace: (name, location) => set({ name, location }),
    setChallenges: (challenges) => set({ challenges }),
    setActiveChallenge: (challenge) => set({ activeChallenge: challenge }),
    addTagToActiveChallenge: async (tag: string) => {
        set(state => {
            if (!state.activeChallenge) return {}
            if (state.activeChallenge.tags.includes(tag)) return {}

            const updatedTags = [...state.activeChallenge.tags, tag]
            const updatedChallenge: Challenge = { ...state.activeChallenge, tags: updatedTags }
            const updatedChallenges = state.challenges.map(c =>
                c.id === updatedChallenge.id ? updatedChallenge : c
            )

            updateChallengeTags(state.location, updatedChallenge.id, updatedTags)

            return {
                activeChallenge: updatedChallenge,
                challenges: updatedChallenges
            }
        })
    },
    removeTagFromActiveChallenge: async (tag: string) => {
        set(state => {
            if (!state.activeChallenge) return {}

            const updatedTags = state.activeChallenge.tags.filter(t => t !== tag)
            const updatedChallenge: Challenge = { ...state.activeChallenge, tags: updatedTags }
            const updatedChallenges = state.challenges.map(c =>
                c.id === updatedChallenge.id ? updatedChallenge : c
            )

            updateChallengeTags(state.location, updatedChallenge.id, updatedTags)

            return {
                activeChallenge: updatedChallenge,
                challenges: updatedChallenges
            }
        })
    }
}), { name: 'workspace-store' }))

