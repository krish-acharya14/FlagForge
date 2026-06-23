import type { ToolDefinition } from '../types'
import { CRYPTOGRAPHY_TOOLS } from './cryptography'
import { DATA_CONVERSION_TOOLS } from './data-conversion'

export const TOOLS: ToolDefinition[] = [
    ...DATA_CONVERSION_TOOLS,
    ...CRYPTOGRAPHY_TOOLS
] as const
