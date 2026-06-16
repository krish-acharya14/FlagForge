import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Challenge } from '../utils/types'

type WorkspaceStore = {
    name: string
    location: string
    challenges: Challenge[]
    activeChallenge: Challenge | null
    setWorkspace: (name: string, location: string) => void
    setChallenges: (challenges: Challenge[]) => void
    setActiveChallenge: (challenge: Challenge) => void
}

export const useWorkspaceStore = create<WorkspaceStore>()(persist(set => ({
    name: '',
    location: '',
    challenges: [],
    activeChallenge: null,
    setWorkspace: (name, location) => set({ name, location }),
    setChallenges: (challenges) => set({ challenges }),
    setActiveChallenge: (challenge) => set({ activeChallenge: challenge })
}), { name: 'workspace-store' }))
