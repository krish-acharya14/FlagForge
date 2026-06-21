import { useState } from 'react'
import type { Tool, ToolResult } from '../utils/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faChevronDown, faChevronUp, faCircleCheck, faCopy, faEyeSlash, faFile, faFingerprint, faFont, faHashtag, faImage, faLayerGroup, faMagnifyingGlass, faNetworkWired,
        faSpinner, faTerminal, faWaveSquare, faWrench, faBarcode } from '@fortawesome/free-solid-svg-icons'
import toast from 'react-hot-toast'

type Props = {
    tool: Tool
    results: Record<string, ToolResult[]>
    onRun: () => void
}

const TOOL_ICONS: Record<string, IconDefinition> = {
    file: faFile,
    exiftool: faFingerprint,
    strings: faFont,
    xxd: faTerminal,
    binwalk: faLayerGroup,
    entropy: faWaveSquare,
    steghide: faEyeSlash,
    zsteg: faImage,
    hashid: faHashtag,
    wireshark: faNetworkWired,
    pngfix: faWrench,
    zbarimg: faBarcode
}

export default function ToolAccordion({ tool, results, onRun }: Props) {
    const [open, setOpen] = useState(false)
    const toolResults = results[tool.name] || []
    const hasRun = toolResults.length > 0
    const icon = TOOL_ICONS[tool.name.toLocaleLowerCase()] || faMagnifyingGlass

    const handleCopy = async (content: string) => {
        await navigator.clipboard.writeText(content)
        toast.success('Copied to clipboard')
    }

    return <div className={`border rounded-xl overflow-hidden transition-colors ${open ? 'border-primary/50' : 'border-border'}`}>
        <button
            onClick={() => {
                setOpen(!open)
                if (!hasRun) onRun()
            }}
            className="w-full flex flex-row items-center gap-3 cursor-pointer px-4 py-2.5 bg-bg-light hover:bg-border/30 transition text-left">
                <FontAwesomeIcon icon={icon} className={`w-4 text-sm shrink-0 transition ${open ? 'text-primary' : 'text-muted'}`} />
                <span className="flex flex-col min-w-0 flex-1 gap-0.5">
                    <span className="font-medium leading-tight truncate">{tool.name}</span>
                    <span className="text-xs text-muted leading-tight truncate">{tool.description}</span>
                </span>

                {hasRun && <FontAwesomeIcon icon={faCircleCheck} className="text-success text-xs shrink-0" title="Results available" />}
                <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className="text-muted text-xs shrink-0" />
            </button>

            {open && <div className="flex flex-col gap-2 p-3 bg-bg border-t border-border">
                {hasRun
                    ? toolResults.map((r, i) => <div key={i} className="relative group">
                        <pre className="whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-text/90 bg-bg-light/60 rounded-lg p-3 pr-9 max-h-72 overflow-y-auto">{r.content}</pre>
                        {!!r.content && <button
                                            onClick={() => handleCopy(r.content ?? '')}
                                            title="Copy output"
                                            className="absolute top-2 right-2 text-muted hover:text-primary cursor-pointer transition opacity-0 group-hover:opacity-100"
                                        >
                                            <FontAwesomeIcon icon={faCopy} className="text-xs" />
                                        </button>}
                                    </div>)
                                    : <span className="flex items-center gap-2 text-sm text-muted px-1 py-1">
                                        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                                        Running {tool.name}...
                                    </span>
                        }
        </div>}
    </div>
}