import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkspaceStore } from '../stores/workspaceStore'
import { faPlus, faXmark, faTag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { loadChallenges } from '../services/host'
import CreateChallengeModal from '../components/CreateChallengeModal'
// import { headingsPlugin, MDXEditor } from '@mdxeditor/editor'
// import '@mdxeditor/editor/style.css'

const CTF_DEFAULT_TAGS = [
    'pwn', 'forensics', 'cryptography', 'web', 'reversing',
    'misc', 'osint', 'steganography', 'network', 'binary exploitation',
    'hardware', 'blockchain', 'mobile', 'radio', 'sql injection',
    'xss', 'rop', 'ppc', 'trivia', 're',
]

export default function Workspace() {
    const navigate = useNavigate()
    const workspaceStore = useWorkspaceStore()
    const [challenges, setChallenges] = useState(workspaceStore.challenges)
    const [createChallengeModalOpen, setCreateChallengeModalOpen] = useState(false)

    const [tagDropdownOpen, setTagDropdownOpen] = useState(false)
    const [tagInput, setTagInput] = useState('')
    const tagDropdownRef = useRef<HTMLDivElement>(null)
    const tagInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!workspaceStore.name) navigate('/')
        load()
    }, [])

    useEffect(() => {
        if (tagDropdownOpen) tagInputRef.current?.focus()
    }, [tagDropdownOpen])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (tagDropdownRef.current && !tagDropdownRef.current.contains(e.target as Node)) {
                setTagDropdownOpen(false)
                setTagInput('')
            }
        }
        if (tagDropdownOpen) document.addEventListener('mousedown', handleClickOutside as unknown as EventListener)
        return () => document.removeEventListener('mousedown', handleClickOutside as unknown as EventListener)
    }, [tagDropdownOpen])

    const load = async () => {
        const fetchedChallenges = await loadChallenges(workspaceStore.location)
        setChallenges(fetchedChallenges)
        workspaceStore.setChallenges(fetchedChallenges)
    }

    const handleAddTag = async (tag: string) => {
        const trimmed = tag.trim()
        if (!trimmed || workspaceStore.activeChallenge?.tags.includes(trimmed)) return
        await workspaceStore.addTagToActiveChallenge(trimmed)
        setTagInput('')
        setTagDropdownOpen(false)
    }

    const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddTag(tagInput)
        } else if (e.key === 'Escape') {
            setTagDropdownOpen(false)
            setTagInput('')
        }
    }

    const handleRemoveTag = async (tag: string) => {
        await workspaceStore.removeTagFromActiveChallenge(tag)
    }

    const activeChallenge = workspaceStore.activeChallenge

    const allExistingTags = activeChallenge
        ? Array.from(new Set(challenges.flatMap((c) => c.tags))).filter(
              (tag) => !activeChallenge.tags.includes(tag)
          )
        : []

    const ctfTagsToShow = activeChallenge ? CTF_DEFAULT_TAGS.filter(
              (t) => !activeChallenge.tags.includes(t) && !allExistingTags.includes(t) && (!tagInput.trim() || t.toLowerCase().includes(tagInput.toLowerCase()))
            ) : []

    const filteredExistingTags = tagInput.trim() ? allExistingTags.filter((t) => t.toLowerCase().includes(tagInput.toLowerCase())) : allExistingTags

    const nothingToShow = !tagInput.trim() && ctfTagsToShow.length === 0 && filteredExistingTags.length === 0

    return (
        <div className="h-screen flex">
            <aside className="flex flex-col gap-2 w-[20vw] p-6 bg-bg-light border-r border-border">
                <h1 className="font-semibold uppercase tracking-wider">Workspace</h1>
                <span className="text-sm line-clamp-1 text-muted">{workspaceStore.name}</span>
                {workspaceStore.location && (<span className="text-xs text-muted line-clamp-1 break-all">{workspaceStore.location.replaceAll('\\', '/')}</span>)}
                <hr className="my-2 border-border" />
                <div className="flex flex-row justify-between items-center">
                    <h1 className="font-semibold uppercase tracking-wider">Challenges</h1>
                    <button onClick={() => setCreateChallengeModalOpen(true)} className="cursor-pointer text-muted">
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>
                {challenges.length === 0 ? (
                    <span className="text-sm text-muted">No challenges found.</span>
                ) : (
                    challenges.map((challenge) => (
                        <button key={challenge.id} onClick={() => workspaceStore.setActiveChallenge(challenge)} className={`text-left w-full p-2 rounded-xl line-clamp-1 cursor-pointer ${ workspaceStore.activeChallenge?.id === challenge.id ? 'bg-primary' : 'bg-border/50 hover:bg-border'} transition`}>
                            {challenge.title}
                        </button>
                    ))
                )}
            </aside>
            {!workspaceStore.activeChallenge ? (
                <main className="flex flex-col items-center justify-center flex-1 p-6">
                    <h1 className="text-3xl">Welcome to your Workspace!</h1>
                    <h2 className="text-xl mt-2 text-muted/90">{workspaceStore.name}</h2>
                    <span className="text-muted mt-2">Your CTF workspace is ready.</span>
                </main>
            ) : (
                <div className="flex flex-col gap-2 p-6 flex-1">
                    <h1 className="text-4xl">{workspaceStore.activeChallenge.title}</h1>
                    <hr className="my-2 border-border" />
                    <div className="flex flex-row gap-4 flex-wrap items-center">
                        {workspaceStore.activeChallenge.tags.map((tag) => (
                            <span key={tag} className="flex items-center gap-1 text-sm bg-primary/50 outline-2 outline-dashed outline-primary p-2 rounded-full group">
                                {tag}
                                <button onClick={() => handleRemoveTag(tag)} className="ml-1 text-xs opacity-60 hover:opacity-100 cursor-pointer transition" title="Remove tag">
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </span>
                        ))}
                        <div className="relative" ref={tagDropdownRef}>
                            <span onClick={() => setTagDropdownOpen((prev) => !prev)} className="text-sm bg-border/50 outline-2 outline-dashed cursor-pointer outline-border p-2 rounded-full select-none hover:bg-border transition">+ Add Tag</span>
                        {tagDropdownOpen && (
                            <div className="absolute left-0 top-full mt-2 z-50 bg-bg-light border border-border rounded-xl shadow-xl w-60 overflow-hidden">
                                <div className="p-2 border-b border-border">
                                    <input ref={tagInputRef} type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagInputKeyDown} placeholder="Search or enter custom tag…"
                                        className="w-full px-2 py-1.5 text-sm rounded-lg bg-bg-light border border-border focus:outline-none focus:ring-1 focus:ring-primary transition" autoComplete="off"/>
                                </div>
                                {tagInput.trim() && !workspaceStore.activeChallenge.tags.includes(tagInput.trim()) && (
                                    <button onClick={() => handleAddTag(tagInput)} className="w-full text-left px-3 py-2 text-sm hover:bg-primary/20 transition flex items-center gap-2 border-b border-border">
                                        <FontAwesomeIcon icon={faPlus} className="text-xs text-muted" />
                                            <span> Add &ldquo;<strong>{tagInput.trim()}</strong>&rdquo; </span>
                                    </button>
                                )}
                                {ctfTagsToShow.length > 0 && (
                                    <div className="max-h-44 overflow-y-auto">
                                        <p className="px-3 pt-2 pb-1 text-xs text-muted uppercase tracking-wider flex items-center gap-1.5">
                                            <FontAwesomeIcon icon={faTag} className="text-[10px]" />
                                                CTF Categories
                                        </p>
                                    {ctfTagsToShow.map((tag) => (
                                        <button key={tag} onClick={() => handleAddTag(tag)} className="w-full text-left px-3 py-2 text-sm hover:bg-primary/20 transition capitalize">{tag}</button>
                                    ))}
                                    </div>
                                    )}
                                {filteredExistingTags.length > 0 && (
                                    <div className={`max-h-40 overflow-y-auto ${ctfTagsToShow.length > 0 ? 'border-t border-border' : ''}`}>
                                        <p className="px-3 pt-2 pb-1 text-xs text-muted uppercase tracking-wider">Existing Tags </p>
                                            {filteredExistingTags.map((tag) => (
                                                <button key={tag} onClick={() => handleAddTag(tag)} className="w-full text-left px-3 py-2 text-sm hover:bg-primary/20 transition">{tag}</button>
                                            ))}
                                    </div>
                                )}
                                {nothingToShow && (
                                    <p className="px-3 py-3 text-sm text-muted">Type a name to create a custom tag.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <hr className="my-2 border-border" />
                <h2 className="text-2xl">Description</h2>
                </div>
            )}
            <CreateChallengeModal open={createChallengeModalOpen} onClose={() => setCreateChallengeModalOpen(false)} onCreate={load}/>
        </div>
    )
}
