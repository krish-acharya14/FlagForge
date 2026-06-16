export type Workspace = {
    id: string
    name: string
    location: string
    path: string
    version: number
    createdAt: Date
    updatedAt: Date
}

export type Challenge = {
    id: string
    title: string
    description: string
    tags: string[]
    solution: string
    flag: string
    createdAt: Date
    updatedAt: Date
}
