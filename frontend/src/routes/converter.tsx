import { faArrowRightLong, faBroom, faCircleExclamation, faCopy, faEraser, faGripVertical, faKeyboard, faLayerGroup, faMagnifyingGlass, faShapes, faTrash, faXmark, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import type { ToolDefinition } from '../utils/types'
import { TOOLS } from '../utils/tools/_index'

type Step = {
    id: string
    toolId: string
    options: Record<string, any>
}

function FieldSelect({ id, value, options, onChange }: { id: string, value: string, options: string[], onChange: (v: string) => void }) {
    return (
        <div className="relative">
            <select
                id={id}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full appearance-none py-1.5 pl-2.5 pr-6 text-xs rounded-md bg-bg border border-border focus:outline-none focus:border-primary/50 transition cursor-pointer text-text"
            >
                {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-muted pointer-events-none" />
        </div>
    )
}

function FieldLabel({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) {
    return (
        <label htmlFor={htmlFor} className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted/70 leading-none">
            {children}
        </label>
    )
}

export default function Converter() {
    const [steps, setSteps] = useState<Step[]>([])
    const [input, setInput] = useState('')
    const [search, setSearch] = useState('')
    const [draggingOver, setDraggingOver] = useState(false)

    const addDefaultOptions = (tool: ToolDefinition) => {
        return Object.fromEntries(tool.options?.map(option => [option.key, option.default]) || [])
    }

    const addStep = (tool: ToolDefinition) => {
        setSteps(prev => [
            ...prev, {
                id: crypto.randomUUID(),
                toolId: tool.id,
                options: addDefaultOptions(tool)
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

    const renderOption = (step: Step, option: any) => {
        const fieldId = `${step.id}-${option.key}`
        const value = step.options[option.key] ?? option.default

        switch(option.type) {
            case 'number':
                return (
                    <div key={option.key} className="flex flex-col gap-1.5">
                        <FieldLabel htmlFor={fieldId}>{option.label}</FieldLabel>
                        <input
                            type="number"
                            id={fieldId}
                            value={value}
                            onChange={e => updateStep(step.id, option.key, e.target.valueAsNumber)}
                            className="w-full py-1.5 px-2.5 text-xs rounded-md bg-bg border border-border focus:outline-none focus:border-primary/50 transition"
                        />
                    </div>
                )
            case 'text':
                return (
                    <div key={option.key} className="flex flex-col gap-1.5">
                        <FieldLabel htmlFor={fieldId}>{option.label}</FieldLabel>
                        <input
                            type="text"
                            id={fieldId}
                            value={value}
                            onChange={e => updateStep(step.id, option.key, e.target.value)}
                            className="w-full py-1.5 px-2.5 text-xs rounded-md bg-bg border border-border focus:outline-none focus:border-primary/50 transition font-mono"
                        />
                    </div>
                )
            case 'checkbox':
                return (
                    <div key={option.key} className="flex flex-col gap-1.5">
                        <FieldLabel htmlFor={fieldId}>{option.label}</FieldLabel>
                        <div className="flex items-center h-6.5">
                            <input
                                type="checkbox"
                                id={fieldId}
                                checked={value}
                                onChange={e => updateStep(step.id, option.key, e.target.checked)}
                                className="w-3.5 h-3.5 rounded bg-bg border border-border focus:outline-none focus:ring-1 focus:ring-primary/50 transition accent-primary cursor-pointer"
                            />
                        </div>
                    </div>
                )
            case 'select':
                return (
                    <div key={option.key} className="flex flex-col gap-1.5">
                        <FieldLabel htmlFor={fieldId}>{option.label}</FieldLabel>
                        <FieldSelect
                            id={fieldId}
                            value={value}
                            options={option.options as string[]}
                            onChange={v => updateStep(step.id, option.key, v)}
                        />
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-[calc(100vh-3rem)] flex">
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
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-text transition cursor-pointer">
                            <FontAwesomeIcon icon={faXmark} className="text-xs" />
                        </button>
                    )}
                </div>
                <hr className="my-2 border-border" />
                <div className="flex flex-col gap-2 overflow-y-auto">
                    {filteredTools.length === 0
                        ? <p className="text-sm text-muted text-center py-4">No tools match &ldquo;{search}&rdquo;</p>
                        : filteredTools.map(tool => (
                            <button
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
                            </button>
                        ))
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
                        {steps.length > 0 && (
                            <span className="text-[10px] px-1.5 rounded-full bg-border/60 text-muted font-normal tracking-normal">{steps.length}</span>
                        )}
                    </h1>
                    {steps.length > 0 && (
                        <button onClick={() => setSteps([])} className="flex items-center gap-2 text-xs font-medium text-muted hover:text-primary cursor-pointer transition">
                            <FontAwesomeIcon icon={faBroom} />
                            Clear all
                        </button>
                    )}
                </div>
                <hr className="my-2 border-border" />

                <div className={`flex-1 min-h-[80vh] border rounded-xl p-4 transition-colors ${draggingOver ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    {steps.length === 0
                        ? (
                            <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
                                <FontAwesomeIcon icon={faLayerGroup} className="text-muted text-2xl" />
                                <p className="text-muted">Drag a tool here, or click one, to add it to the converter.</p>
                            </div>
                        )
                        : steps.map((step, index) => {
                            const tool = toolMap[step.toolId]
                            return (
                                <div key={step.id} className="flex flex-col">
                                    {index > 0 && (
                                        <div className="flex justify-center">
                                            <FontAwesomeIcon icon={faArrowRightLong} className="text-muted/40 text-xs rotate-90 my-1.5" />
                                        </div>
                                    )}
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
                                        className="border border-border rounded-xl bg-bg-light hover:border-primary/25 transition overflow-hidden"
                                    >
                                        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
                                            <FontAwesomeIcon icon={faGripVertical} className="text-muted/40 cursor-grab active:cursor-grabbing shrink-0 text-xs" />
                                            <span className="shrink-0 w-5 h-5 rounded-full bg-border/60 text-[10px] flex items-center justify-center font-semibold text-muted tabular-nums">
                                                {index + 1}
                                            </span>
                                            <FontAwesomeIcon icon={tool.icon} className="text-primary text-xs shrink-0" />
                                            <span className="font-medium text-sm flex-1 leading-tight">{tool?.name ?? 'Unknown Tool'}</span>
                                            <button
                                                onClick={() => removeStep(index)}
                                                title="Remove step"
                                                className="text-muted/40 hover:text-primary cursor-pointer transition shrink-0 text-xs"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>

                                        {tool?.options && tool.options.length > 0 && (
                                            <div className="px-4 py-3 grid grid-cols-3 gap-x-4 gap-y-3">
                                                {tool.options.map(option => renderOption(step, option))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
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
                    {input && (
                        <button onClick={() => setInput('')} title="Clear input" className="text-muted hover:text-primary cursor-pointer transition">
                            <FontAwesomeIcon icon={faEraser} />
                        </button>
                    )}
                </div>
                <hr className="my-2 border-border" />
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full h-1/2 p-2 font-mono text-sm rounded-xl bg-bg border border-border focus:outline-none focus:ring-1 focus:ring-primary transition resize-none"
                    placeholder="Enter input data..."
                />
                <span className="text-xs text-muted self-end">{input.length} {input.length === 1 ? 'character' : 'characters'}</span>

                <div className="flex items-center justify-between mt-4">
                    <h1 className="font-semibold uppercase tracking-wider flex items-center gap-2">
                        <FontAwesomeIcon icon={faArrowRightLong} className="text-muted text-sm" />
                        Output
                    </h1>
                    {!output.isError && output.value && (
                        <button onClick={handleCopyOutput} title="Copy output" className="text-muted hover:text-primary cursor-pointer transition">
                            <FontAwesomeIcon icon={faCopy} />
                        </button>
                    )}
                </div>
                <hr className="my-2 border-border" />
                {output.isError
                    ? (
                        <div className="w-full h-1/2 flex flex-col gap-2 p-3 rounded-xl border border-primary/40 bg-primary/10 overflow-y-auto">
                            <span className="flex items-center gap-2 text-sm font-medium text-primary">
                                <FontAwesomeIcon icon={faCircleExclamation} className="text-xs" />
                                Conversion failed
                            </span>
                            <p className="text-xs text-text/80 leading-relaxed">{output.value}</p>
                        </div>
                    )
                    : (
                        <textarea
                            value={output.value}
                            readOnly
                            className="w-full h-1/2 p-2 font-mono text-sm rounded-xl bg-bg border border-border focus:outline-none focus:ring-1 focus:ring-primary transition resize-none"
                            placeholder="Output will be displayed here..."
                        />
                    )
                }
                {!output.isError && <span className="text-xs text-muted self-end">{output.value.length} {output.value.length === 1 ? 'character' : 'characters'}</span>}
            </aside>
        </div>
    )
}
