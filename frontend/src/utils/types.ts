export type Workspace = {
    id: string
    name: string
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
    attachments: string[]
    solution: string
    flag: string
    order: number
    createdAt: Date
    updatedAt: Date
}
