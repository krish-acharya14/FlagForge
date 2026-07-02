import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'

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

export type Tool = {
    name: string
    description: string
}

export type ToolResult = {
    type?: string
    content?: string
    isError?: boolean
    metadata?: Record<string, any>
}

export type ToolDefinition = {
    id: string
    name: string
    description: string
    category?: 'Data Conversion' | 'Cryptography' | 'Hashing' | 'Others'
    icon: IconDefinition
    defaultOptions?: Record<string, any>
    options?: ToolOption[]
    execute: (input: string, options: Record<string, any>) => string
}

export type ToolOption = {
    key: string
    label: string
    type: 'text' | 'number' | 'checkbox' | 'select'
    default: string | number | boolean
    options?: string[] | number[] | boolean[]
    dependsOn?: { key: string, value: string | number | boolean | (string | number | boolean)[] }
}
