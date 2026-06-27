import { faArrowRightLong, faBroom, faCircleExclamation, faCopy, faEraser, faGripVertical, faKeyboard, faLayerGroup, faMagnifyingGlass, faShapes, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { TOOLS } from '../utils/tools/_index'
import type { ToolDefinition } from '../utils/types'

type Step = {
    id: string
    toolId: string
    options: Record<string, any>
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
                                    <div className="flex flex-row flex-wrap gap-2">
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
                                                        }} className="w-4 h-4 rounded bg-bg accent-primary border border-border focus:outline-none focus:ring-1 focus:ring-primary transition" />
                                                    </div>
                                                case 'select':
                                                    return <div key={option.key} className="flex items-center gap-2">
                                                        <label htmlFor={`${step.id}-${option.key}`} className="text-xs text-muted">{option.label}</label>
                                                        <select id={`${step.id}-${option.key}`} value={step.options[option.key] || option.default} onChange={e => {
                                                            const value = e.target.value
                                                            updateStep(step.id, option.key, value)
                                                        }} className="w-32 p-1 text-sm rounded-lg bg-bg border border-border focus:outline-none focus:ring-1 focus:ring-primary transition">
                                                            {(option.options as string[]).map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                                                        </select>
                                                    </div>
                                                default: return null
                                            }
                                        })}
                                    </div>
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
