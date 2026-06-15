import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Background from '../components/Background'
import CreateWorkspaceModal from '../components/CreateWorkspaceModal'
import { openWorkspace, restoreWindow } from '../services/host'
import { useWorkspaceStore } from '../stores/workspaceStore'

export default function Launcher() {
    const workspaceStore = useWorkspaceStore()
    const navigate = useNavigate()
    const [createWorkspaceModal, setCreateWorkspaceModal] = useState(false)
 
    useEffect(() => {
        const restore = async() => { await restoreWindow() }
        restore()
    }, [])
 
    const handleOpen = async() => {
        const workspace = await openWorkspace()
        if(!workspace) return
        workspaceStore.setWorkspace(workspace.name, '')
        navigate('/workspace')
    }

    return <div className="relative h-screen flex text-white">
        <div className="absolute inset-0 -z-10"><Background /></div>
        <aside className="flex flex-col w-64 bg-gray-800/85 opacity-70 border-r border-gray-700 p-6 backdrop-blur-sm">
            <h1 className="text-xl">Recent Workspaces</h1>
            <span className="text-sm text-gray-400">Your recently opened workspaces</span>
            <span className="text-sm text-gray-400 mt-10">No recent workspaces</span>
        </aside>
        <main className="flex-1 flex flex-col items-center justify-center p-6">
            <img src="/favicon.ico" alt="FlagForge Logo" className="w-24 h-24 mb-4 drop-shadow-[0_0_24px_rgba(6,182,212,0.18)]" />
            <h1 className="text-3xl tracking-wider font-bold">FlagForge</h1>
            <p className="text-gray-400 mt-2">CTF Writeup and Solving Made Easy.</p>
            <div className="p-4 rounded-xl bg-gray-800/85 mt-6 w-[80%] border border-gray-700/80 opacity-80 backdrop-blur-sm">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col">
                        <p className="font-semibold">Create New Workspace</p>
                        <span className="text-sm text-gray-400">Create a new FlagForge workspace</span>
                    </div>
                    <button onClick={() => setCreateWorkspaceModal(true)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-xl cursor-pointer transition text-white w-24">Create</button>
                </div>
                <hr className="my-4 border-gray-700" />
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col">
                        <p className="font-semibold">Open Existing Workspace</p>
                        <span className="text-sm text-gray-400">Open an existing FlagForge workspace</span>
                    </div>
                    <button onClick={handleOpen} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-xl cursor-pointer transition text-white w-24">Open</button>
                </div>
            </div>
        </main>
        <CreateWorkspaceModal open={createWorkspaceModal} onClose={() => setCreateWorkspaceModal(false)} />
    </div>
}
