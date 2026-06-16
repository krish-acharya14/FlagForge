import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateWorkspaceModal from '../components/CreateWorkspaceModal'
import { openWorkspace } from '../services/host'
import { useWorkspaceStore } from '../stores/workspaceStore'

export default function Launcher() {
    const workspaceStore = useWorkspaceStore()
    const navigate = useNavigate()
    const [createWorkspaceModal, setCreateWorkspaceModal] = useState(false)
 
    const handleOpen = async() => {
        const workspace = await openWorkspace()
        if(!workspace) return
        workspaceStore.setWorkspace(workspace.name, `${workspace.location}\\${workspace.name}`)
        navigate('/workspace')
    }

    return <div className="h-screen flex">
        <aside className="flex flex-col gap-2 w-[20vw] bg-bg-light border-r border-border p-6">
            <h1 className="font-semibold uppercase">Recent Workspaces</h1>
            <span className="text-sm text-muted">Your recently opened workspaces</span>
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
