import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateWorkspaceModal from '../components/CreateWorkspaceModal'
import { sendCommand } from '../services/host'
import { useWorkspaceStore } from '../stores/workspaceStore'
import type { Workspace } from '../utils/types'
import { Commands } from '../utils/commands'

export default function Launcher() {
    const workspaceStore = useWorkspaceStore()
    const navigate = useNavigate()
    const [createWorkspaceModal, setCreateWorkspaceModal] = useState(false)
    const [recentWorkspaces, setRecentWorkspaces] = useState<Workspace[]>([])

    const handleOpen = async() => {
        const workspace = await sendCommand<Workspace>(Commands.OpenWorkspace)
        if(!workspace) return
        workspaceStore.setWorkspace(workspace.name, workspace.path)
        navigate('/workspace')
    }

    useEffect(() => {
        const load = async() => {
            const workspaces = await sendCommand<Workspace[]>(Commands.LoadRecentWorkspaces)
            const sortedWorkspaces = workspaces.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            setRecentWorkspaces(sortedWorkspaces)
            await sendCommand(Commands.UpdateDiscordRPC, { details: "Launcher", state: "Browsing Workspaces" })
        }
        load()
    }, [])

    const formatDateString = (dateString: string): string => {
        const date = new Date(dateString)
        const now = new Date()
        if(now.getMilliseconds() - date.getMilliseconds() < 1000 * 60 * 60 * 24) return "Today"
        else if(now.getMilliseconds() - date.getMilliseconds() < 1000 * 60 * 60 * 24 * 2) return "Yesterday"
        else return date.toDateString()
    }

    return <div className="min-h-[calc(100vh-3rem)] flex">
        <aside className="flex flex-col gap-2 w-[20vw] bg-bg-light border-r border-border p-6">
            <h1 className="font-semibold uppercase">Recent Workspaces</h1>
            <span className="text-sm text-muted">Your recently opened workspaces</span>
            <hr className="my-2 border-border" />
            {recentWorkspaces.length === 0
                ? <span className="text-sm text-muted">No recent workspaces found.</span>
                : recentWorkspaces.map(workspace => <button
                    key={workspace.id}
                    onClick={async() => {
                        const openedWorkspace = await sendCommand<Workspace>(Commands.OpenRecentWorkspace, { path: workspace.path })
                        workspaceStore.setWorkspace(openedWorkspace.name, openedWorkspace.path)
                        navigate('/workspace')
                    }}
                    className="text-left w-full p-4 rounded-xl cursor-pointer bg-border/50 hover:bg-primary transition"
                >
                    <span className="font-semibold">{workspace.name}</span>
                    <span className="text-xs line-clamp-1 break-all">Last Updated: {formatDateString(workspace.updatedAt.toLocaleString())}</span>
                </button>)
            }
        </aside>
        <main className="flex-1 flex flex-col items-center justify-center p-6">
            <img src="/favicon.ico" alt="FlagForge Logo" className="w-24 h-24 mb-4" />
            <h1 className="text-3xl tracking-wider font-bold">FlagForge</h1>
            <p className="text-muted mt-2">CTF Writeup and Solving Made Easy.</p>
            <div className="p-4 rounded-xl bg-bg-light mt-6 w-[50%] border border-border">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col">
                        <p className="font-semibold">Create New Workspace</p>
                        <span className="text-sm text-muted">Create a new FlagForge workspace</span>
                    </div>
                    <button onClick={() => setCreateWorkspaceModal(true)} className="px-4 py-2 font-semibold bg-primary hover:bg-primary/90 rounded-xl cursor-pointer transition w-32">Create</button>
                </div>
                <hr className="my-4 border-border" />
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col">
                        <p className="font-semibold">Open Existing Workspace</p>
                        <span className="text-sm text-muted">Open an existing FlagForge workspace</span>
                    </div>
                    <button onClick={handleOpen} className="px-4 py-2 font-semibold border border-text/15 hover:bg-border rounded-xl cursor-pointer transition w-32">Open</button>
                </div>
            </div>
        </main>
        <CreateWorkspaceModal open={createWorkspaceModal} onClose={() => setCreateWorkspaceModal(false)} />
    </div>
}
