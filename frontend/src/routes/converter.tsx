import { fa1, fa8, faArrowDown19, faArrowRightLong, faArrowUp91, faBroom, faCircleExclamation, faCopy, faEraser, faGripVertical, faHashtag, faKeyboard, faLayerGroup, faLink, faLock, faLockOpen, faMagnifyingGlass, faN, faShapes, faSquareBinary, faTrash, faXmark, type IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

type ToolDefinition = {
    id: string
    name: string
    description: string
    icon: IconDefinition
    defaultOptions?: Record<string, any>
    options?: ToolOption[]
    execute: (input: string, options: Record<string, any>) => string
}

type ToolOption = {
    key: string
    label: string
    type: 'text' | 'number' | 'checkbox'
    default: string | number | boolean
}

// type StepOptions = Record<string, string | number | boolean>

type Step = {
    id: string
    toolId: string
    options: Record<string, any>
}

const TOOLS: ToolDefinition[] = [
    {
        id: 'to-base64',
        name: 'Convert to Base 64',
        description: 'Convert text to Base64 format',
        icon: faLock,
        execute: input => btoa(String.fromCharCode(...new TextEncoder().encode(input)))
    },
    {
        id: 'from-base64',
        name: 'Convert from Base 64',
        description: 'Convert Base64 data to text',
        icon: faLockOpen,
        execute: input => {
            const bytes = Uint8Array.from(atob(input), c => c.charCodeAt(0))
            return new TextDecoder().decode(bytes)
        }
    },
    {
        id: 'to-hex',
        name: 'Convert to Hex',
        description: 'Convert text to its hexadecimal representation',
        icon: faHashtag,
        execute: input => Array.from(new TextEncoder().encode(input)).map(byte => byte.toString(16).padStart(2, '0')).join('')
    },
    {
        id: 'from-hex',
        name: 'Convert from Hex',
        description: 'Convert hexadecimal data to text',
        icon: faHashtag,
        execute: input => {
            const bytes = new Uint8Array(input.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || [])
            return new TextDecoder().decode(bytes)
        }
    },
    {
        id: 'to-decimal',
        name: 'Convert to Decimal',
        description: 'Convert text to its decimal representation',
        icon: fa1,
        execute: input => Array.from(new TextEncoder().encode(input)).map(byte => byte.toString(10)).join(' ')
    },
    {
        id: 'from-decimal',
        name: 'Convert from Decimal',
        description: 'Convert decimal data to text',
        icon: fa1,
        execute: input => {
            const bytes = new Uint8Array(input.split(' ').map(num => parseInt(num, 10)))
            return new TextDecoder().decode(bytes)
        }
    },
    {
        id: 'to-binary',
        name: 'Convert to Binary',
        description: 'Convert text to its binary representation',
        icon: faSquareBinary,
        execute: input => Array.from(new TextEncoder().encode(input)).map(byte => byte.toString(2).padStart(8, '0')).join(' ')
    },
    {
        id: 'from-binary',
        name: 'Convert from Binary',
        description: 'Convert binary data to text',
        icon: faSquareBinary,
        execute: input => {
            const bytes = new Uint8Array(input.split(' ').map(num => parseInt(num, 2)))
            return new TextDecoder().decode(bytes)
        }
    },
    {
        id: 'to-octal',
        name: 'Convert to Octal',
        description: 'Convert text to its octal representation',
        icon: fa8,
        execute: input => Array.from(new TextEncoder().encode(input)).map(byte => byte.toString(8)).join(' ')
    },
    {
        id: 'from-octal',
        name: 'Convert from Octal',
        description: 'Convert octal data to text',
        icon: fa8,
        execute: input => {
            const bytes = new Uint8Array(input.split(' ').map(num => parseInt(num, 8)))
            return new TextDecoder().decode(bytes)
        }
    },
    {
        id: 'to-base-n',
        name: 'Convert to Base N',
        description: 'Convert a decimal number to a custom Base N representation',
        icon: faN,
        options: [
            { key: 'base', label: 'Base', type: 'number', default: 16 }
        ],
        execute: (input, options) => {
            const base = options.base ?? 16
            if(typeof base !== 'number' || base < 2 || base > 36) throw new Error('Base must be a number between 2 and 36')
            if(isNaN(base)) throw new Error('Base must be a valid number')
            if(isNaN(Number(input))) throw new Error('Input must be a valid number')
            if(!input.trim()) return ''
            return parseInt(input, 10).toString(base)
        }
    },
    {
        id: 'from-base-n',
        name: 'Convert from Base N',
        description: 'Convert a custom Base N representation to a decimal number',
        icon: faN,
        options: [
            { key: 'base', label: 'Base', type: 'number', default: 16 }
        ],
        execute: (input, options) => {
            const base = options.base ?? 16
            if(typeof base !== 'number' || base < 2 || base > 36) throw new Error('Base must be a number between 2 and 36')
            if(isNaN(base)) throw new Error('Base must be a valid number')
            if(input.split('').some(char => parseInt(char, 10) >= base)) throw new Error(`Input contains characters that are not valid for base ${base}`)
            if(isNaN(parseInt(input, base))) throw new Error(`Input must be a valid number in base ${base}`)
            if(!input.trim()) return ''
            return parseInt(input, base).toString(10)
        }
    },
    {
        id: 'to-bcd',
        name: 'Convert to BCD',
        description: 'Convert text to its Binary-Coded Decimal representation',
        icon: faArrowDown19,
        execute: input => {
            if(!input.trim()) return ''
            if(input.split('').some(char => isNaN(parseInt(char, 10)))) throw new Error('Input must be a valid decimal number')
            return input.split('').map(digit => parseInt(digit, 10).toString(2).padStart(4, '0')).join(' ')
        }
    },
    {
        id: 'from-bcd',
        name: 'Convert from BCD',
        description: 'Convert Binary-Coded Decimal data to text',
        icon: faArrowUp91,
        execute: input => {
            if(!input.trim()) return ''
            const bytes = input.split(' ').map(num => parseInt(num, 2))
            if(bytes.some(byte => byte < 0 || byte > 9)) throw new Error('Input must be a valid BCD representation')
            return bytes.map(byte => byte.toString(10)).join('')
        }
    },
    {
        id: 'url-encode',
        name: 'URL Encode',
        description: 'Encode text for use in a URL',
        icon: faLink,
        execute: input => encodeURIComponent(input)
    },
    {
        id: 'url-decode',
        name: 'URL Decode',
        description: 'Decode URL-encoded text',
        icon: faLink,
        execute: input => decodeURIComponent(input)
    }
] as const

export default function Converter() {
    const [steps, setSteps] = useState<Step[]>([])
    const [input, setInput] = useState('')
    const [search, setSearch] = useState('')
    const [draggingOver, setDraggingOver] = useState(false)

    const addStep = (tool: ToolDefinition) => {
        setSteps(prev => [
            ...prev, {
                id: crypto.randomUUID(),
                toolId: tool.id,
                options: tool.defaultOptions || {}
            }
        ])
    }

    const updateStep = (stepId: string, optionKey: string, value: any) => {
        setSteps(prev => prev.map(step => step.id === stepId ? { ...step, options: { ...step.options, [optionKey]: value } } : step))
    }

    const removeStep = (index: number) => {
        setSteps(prev => prev.filter((_, i) => i !== index))
    }

    const moveStep = (fromIndex: number, toIndex: number) => {
        if(fromIndex === toIndex) return

        setSteps(prev => {
            const next = [...prev]
            const [moved] = next.splice(fromIndex, 1)
            next.splice(toIndex, 0, moved)
            return next
        })
    }

    const output = useMemo(() => {
        let result = input
        for(const step of steps) {
            const tool = TOOLS.find(t => t.id === step.toolId)
            if(!tool) continue
            try { result = tool.execute(result, step.options) }
            catch(e) { return { value: (e as Error).message, isError: true } }
        }
        return { value: result, isError: false }
    }, [input, steps])

    const toolMap = useMemo(() => Object.fromEntries(TOOLS.map(t => [t.id, t])), [])
    const filteredTools = useMemo(() => TOOLS.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase())), [search])

    const handleCopyOutput = async() => {
        if(!output.value) return
        await navigator.clipboard.writeText(output.value)
        toast.success('Copied to clipboard')
    }
    
    return <div className="min-h-[calc(100vh-3rem)] flex">
        <aside className="flex flex-col gap-2 w-[20vw] bg-bg-light border-r border-border p-6 max-h-[calc(100vh-3rem)]">
            <h1 className="font-semibold uppercase tracking-wider flex items-center gap-2">
                <FontAwesomeIcon icon={faShapes} className="text-muted text-sm" />
                Converter
            </h1>
            <hr className="my-2 border-border" />
            <div className="relative">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search tools..."
                    className="w-full pl-8 pr-8 py-2 text-sm rounded-lg bg-bg border border-border focus:outline-none focus:ring-1 focus:ring-primary transition placeholder:text-muted"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                {search && <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-text transition cursor-pointer">
                    <FontAwesomeIcon icon={faXmark} className="text-xs" />
                </button>}
            </div>
            <hr className="my-2 border-border" />
            <div className="flex flex-col gap-2 overflow-y-auto">
                {filteredTools.length === 0
                    ? <p className="text-sm text-muted text-center py-4">No tools match &ldquo;{search}&rdquo;</p>
                    : filteredTools.map(tool => <button
                        draggable
                        onDragStart={e => e.dataTransfer.setData('tool-id', tool.id)}
                        onClick={() => addStep(tool)}
                        key={tool.id}
                        className="flex items-start gap-3 text-left p-3 rounded-xl bg-bg border border-border hover:border-primary/40 hover:bg-border/20 cursor-grab active:cursor-grabbing transition"
                    >
                        <FontAwesomeIcon icon={tool.icon} className="text-primary text-sm mt-1 shrink-0" />
                        <span className="flex flex-col gap-0.5 min-w-0">
                            <span className="font-medium leading-tight">{tool.name}</span>
                            <span className="text-xs text-muted leading-tight">{tool.description}</span>
                        </span>
                    </button>)
                }
            </div>
        </aside>
        <main
            onDragEnter={() => setDraggingOver(true)}
            onDragOver={e => e.preventDefault()}
            onDragLeave={e => { if(!e.currentTarget.contains(e.relatedTarget as Node)) setDraggingOver(false) }}
            onDrop={e => {
                setDraggingOver(false)
                const toolId = e.dataTransfer.getData('tool-id')
                const tool = TOOLS.find(t => t.id === toolId)
                if(tool) addStep(tool)
            }}
            className="flex-1 p-6 flex flex-col"
        >
            <div className="flex items-center justify-between">
                <h1 className="font-semibold uppercase tracking-wider flex items-center gap-2">
                    <FontAwesomeIcon icon={faLayerGroup} className="text-muted text-sm" />
                    Steps
                    {steps.length > 0 && <span className="text-[10px] px-1.5 rounded-full bg-border/60 text-muted font-normal tracking-normal">{steps.length}</span>}
                </h1>
                {steps.length > 0 && <button onClick={() => setSteps([])} className="flex items-center gap-2 text-xs font-medium text-muted hover:text-primary cursor-pointer transition">
                    <FontAwesomeIcon icon={faBroom} />
                    Clear all
                </button>}
            </div>
            <hr className="my-2 border-border" />
            <div className={`flex-1 min-h-[80vh] border rounded-xl p-4 transition-colors ${draggingOver ? 'border-primary bg-primary/5' : 'border-border'}`}>
                {steps.length === 0
                    ? <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
                        <FontAwesomeIcon icon={faLayerGroup} className="text-muted text-2xl" />
                        <p className="text-muted">Drag a tool here, or click one, to add it to the converter.</p>
                    </div>
                    : steps.map((step, index) => {
                        const tool = toolMap[step.toolId]
                        return <div key={step.id} className="flex flex-col">
                            {index > 0 && <div className="flex justify-center">
                                <FontAwesomeIcon icon={faArrowRightLong} className="text-muted text-xs rotate-90 my-1" />
                            </div>}
                            <div
                                draggable
                                onDragStart={e => e.dataTransfer.setData('step-index', String(index))}
                                onDragOver={e => e.preventDefault()}
                                onDrop={e => {
                                    e.stopPropagation()
                                    setDraggingOver(false)
                                    const stepIndex = e.dataTransfer.getData('step-index')
                                    if(stepIndex !== '') { moveStep(Number(stepIndex), index); return }
                                    const toolId = e.dataTransfer.getData('tool-id')
                                    const newTool = TOOLS.find(t => t.id === toolId)
                                    if(newTool) addStep(newTool)
                                }}
                                className="flex flex-row items-center gap-3 p-3 border border-border rounded-xl bg-bg-light hover:border-primary/30 transition"
                            >
                                <FontAwesomeIcon icon={faGripVertical} className="text-muted cursor-grab active:cursor-grabbing shrink-0" />
                                <span className="shrink-0 w-6 h-6 rounded-full bg-border/60 text-xs flex items-center justify-center font-medium">{index + 1}</span>
                                <FontAwesomeIcon icon={tool.icon} className="text-primary text-sm shrink-0 mt-0.5" />
                                <div className="flex flex-col gap-2 flex-1 min-w-0">
                                    <span className="font-medium leading-tight">{tool ? tool.name : 'Unknown Tool'}</span>
                                    {tool?.options?.map(option => {
                                        switch(option.type) {
                                            case 'number':
                                                return <div key={option.key} className="flex items-center gap-2">
                                                    <label htmlFor={`${step.id}-${option.key}`} className="text-xs text-muted">{option.label}</label>
                                                    <input type="number" id={`${step.id}-${option.key}`} value={step.options[option.key] || option.default} onChange={e => {
                                                        const value = e.target.valueAsNumber
                                                        updateStep(step.id, option.key, value)
                                                    }} className="w-20 p-1 text-sm rounded-lg bg-bg border border-border focus:outline-none focus:ring-1 focus:ring-primary transition" />
                                                </div>
                                            case 'text':
                                                return <div key={option.key} className="flex items-center gap-2">
                                                    <label htmlFor={`${step.id}-${option.key}`} className="text-xs text-muted">{option.label}</label>
                                                    <input type="text" id={`${step.id}-${option.key}`} value={step.options[option.key] || option.default} onChange={e => {
                                                        const value = e.target.value
                                                        updateStep(step.id, option.key, value)
                                                    }} className="w-32 p-1 text-sm rounded-lg bg-bg border border-border focus:outline-none focus:ring-1 focus:ring-primary transition" />
                                                </div>
                                            case 'checkbox':
                                                return <div key={option.key} className="flex items-center gap-2">
                                                    <label htmlFor={`${step.id}-${option.key}`} className="text-xs text-muted">{option.label}</label>
                                                    <input type="checkbox" id={`${step.id}-${option.key}`} checked={step.options[option.key] || option.default} onChange={e => {
                                                        const value = e.target.checked
                                                        updateStep(step.id, option.key, value)
                                                    }} className="w-4 h-4 rounded bg-bg border border-border focus:outline-none focus:ring-1 focus:ring-primary transition" />
                                                </div>
                                            default: return null
                                        }
                                    })}
                                </div>
                                <button onClick={() => removeStep(index)} title="Remove step" className="text-muted hover:text-primary cursor-pointer transition shrink-0"><FontAwesomeIcon icon={faTrash} /></button>
                            </div>
                        </div>
                    })
                }
            </div>
        </main>
        <aside className="flex flex-col gap-2 w-[20vw] bg-bg-light border-l border-border p-6">
            <div className="flex items-center justify-between">
                <h1 className="font-semibold uppercase tracking-wider flex items-center gap-2">
                    <FontAwesomeIcon icon={faKeyboard} className="text-muted text-sm" />
                    Input
                </h1>
                {input && <button onClick={() => setInput('')} title="Clear input" className="text-muted hover:text-primary cursor-pointer transition"><FontAwesomeIcon icon={faEraser} /></button>}
            </div>
            <hr className="my-2 border-border" />
            <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-1/2 p-2 font-mono text-sm rounded-xl bg-bg border border-border focus:outline-none focus:ring-1 focus:ring-primary transition resize-none" placeholder="Enter input data..." />
            <span className="text-xs text-muted self-end">{input.length} {input.length === 1 ? 'character' : 'characters'}</span>

            <div className="flex items-center justify-between mt-4">
                <h1 className="font-semibold uppercase tracking-wider flex items-center gap-2">
                    <FontAwesomeIcon icon={faArrowRightLong} className="text-muted text-sm" />
                    Output
                </h1>
                {!output.isError && output.value && <button onClick={handleCopyOutput} title="Copy output" className="text-muted hover:text-primary cursor-pointer transition"><FontAwesomeIcon icon={faCopy} /></button>}
            </div>
            <hr className="my-2 border-border" />
            {output.isError
                ? <div className="w-full h-1/2 flex flex-col gap-2 p-3 rounded-xl border border-primary/40 bg-primary/10 overflow-y-auto">
                    <span className="flex items-center gap-2 text-sm font-medium text-primary">
                        <FontAwesomeIcon icon={faCircleExclamation} className="text-xs" />
                        Conversion failed
                    </span>
                    <p className="text-xs text-text/80 leading-relaxed">{output.value}</p>
                </div>
                : <textarea value={output.value} readOnly className="w-full h-1/2 p-2 font-mono text-sm rounded-xl bg-bg border border-border focus:outline-none focus:ring-1 focus:ring-primary transition resize-none" placeholder="Output will be displayed here..." />
            }
            {!output.isError && <span className="text-xs text-muted self-end">{output.value.length} {output.value.length === 1 ? 'character' : 'characters'}</span>}
        </aside>
    </div>
}
