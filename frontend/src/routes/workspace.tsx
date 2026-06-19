import { faDownload, faFile, faFileCirclePlus, faFilter, faGripVertical, faPlus, faTag, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BlockTypeSelect, BoldItalicUnderlineToggles, headingsPlugin, linkPlugin, listsPlugin, ListsToggle, markdownShortcutPlugin, MDXEditor, quotePlugin, toolbarPlugin, UndoRedo } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'
import CreateChallengeModal from '../components/CreateChallengeModal'
import { sendCommand } from '../services/host'
import { useWorkspaceStore } from '../stores/workspaceStore'
import { Commands } from '../utils/commands'

const CTF_DEFAULT_TAGS = [
    'pwn', 'forensics', 'cryptography', 'web', 'reversing',
    'misc', 'osint', 'steganography', 'network', 'binary exploitation',
    'hardware', 'blockchain', 'mobile', 'radio', 'sql injection',
    'xss', 'rop', 'ppc', 'trivia', 're'
]

export default function Workspace() {
    const navigate = useNavigate()
    const workspaceStore = useWorkspaceStore()
    const [createChallengeModalOpen, setCreateChallengeModalOpen] = useState(false)
    const [deleteChallengeModalOpen, setDeleteChallengeModalOpen] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)

    const [tagDropdownOpen, setTagDropdownOpen] = useState(false)
    const [tagInput, setTagInput] = useState('')
    const tagDropdownRef = useRef<HTMLDivElement>(null)
    const tagInputRef = useRef<HTMLInputElement>(null)
    const filterDropdownRef = useRef<HTMLDivElement>(null)

    const [draggedId, setDraggedId] = useState<string | null>(null)
    const [dragOverId, setDragOverId] = useState<string | null>(null)

    const handleDragStart = (id: string) => {
        setDraggedId(id)
        setDragOverId(id)
    }

    const handleDragOver = (e: React.DragEvent, id: string) => {
        e.preventDefault()
        if(draggedId && draggedId !== id) setDragOverId(id)
    }

    const handleDrop = async(e: React.DragEvent) => {
        e.preventDefault()
        if(draggedId && dragOverId && draggedId !== dragOverId) {
            const reordered = [...workspaceStore.challenges]
            const draggedIndex = reordered.findIndex(c => c.id === draggedId)
            const dragOverIndex = reordered.findIndex(c => c.id === dragOverId)
            if(draggedIndex !== -1 && dragOverIndex !== -1) {
            const [draggedChallenge] = reordered.splice(draggedIndex, 1)
                reordered.splice(dragOverIndex, 0, draggedChallenge)
                const updatedChallenges = reordered.map((c, index) => ({ ...c, order: index }))
                workspaceStore.setChallenges(updatedChallenges)
                try { await sendCommand(Commands.ReorderChallenges, { path: workspaceStore.path, challenges: updatedChallenges.map(c => ({ id: c.id, order: c.order })) }) }
                catch(err) {
                    console.error('Error reordering challenges:', err)
                    await workspaceStore.loadChallenges()
                }
            }
        }
        setDraggedId(null)
        setDragOverId(null)
    }

    const handleDragEnd = () => {
        setDraggedId(null)
        setDragOverId(null)
    }
 
    const mdPlugins = [
        headingsPlugin(), listsPlugin(), quotePlugin(), linkPlugin(), markdownShortcutPlugin(), toolbarPlugin({
            toolbarContents: () => <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <ListsToggle />
                <BlockTypeSelect />
            </>
        })
    ]

    const challenges = workspaceStore.challenges
    const activeChallenge = workspaceStore.activeChallenge
    const filterTags = workspaceStore.filterTags
    const filterStatus = workspaceStore.filterStatus

    const allTagsInWorkspace = useMemo(
        () => Array.from(new Set(challenges.flatMap(c => c.tags))).sort(),
        [challenges]
    )

    const activeFiltersCount = filterTags.length + (filterStatus !== 'all' ? 1 : 0)

    const filteredChallenges = useMemo(() => {
        return challenges.filter(challenge => {
            if(filterTags.length > 0) {
                const hasAllTags = filterTags.every(ft => challenge.tags.includes(ft))
                if(!hasAllTags) return false
            }
            if(filterStatus !== 'all') {
                const isSolved = /^.+\{.+\}$/.test(challenge.flag.trim())
                if(filterStatus === 'solved' && !isSolved) return false
                if(filterStatus === 'unsolved' && isSolved) return false
            }
            return true
        })
    }, [challenges, filterTags, filterStatus])

    useEffect(() => {
        if(!workspaceStore.name) navigate('/')
        workspaceStore.loadChallenges()
        sendCommand(Commands.UpdateDiscordRPC, { details: `Workspace: ${workspaceStore.name}`, state: activeChallenge ? `Editing Challenge: ${activeChallenge.title}` : "Browsing Challenges" })
    }, [])

    useEffect(() => {
        sendCommand(Commands.UpdateDiscordRPC, { details: `Workspace: ${workspaceStore.name}`, state: activeChallenge ? `Editing Challenge: ${activeChallenge.title}` : "Browsing Challenges" })
    }, [activeChallenge])

    useEffect(() => {
        if(tagDropdownOpen) tagInputRef.current?.focus()
    }, [tagDropdownOpen])

    useEffect(() => {
        const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
            if(tagDropdownRef.current && !tagDropdownRef.current.contains(e.target as Node)) {
                setTagDropdownOpen(false)
                setTagInput('')
            }
        }
        if(tagDropdownOpen) document.addEventListener('mousedown', handleClickOutside as any)
        return () => document.removeEventListener('mousedown', handleClickOutside as any)
    }, [tagDropdownOpen])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(filterDropdownRef.current && !filterDropdownRef.current.contains(e.target as Node)) {
                setFilterOpen(false)
            }
        }
        if(filterOpen) document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [filterOpen])

    const handleAddTag = async(tag: string) => {
        const trimmed = tag.trim()
        if(!trimmed || activeChallenge?.tags.includes(trimmed)) return
        const tags = activeChallenge?.tags || []
        workspaceStore.updateActiveChallengeField('tags', [...tags, trimmed])
        setTagInput('')
        setTagDropdownOpen(false)
    }

    const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            handleAddTag(tagInput)
        } else if(e.key === 'Escape') {
            setTagDropdownOpen(false)
            setTagInput('')
        }
    }

    const handleRemoveTag = async(tag: string) => {
        if(!activeChallenge) return
        const updatedTags = activeChallenge.tags.filter(t => t !== tag)
        workspaceStore.updateActiveChallengeField('tags', updatedTags)
    }

    const handleCreateReadme = async() => {
        if(!activeChallenge) return
        await sendCommand(Commands.CreateReadme, { path: workspaceStore.path, title: activeChallenge.title })
    }

    const handleDeleteChallenge = async() => {
        if(!activeChallenge) return
        await sendCommand(Commands.DeleteChallenge, { path: workspaceStore.path, id: activeChallenge.id })
        workspaceStore.loadChallenges()
    }

    const handleAddAttachments = async() => {
        if(!activeChallenge) return
        await sendCommand(Commands.AddAttachments, { path: workspaceStore.path, id: activeChallenge.id })
        workspaceStore.loadChallenges()
    }

    const allExistingTags = activeChallenge
        ? Array.from(new Set(challenges.flatMap(c => c.tags))).filter(tag => !activeChallenge.tags.includes(tag)
    ) : []

    const ctfTagsToShow = activeChallenge
        ? CTF_DEFAULT_TAGS.filter(t => !activeChallenge.tags.includes(t) && !allExistingTags.includes(t) && (!tagInput.trim() || t.toLowerCase().includes(tagInput.toLowerCase()))
    ) : []

    const filteredExistingTags = tagInput.trim() ? allExistingTags.filter(t => t.toLowerCase().includes(tagInput.toLowerCase())) : allExistingTags
    const nothingToShow = !tagInput.trim() && ctfTagsToShow.length === 0 && filteredExistingTags.length === 0

    const getChallengeButtonClass = (challengeId: string, flag: string) => {
        const isActive = activeChallenge?.id === challengeId
        const isCompleted = /^.+\{.+\}$/.test(flag.trim())

        if(isCompleted && isActive) return 'bg-success border border-text/20'
        if(isCompleted && !isActive) return 'bg-success/30 hover:bg-success/50 border border-text/10 text-text/90'
        if(!isCompleted && isActive) return 'bg-primary'
        return 'bg-border/50 hover:bg-border'
    }

    return <div className="min-h-[calc(100vh-3rem)] flex">
        <aside className="flex flex-col gap-2 w-[20vw] p-6 bg-bg-light border-r border-border">
            <h1 className="font-semibold uppercase tracking-wider">Workspace</h1>
            <span className="text-sm line-clamp-1 text-muted">{workspaceStore.name}</span>
            {workspaceStore.path && <span className="text-xs text-muted line-clamp-1 break-all">{workspaceStore.path.replaceAll('\\', '/')}</span>}
            <hr className="my-2 border-border" />

            <div className="flex flex-row justify-between items-center">
                <h1 className="font-semibold uppercase tracking-wider">Challenges</h1>
                <div className="flex items-center gap-1">
                    <div className="relative" ref={filterDropdownRef}>
                        <button
                            onClick={() => setFilterOpen(prev => !prev)}
                            className={`relative cursor-pointer text-muted hover:text-text transition px-1 ${activeFiltersCount > 0 ? 'text-primary!' : ''}`}
                            title="Filter challenges"
                        >
                            <FontAwesomeIcon icon={faFilter} className="text-xs" />
                            {activeFiltersCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 text-[9px] flex items-center justify-center bg-primary rounded-full text-text font-bold">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>

                        {filterOpen && (
                            <div className="absolute left-0 top-full mt-2 z-50 bg-bg-light border border-border rounded-xl shadow-xl w-56 overflow-hidden">
                                <div className="p-3 border-b border-border">
                                    <p className="text-xs text-muted uppercase tracking-wider font-semibold mb-2">Status</p>
                                    <div className="flex gap-1">
                                        {(['all', 'solved', 'unsolved'] as const).map(s => (
                                            <button key={s} onClick={() => workspaceStore.setFilterStatus(s)} className={`flex-1 text-xs px-2 py-1 rounded-lg cursor-pointer transition capitalize ${filterStatus === s ? 'bg-primary text-text' : 'bg-border/40 hover:bg-border text-muted hover:text-text'}`}>
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {allTagsInWorkspace.length > 0 && (
                                    <div className="p-3">
                                        <p className="text-xs text-muted uppercase tracking-wider font-semibold mb-2 flex items-center gap-1.5">
                                            <FontAwesomeIcon icon={faTag} className="text-[10px]" />
                                            Filter by Tag
                                        </p>
                                        <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto">
                                            {allTagsInWorkspace.map(tag => (
                                                <button key={tag} onClick={() => workspaceStore.toggleFilterTag(tag)} className={`text-xs px-2 py-0.5 rounded-full cursor-pointer transition ${filterTags.includes(tag) ? 'bg-primary text-text' : 'bg-border/40 hover:bg-border text-muted hover:text-text'}`}>
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeFiltersCount > 0 && (
                                    <div className="px-3 pb-3">
                                        <button onClick={() => { workspaceStore.clearFilters(); setFilterOpen(false) }} className="w-full text-xs py-1.5 rounded-lg bg-border/40 hover:bg-border text-muted hover:text-text cursor-pointer transition">
                                            Clear all filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <button onClick={() => setCreateChallengeModalOpen(true)} className="cursor-pointer text-muted hover:text-text transition"><FontAwesomeIcon icon={faPlus} /></button>
                </div>
            </div>

            {activeFiltersCount > 0 && (
                <div className="flex items-center justify-between text-xs text-muted">
                    <span>{filteredChallenges.length} of {challenges.length} shown</span>
                    <button onClick={() => workspaceStore.clearFilters()} className="hover:text-text cursor-pointer transition">clear</button>
                </div>
            )}

            {filteredChallenges.length === 0
                ? <span className="text-sm text-muted">
                    {challenges.length === 0 ? 'No challenges found.' : 'No challenges match your filters.'}
                  </span>
                : filteredChallenges.map(challenge => {
                    const isActive = activeChallenge?.id === challenge.id
                    const isCompleted = /^.+\{.+\}$/.test(challenge.flag.trim())
                    const attachments = challenge.attachments ?? []
                    return <div key={challenge.id} draggable onDragStart={() => handleDragStart(challenge.id)} onDragOver={(e) => handleDragOver(e, challenge.id)} onDrop={handleDrop} onDragEnd={handleDragEnd} className={`group flex items-center gap-1 rounded-xl transition-all duration-150 ${draggedId === challenge.id ? 'opacity-40 scale-[0.97]' : '' } ${ dragOverId === challenge.id && draggedId !== challenge.id ? 'ring-1 ring-primary/60' : ''}`}>
                        <span className="shrink-0 cursor-grab active:cursor-grabbing text-muted px-1 opacity-0 group-hover:opacity-40 hover:opacity-90! transition-opacity select-none mt-2.5" title="Drag to reorder">
                            <FontAwesomeIcon icon={faGripVertical} className="text-xs" />
                        </span>
                        <button onClick={() => workspaceStore.setActiveChallenge(challenge)} className={`text-left flex-1 min-w-0 p-2 rounded-xl cursor-pointer transition ${getChallengeButtonClass(challenge.id, challenge.flag)}`}>
                            <div className="line-clamp-1 font-medium">{challenge.title}</div>
                            {isActive && <>
                                {challenge.tags.length > 0 && <div className="flex flex-wrap gap-1 mt-1.5"> 
                                    {challenge.tags.slice(0,2).map(tag => (
                                        <span key={tag} className={`text-[10px] px-1.5 rounded-full ${isCompleted ? 'bg-text/10 text-text/90' : 'bg-text/30 text-text/80'}`}>{tag}</span>
                                    ))}
                                    {challenge.tags.length > 2 && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-text/10 text-text/90">+{challenge.tags.length - 2}</span>
                                    )}
                                </div>} 
                                {attachments.length > 0 && <div className="flex items-center gap-1 mt-1.5 text-[10px] text-text/90">
                                    <FontAwesomeIcon icon={faFile} className="text-[9px]"/>
                                    <span>{attachments.length} attachment{attachments.length != 1 ? 's' : ''}</span>
                                </div>}   
                            </>}
                        </button>
                    </div>
                })
            }
        </aside>

        {!activeChallenge
            ? <main className="flex flex-col items-center justify-center flex-1 p-6">
                <h1 className="text-3xl">Welcome to your Workspace!</h1>
                <h2 className="text-xl mt-2 text-muted/90">{workspaceStore.name}</h2>
                <span className="text-muted mt-2">Your CTF workspace is ready.</span>
            </main>
            : <main className="flex flex-col gap-2 p-6 flex-1">
                <div className="flex flex-row justify-between items-center">
                    <h1 className="text-4xl">{activeChallenge.title}</h1>
                    <div className="flex flex-row gap-2 items-center">
                        <button onClick={handleAddAttachments} className="bg-bg-light/50 px-3 py-2 border border-border rounded-xl cursor-pointer hover:bg-bg-light hover:text-primary transition"><FontAwesomeIcon icon={faFileCirclePlus} /></button>
                        <button onClick={handleCreateReadme} className="bg-bg-light/50 px-3 py-2 border border-border rounded-xl cursor-pointer hover:bg-bg-light hover:text-primary transition"><FontAwesomeIcon icon={faDownload} /></button>
                        <button onClick={() => setDeleteChallengeModalOpen(true)} className="bg-bg-light/50 px-3 py-2 border border-border rounded-xl cursor-pointer hover:bg-bg-light hover:text-primary transition"><FontAwesomeIcon icon={faTrash} /></button>
                    </div>
                </div>
                <hr className="my-2 border-border" />
                <div className="flex flex-row gap-4 flex-wrap items-center">
                    {activeChallenge.tags.map(tag => <span key={tag} className="flex items-center gap-1 text-sm bg-primary/50 outline-2 outline-dashed outline-primary p-2 rounded-full group">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} className="ml-1 text-xs opacity-60 hover:opacity-100 cursor-pointer transition" title="Remove tag">
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </span>)}
                    <div className="relative" ref={tagDropdownRef}>
                        <span onClick={() => setTagDropdownOpen((prev) => !prev)} className="text-sm bg-border/50 outline-2 outline-dashed cursor-pointer outline-border p-2 rounded-full select-none hover:bg-border transition">+ Add Tag</span>
                        {tagDropdownOpen && <div className="absolute left-0 top-full mt-2 z-50 bg-bg-light border border-border rounded-xl shadow-xl w-60 overflow-hidden">
                            <div className="p-2 border-b border-border">
                                <input ref={tagInputRef} type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagInputKeyDown} placeholder="Search or enter custom tag…" className="w-full px-2 py-1.5 text-sm rounded-lg bg-bg-light border border-border focus:outline-none focus:ring-1 focus:ring-primary transition" autoComplete="off"/>
                            </div>
                            {tagInput.trim() && !activeChallenge.tags.includes(tagInput.trim()) &&
                                <button onClick={() => handleAddTag(tagInput)} className="w-full text-left cursor-pointer px-3 py-2 text-sm hover:bg-primary/20 transition flex items-center gap-2 border-b border-border">
                                    <FontAwesomeIcon icon={faPlus} className="text-xs text-muted" />
                                    <span>Add &ldquo;<strong>{tagInput.trim()}</strong>&rdquo;</span>
                                </button>
                            }

                            {ctfTagsToShow.length > 0 && <div className="max-h-44 overflow-y-auto">
                                <p className="px-3 pt-2 pb-1 text-xs text-muted uppercase tracking-wider flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faTag} className="text-[10px]" />
                                    CTF Categories
                                </p>
                            {ctfTagsToShow.map(tag => <button key={tag} onClick={() => handleAddTag(tag)} className="w-full text-left px-3 py-2 text-sm cursor-pointer hover:bg-primary/20 transition">{tag}</button>)}
                            </div>}

                            {filteredExistingTags.length > 0 && <div className={`max-h-40 overflow-y-auto ${ctfTagsToShow.length > 0 ? 'border-t border-border' : ''}`}>
                                <p className="px-3 pt-2 pb-1 text-xs text-muted uppercase tracking-wider">Existing Tags </p>
                                {filteredExistingTags.map(tag => <button key={tag} onClick={() => handleAddTag(tag)} className="w-full text-left cursor-pointer px-3 py-2 text-sm hover:bg-primary/20 transition">{tag}</button>)}
                            </div>}
                            {nothingToShow && <p className="px-3 py-3 text-sm text-muted">Type a name to create a custom tag.</p>}
                        </div>
                    }
                </div>
            </div>
            <hr className="my-2 border-border" />
            <h2 className="text-2xl">Description</h2>
            <MDXEditor
                key={`${activeChallenge.id}-description`}
                className="border border-border rounded-xl bg-bg-light"
                contentEditableClassName="text-text! min-h-[200px] p-4!"
                markdown={activeChallenge.description}
                onChange={(value) => workspaceStore.updateActiveChallengeField('description', value)}
                plugins={mdPlugins}
            />
            <hr className="my-2 border-border" />
            <h2 className="text-2xl">Solution</h2>
            <MDXEditor
                key={`${activeChallenge.id}-solution`}
                className="border border-border rounded-xl bg-bg-light"
                contentEditableClassName="text-text! min-h-[200px] p-4!"
                markdown={activeChallenge.solution}
                onChange={(value) => workspaceStore.updateActiveChallengeField('solution', value)}
                plugins={mdPlugins}
            />
            <hr className="my-2 border-border" />
            <h2 className="text-2xl">Flag</h2>
            <input
                type="text"
                value={activeChallenge.flag}
                onChange={(e) => workspaceStore.updateActiveChallengeField('flag', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-xl bg-bg-light focus:ring-1 focus:ring-primary focus:outline-none transition"
                placeholder="flag{...}"
            />
        </main>}
        <CreateChallengeModal open={createChallengeModalOpen} onClose={() => setCreateChallengeModalOpen(false)} onCreate={() => workspaceStore.loadChallenges()} />
        <ConfirmDeleteModal open={deleteChallengeModalOpen} onClose={() => setDeleteChallengeModalOpen(false)} onConfirm={handleDeleteChallenge} />
    </div>
}
