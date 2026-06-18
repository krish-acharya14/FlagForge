import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { sendCommand } from '../services/host'
import { Commands } from '../utils/commands'
import type { Challenge } from '../utils/types'

type WorkspaceStore = {
    name: string
    path: string
    challenges: Challenge[]
    activeChallenge: Challenge | null
    setWorkspace: (name: string, path: string) => void
    setChallenges: (challenges: Challenge[]) => void
    setActiveChallenge: (challenge: Challenge | null) => void
    loadChallenges: () => Promise<void>
    updateActiveChallengeField: (field: 'tags' | 'description' | 'solution' | 'flag', value: string | string[]) => Promise<Challenge | null>
}

export const useWorkspaceStore = create<WorkspaceStore>()(persist((set, get) => ({
    name: '',
    path: '',
    challenges: [],
    activeChallenge: null,
    setWorkspace: (name, path) => set({ name, path }),
    setChallenges: (challenges) => set(state => ({
        challenges,
        activeChallenge: state.activeChallenge
            ? challenges.find(challenge => challenge.id === state.activeChallenge?.id) ?? null
            : null
    })),
    setActiveChallenge: (challenge) => set({ activeChallenge: challenge }),
    loadChallenges: async () => {
        const fetchedChallenges = await sendCommand<Challenge[]>(Commands.LoadChallenges, { path: get().path })
        set(state => ({
            challenges: fetchedChallenges.sort((a,b) => a.order - b.order),
            activeChallenge: state.activeChallenge
                ? fetchedChallenges.find(challenge => challenge.id === state.activeChallenge?.id) ?? null
                : null
        }))
    },
    updateActiveChallengeField: async (field, value) => {
        const current = get().activeChallenge
        if(!current) return null

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
}), { name: 'workspace-store' }))
