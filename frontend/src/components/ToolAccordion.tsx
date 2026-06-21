import { useState } from 'react'
import type { Tool, ToolResult } from '../utils/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

type Props = {
    tool: Tool
    results: Record<string, ToolResult[]>
    onRun: () => void
}

export default function ToolAccordion({ tool, results, onRun }: Props) {
    const [open, setOpen] = useState(false)

    return <div className="border border-border rounded-xl overflow-hidden">
        <button onClick={() => {
            setOpen(!open)
            if(!results[tool.name]?.length) onRun()
        }} className="w-full flex flex-row items-center justify-between cursor-pointer px-4 py-2 bg-bg-light hover:bg-bg-light/50 transition">
            <span className="font-medium">{tool.name}</span>
            <span>{open ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}</span>
        </button>
        {open && <div className="p-3 bg-bg-light text-sm">
            {results[tool.name]?.length ? results[tool.name].map((r, i) => <pre className="whitespace-pre-wrap" key={i}>{r.content}</pre>) : 'Loading...'}    
        </div>}
    </div>
}
