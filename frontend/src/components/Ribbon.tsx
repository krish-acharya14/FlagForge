import { faMagnifyingGlass, faMinus, faTag, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { closeWindow, minimizeWindow } from '../services/host'
import { useWorkspaceStore } from '../stores/workspaceStore'

export default function Ribbon() {
    const navigate = useNavigate()
    const location = useLocation()
    const isWorkspace = location.pathname.startsWith('/workspace')

    const searchQuery = useWorkspaceStore(s => s.searchQuery)
    const setSearchQuery = useWorkspaceStore(s => s.setSearchQuery)
    const challenges = useWorkspaceStore(s => s.challenges)
    const setActiveChallenge = useWorkspaceStore(s => s.setActiveChallenge)

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const results = useMemo(() => {
        const q = searchQuery.trim().toLowerCase()
        if(!q) return []
        return challenges.filter(c =>
            c.title.toLowerCase().includes(q) ||
            c.tags.some(t => t.toLowerCase().includes(q))
        ).slice(0, 8)
    }, [searchQuery, challenges])

    useEffect(() => {
        setDropdownOpen(results.length > 0 && searchQuery.trim().length > 0)
        setActiveIndex(-1)
    }, [results, searchQuery])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (challengeId: string) => {
        const challenge = challenges.find(c => c.id === challengeId)
        if(!challenge) return
        setActiveChallenge(challenge)
        setSearchQuery('')
        setDropdownOpen(false)
        if(!isWorkspace) navigate('/workspace')
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(!dropdownOpen) return
        if(e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex(i => Math.min(i + 1, results.length - 1))
        } else if(e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex(i => Math.max(i - 1, 0))
        } else if(e.key === 'Enter') {
            if(activeIndex >= 0 && results[activeIndex]) {
                handleSelect(results[activeIndex].id)
            }
        } else if(e.key === 'Escape') {
            setDropdownOpen(false)
            setSearchQuery('')
            inputRef.current?.blur()
        }
    }

    const highlightMatch = (text: string, query: string) => {
        const idx = text.toLowerCase().indexOf(query.toLowerCase())
        if(idx === -1) return <span>{text}</span>
        return <>
            {text.slice(0, idx)}
            <mark className="bg-primary/40 text-inherit rounded px-0">{text.slice(idx, idx + query.length)}</mark>
            {text.slice(idx + query.length)}
        </>
    }

    return <div className="top-0 sticky flex flex-row justify-between items-center bg-bg-light border-b border-border z-50">
        <div onClick={() => navigate('/')} className="flex flex-row items-center gap-2 px-4 py-1 cursor-pointer shrink-0">
            <img src="/favicon.ico" alt="FlagForge Logo" className="w-8 h-8" />
            <h1 className="tracking-wider font-bold">FlagForge</h1>
        </div>

        {isWorkspace && (
            <div className="flex-1 max-w-md mx-4 relative" ref={containerRef}>
                <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs pointer-events-none z-10"
                />
                <input ref={inputRef} type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={() => { if(results.length > 0) setDropdownOpen(true) }} onKeyDown={handleKeyDown} placeholder="Search challenges by name or tag…" className="w-full pl-8 pr-8 py-1.5 text-sm rounded-lg bg-bg border border-border focus:outline-none focus:ring-1 focus:ring-primary transition placeholder:text-muted"/>
                {searchQuery && (
                    <button onClick={() => { setSearchQuery(''); setDropdownOpen(false) }} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-text transition cursor-pointer z-10">
                        <FontAwesomeIcon icon={faXmark} className="text-xs" />
                    </button>
                )}

                {dropdownOpen && results.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-bg-light border border-border rounded-xl shadow-2xl overflow-hidden z-50">
                        {results.map((challenge, idx) => {
                            const q = searchQuery.trim().toLowerCase()
                            const isSolved = /^.+\{.+\}$/.test(challenge.flag.trim())
                            const matchingTags = challenge.tags.filter(t => t.toLowerCase().includes(q))
                            return (
                                <button key={challenge.id} onMouseDown={() => handleSelect(challenge.id)} onMouseEnter={() => setActiveIndex(idx)} className={`w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 transition cursor-pointer border-b border-border/50 last:border-0 ${idx === activeIndex ? 'bg-primary/20' : 'hover:bg-border/30'}`}>
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className={`shrink-0 w-2 h-2 rounded-full ${isSolved ? 'bg-success' : 'bg-muted/40'}`} title={isSolved ? 'Solved' : 'Unsolved'} />
                                        <span className="text-sm font-medium truncate">
                                            {highlightMatch(challenge.title, searchQuery.trim())}
                                        </span>
                                    </div>
                                    {matchingTags.length > 0 && (
                                        <div className="flex items-center gap-1 shrink-0">
                                            <FontAwesomeIcon icon={faTag} className="text-[9px] text-muted" />
                                            {matchingTags.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-text/80">
                                                    {highlightMatch(tag, searchQuery.trim())}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                        {challenges.filter(c =>
                            c.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
                            c.tags.some(t => t.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                        ).length > 8 && (
                            <p className="text-center text-xs text-muted py-2">Showing first 8 results — refine your query</p>
                        )}
                    </div>
                )}

                {dropdownOpen && results.length === 0 && searchQuery.trim() && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-bg-light border border-border rounded-xl shadow-2xl overflow-hidden z-50">
                        <p className="px-4 py-3 text-sm text-muted">No challenges match &ldquo;{searchQuery}&rdquo;</p>
                    </div>
                )}
            </div>
        )}

        <div className="flex flex-row items-center shrink-0">
            <button onClick={async() => await minimizeWindow()} className="w-10 h-10 cursor-pointer hover:bg-border transition"><FontAwesomeIcon icon={faMinus} /></button>
            <button onClick={async() => await closeWindow()} className="w-10 h-10 cursor-pointer hover:bg-primary transition"><FontAwesomeIcon icon={faXmark} /></button>
        </div>
    </div>
}
