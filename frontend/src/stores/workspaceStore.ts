import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Challenge } from '../utils/types'

type WorkspaceStore = {
    name: string
    location: string
    challenges: Challenge[]
    setWorkspace: (name: string, location: string) => void
    setChallenges: (challenges: Challenge[]) => void
}

export const useWorkspaceStore = create<WorkspaceStore>()(persist(set => ({
    name: '',
    location: '',
    challenges: [],
    setWorkspace: (name, location) => set({ name, location }),
    setChallenges: (challenges) => set({ challenges })
}), { name: 'workspace-store' }))
