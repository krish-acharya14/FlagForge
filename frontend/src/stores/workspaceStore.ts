import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Workspace } from '../utils/types'

type WorkspaceStore = {
    name: string
    location: string
    projects: Workspace[]
    setWorkspace: (name: string, location: string) => void
}

export const useWorkspaceStore = create<WorkspaceStore>()(persist(set => ({
    name: '',
    location: '',
    projects: [],
    setWorkspace: (name, location) => set({ name, location }),
    clearWorkspace: () => set({name: '', location: ''})
}), { name: 'workspace-store' }))
