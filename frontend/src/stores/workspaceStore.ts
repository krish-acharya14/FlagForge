import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project } from '../utils/types'

type WorkspaceStore = {
    name: string
    location: string
    projects: Project[]
    setWorkspace: (name: string, location: string) => void
    setProjects: (projects: Project[]) => void
}

export const useWorkspaceStore = create<WorkspaceStore>()(persist(set => ({
    name: '',
    location: '',
    projects: [],
    setWorkspace: (name, location) => set({ name, location }),
    setProjects: (projects) => set({ projects })
}), { name: 'workspace-store' }))
