import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkspaceStore } from '../stores/workspaceStore'

export default function Workspace() {
    const navigate = useNavigate()
    const workspaceStore = useWorkspaceStore()

    useEffect(() => {
        if(!workspaceStore.name) navigate('/')
    }, [])

    return <div className="h-screen flex">
        <aside className="flex flex-col gap-2 w-[20vw] p-6 bg-bg-light border-r border-border">
            <h1 className="font-semibold uppercase tracking-wider">Workspace</h1>
            <span className="text-sm line-clamp-1 text-muted">{workspaceStore.name}</span>
            {workspaceStore.location && (
                <span className="text-xs text-muted line-clamp-1 break-all">
                    {workspaceStore.location.replaceAll('\\', '/')}
                </span>
            )}
        </aside>
        <main className="flex flex-col items-center justify-center flex-1 p-6">
            <h1 className="text-3xl">Welcome to your Workspace!</h1>
            <h2 className="text-xl mt-2 text-muted/90">{workspaceStore.name}</h2>
            <span className="text-muted mt-2">Your CTF workspace is ready.</span>
        </main>
    </div>
}
